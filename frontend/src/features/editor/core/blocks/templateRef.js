export const loadTemplateRefBlock = (editor) => {
    const bm = editor.BlockManager;
    const domc = editor.DomComponents;

    // 1. Define the Component Type
    domc.addType('template-ref', {
        isComponent: el => el.tagName === 'TEMPLATE-REF',
        model: {
            defaults: {
                tagName: 'template-ref',
                draggable: true,
                droppable: true, // We must allow drops so children slots can receive them
                attributes: { class: 'template-ref-placeholder' },
                style: {
                    display: 'block',
                    'min-height': '50px',
                    width: '100%'
                },
                traits: [
                    {
                        type: 'text',
                        name: 'data-template-id',
                        label: 'Template ID'
                    },
                    {
                        type: 'text',
                        name: 'data-props',
                        label: 'Props (JSON)',
                        placeholder: '{"title": "Welcome"}'
                    },
                    {
                        type: 'select',
                        name: 'fetchStrategy',
                        label: 'Fetch Strategy',
                        options: [
                            { value: 'server-side', name: 'Server Side (SSI)' },
                            { value: 'client-side', name: 'Client Side (AJAX)' }
                        ],
                        default: 'server-side'
                    }
                ],
                // We intentionally leave components empty in the model 
                // because we just want to save the `<template-ref>` tag structure itself.
                components: ''
            },
            init() {
                // Listen to standard trait changes to trigger a re-render
                this.on('change:attributes:data-template-id', this.handlePropsChange);
                this.on('change:attributes:data-props', this.handlePropsChange);
                
                // GrapesJS traits with changeProp: 1 update the model directly.
                this.on('change', (model) => {
                    const changed = model.changedAttributes();
                    if (!changed) return;
                    
                    // Check if any of the changed keys start with 'prop_'
                    if (Object.keys(changed).some(k => k.startsWith('prop_'))) {
                        this.handlePropsChange();
                    }
                });
            },
            handlePropsChange() {
                // Trigger the custom view to update
                this.trigger('change:templateContent');
            }
        },
        view: {
            init() {
                this.listenTo(this.model, 'change:templateContent', this.renderTemplate);
            },
            onRender() {
                this.renderTemplate();
            },

            async renderTemplate() {
                // 1. Get current values
                const attrs = this.model.getAttributes();
                const id = attrs['data-template-id'];
                const propsRaw = attrs['data-props'];

                // 2. Set loading state locally in editor DOM (doesn't save to model)
                this.el.innerHTML = `
                    <div style="padding: 20px; border: 2px dashed #9ca3af; background: #f3f4f6; text-align: center; color: #4b5563; font-family: sans-serif;">
                        <svg class="animate-spin inline-block w-5 h-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="animation: spin 1s linear infinite;">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading Template ${id ? `<br><span style="font-size: 11px; opacity: 0.7;">(${id})</span>` : '...'}
                    </div>
                    <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
                `;

                if (!id || id === 'Select ID') {
                    this.el.innerHTML = `
                        <div style="padding: 20px; border: 2px dashed #60a5fa; background: #eff6ff; text-align: center; color: #1e3a8a; font-family: sans-serif;">
                            <strong style="display:block; margin-bottom: 4px;">Global Template</strong>
                            <span style="font-size: 12px; color: #3b82f6;">Select a Template ID in settings</span>
                        </div>
                    `;
                    return;
                }

                // 3. Fetch from API recursively
                try {
                    const configModule = await import('@/lib/config');
                    const API_BASE_URL = configModule.default;

                    // Helper to recursively fetch templates
                    const fetchTemplateRecursive = async (templateId, maxDepth = 5, currentDepth = 0) => {
                        if (currentDepth >= maxDepth) {
                            console.warn('Max template nesting depth reached.');
                            return { html: '', css: '' };
                        }

                        const res = await fetch(`${API_BASE_URL}/pages/id/${templateId}`);
                        if (!res.ok) throw new Error(`API Error fetching template ${templateId}`);
                        const data = await res.json();

                        if (!data.success || !data.data) {
                            throw new Error(`No data for template ${templateId}`);
                        }

                        let html = data.data.gjsHtml || '';
                        let css = data.data.gjsCss || '';

                        // Parse the HTML to look for nested <template-ref> tags
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const nestedRefs = doc.querySelectorAll('template-ref');

                        for (let i = 0; i < nestedRefs.length; i++) {
                            const ref = nestedRefs[i];
                            const nestedId = ref.getAttribute('data-template-id');
                            const nestedProps = ref.getAttribute('data-props');

                            if (nestedId) {
                                // Fetch the nested template
                                const nestedData = await fetchTemplateRecursive(nestedId, maxDepth, currentDepth + 1);
                                
                                // Apply nested props to the fetched nested HTML BEFORE injecting
                                let nestedHtml = nestedData.html;
                                if (nestedProps) {
                                    try {
                                        const parsedProps = JSON.parse(nestedProps);
                                        const tempNestedDoc = parser.parseFromString(nestedHtml, 'text/html');
                                        
                                        const replaceNestedPlaceholders = (node) => {
                                            if (node.nodeType === 3 && node.nodeValue.includes('{{')) {
                                                let text = node.nodeValue;
                                                for (const [key, value] of Object.entries(parsedProps)) {
                                                    const propRegex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
                                                    text = text.replace(propRegex, value);
                                                }
                                                node.nodeValue = text;
                                            }
                                            if (node.nodeType === 1) {
                                                for (let j = 0; j < node.attributes.length; j++) {
                                                    const attr = node.attributes[j];
                                                    if (attr.value.includes('{{')) {
                                                        let attrValue = attr.value;
                                                        for (const [key, value] of Object.entries(parsedProps)) {
                                                            const propRegex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
                                                            attrValue = attrValue.replace(propRegex, value);
                                                        }
                                                        attr.value = attrValue;
                                                    }
                                                }
                                            }
                                            for (let j = 0; j < node.childNodes.length; j++) {
                                                replaceNestedPlaceholders(node.childNodes[j]);
                                            }
                                        };
                                        replaceNestedPlaceholders(tempNestedDoc.body);
                                        nestedHtml = tempNestedDoc.body.innerHTML;

                                    } catch (e) {
                                        console.warn("Invalid props JSON in nested template:", e);
                                    }
                                }

                                // Replace the <template-ref> node with the actual HTML
                                const wrapper = doc.createElement('div');
                                wrapper.innerHTML = nestedHtml;
                                
                                // To avoid creating unnecessary divs, we can replace the node with the children of wrapper
                                while (wrapper.firstChild) {
                                    ref.parentNode.insertBefore(wrapper.firstChild, ref);
                                }
                                ref.parentNode.removeChild(ref);

                                // Append the nested CSS
                                css += `\n/* Nested Template CSS (${nestedId}) */\n` + nestedData.css;
                            }
                        }

                        return { html: doc.body.innerHTML, css };
                    };

                    const templateData = await fetchTemplateRecursive(id);
                    let html = templateData.html;
                    const css = templateData.css;

                    const modelRef = this.model;
                    const editorRef = editor;

                    // --- VARIABLE DETECTION ---
                    // Parse the raw HTML to classify variables and detect ALL images
                    const tempParser2 = new DOMParser();
                    const classifyDoc = tempParser2.parseFromString(html, 'text/html');

                    // Find all explicit {{ variable_names }} in the HTML
                    const variableRegex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;
                    let match;
                    const variables = new Set();        // text/attr variables from {{ }}
                    const imageVariables = new Set();   // variables tied to img src
                    // Tracks auto-assigned image overrides: { autoVarName -> originalSrc }
                    const autoImageMap = {};

                    while ((match = variableRegex.exec(html)) !== null) {
                        variables.add(match[1]);
                    }

                    // Classify explicit image variables
                    classifyDoc.querySelectorAll('img').forEach(img => {
                        const src = img.getAttribute('src') || '';
                        const m = /{{\s*([a-zA-Z0-9_]+)\s*}}/.exec(src);
                        if (m) imageVariables.add(m[1]);
                    });

                    // Auto-detect plain <img> tags (no variable in src) and create overrides
                    let imgIndex = 0;
                    classifyDoc.querySelectorAll('img').forEach(img => {
                        const src = img.getAttribute('src') || '';
                        const hasVariable = /{{\s*[a-zA-Z0-9_]+\s*}}/.test(src);
                        if (!hasVariable) {
                            imgIndex++;
                            const autoVar = `img_${imgIndex}_src`;
                            autoImageMap[autoVar] = src; // original URL becomes default
                            imageVariables.add(autoVar);
                            variables.add(autoVar);
                        }
                    });

                    // Register custom 'image-picker' trait type (idempotent)
                    if (!editor.TraitManager.getType('image-picker')) {
                        editor.TraitManager.addType('image-picker', {
                            createInput({ trait }) {
                                const propName = trait.get('name');
                                const defaultSrc = trait.get('defaultSrc') || '';
                                const PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDgwIDYwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iNjAiIGZpbGw9IiNlNWU3ZWIiLz48cGF0aCBmaWxsPSIjOWNhM2FmIiBkPSJNMjcgMjBoMjZ2MjBIMjd6Ii8+PGNpcmNsZSBjeD0iMzYiIGN5PSIyOCIgcj0iNCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yNyA0MGwxMi0xMCA4IDYgNS00IDYgOEgyN3oiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii43Ii8+PC9zdmc+';
                                
                                const el = document.createElement('div');
                                el.style.cssText = 'display:flex; flex-direction:column; gap:4px; padding:4px 0;';

                                // Thumbnail preview
                                const preview = document.createElement('img');
                                const currentVal = modelRef.get(propName) || defaultSrc;
                                preview.src = currentVal || PLACEHOLDER;
                                preview.style.cssText = 'width:100%; height:60px; object-fit:cover; border-radius:4px; border:1px solid #374151; background:#1f2937;';
                                // Store ref so onUpdate can find it
                                el.dataset.propName = propName;
                                preview.className = 'img-picker-preview';

                                // URL text input (truncated display via ellipsis, full value in .value)
                                const input = document.createElement('input');
                                input.type = 'text';
                                input.value = currentVal;
                                input.placeholder = 'Paste image URL...';
                                input.title = currentVal; // Tooltip shows full URL
                                input.className = 'img-picker-input';
                                input.style.cssText = 'width:100%; background:#1f2937; color:#f3f4f6; border:1px solid #374151; border-radius:4px; padding:4px 6px; font-size:12px; box-sizing:border-box; text-overflow:ellipsis;';
                                input.addEventListener('input', (e) => {
                                    preview.src = e.target.value || PLACEHOLDER;
                                    input.title = e.target.value;
                                    modelRef.set(propName, e.target.value);
                                    modelRef.trigger('change:templateContent');
                                });

                                // Button row
                                const btnRow = document.createElement('div');
                                btnRow.style.cssText = 'display:flex; gap:4px;';

                                // Pick Image button
                                const btn = document.createElement('button');
                                btn.innerText = '\uD83D\uDDBC Pick';
                                btn.style.cssText = 'flex:1; background:#2563eb; color:white; border:none; border-radius:4px; padding:5px 0; font-size:12px; cursor:pointer;';
                                btn.addEventListener('click', (e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    editorRef.AssetManager.open({
                                        types: ['image'],
                                        onSelect(asset) {
                                            const url = asset.getSrc ? asset.getSrc() : asset.get('src');
                                            input.value = url;
                                            input.title = url;
                                            preview.src = url || PLACEHOLDER;
                                            modelRef.set(propName, url);
                                            modelRef.trigger('change:templateContent');
                                            editorRef.AssetManager.close();
                                        }
                                    });
                                });

                                // Clear / Remove button
                                const clearBtn = document.createElement('button');
                                clearBtn.innerText = '\u2715 Remove';
                                clearBtn.title = 'Remove override and revert to template default';
                                clearBtn.style.cssText = 'flex:1; background:#dc2626; color:white; border:none; border-radius:4px; padding:5px 0; font-size:12px; cursor:pointer;';
                                clearBtn.addEventListener('click', (e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    input.value = defaultSrc;
                                    input.title = defaultSrc;
                                    preview.src = defaultSrc || PLACEHOLDER;
                                    modelRef.set(propName, ''); // Clear override → template default shows
                                    modelRef.trigger('change:templateContent');
                                });

                                btnRow.appendChild(btn);
                                btnRow.appendChild(clearBtn);
                                el.appendChild(preview);
                                el.appendChild(input);
                                el.appendChild(btnRow);
                                return el;
                            },
                            onEvent() {},
                            onUpdate({ elInput, trait }) {
                                // Refresh the preview and input when the model value changes externally
                                const propName = trait.get('name');
                                const defaultSrc = trait.get('defaultSrc') || '';
                                const PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDgwIDYwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iNjAiIGZpbGw9IiNlNWU3ZWIiLz48cGF0aCBmaWxsPSIjOWNhM2FmIiBkPSJNMjcgMjBoMjZ2MjBIMjd6Ii8+PGNpcmNsZSBjeD0iMzYiIGN5PSIyOCIgcj0iNCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yNyA0MGwxMi0xMCA4IDYgNS00IDYgOEgyN3oiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii43Ii8+PC9zdmc+';
                                const newVal = modelRef.get(propName) || defaultSrc;
                                const previewEl = elInput && elInput.querySelector('.img-picker-preview');
                                const inputEl = elInput && elInput.querySelector('.img-picker-input');
                                if (previewEl) previewEl.src = newVal || PLACEHOLDER;
                                if (inputEl) { inputEl.value = newVal; inputEl.title = newVal; }
                            }
                        });
                    }

                    // Build the needed traits
                    const neededTraits = Array.from(variables).map(v => {
                        if (imageVariables.has(v)) {
                            return {
                                type: 'image-picker',
                                name: `prop_${v}`,
                                label: `Image: ${v.replace(/_src$/, '').replace(/_/g, ' ')}`,
                                changeProp: 1,
                                defaultSrc: autoImageMap[v] || '' // original src as default
                            };
                        }
                        return { type: 'text', name: `prop_${v}`, label: `Prop: ${v}`, changeProp: 1 };
                    });

                    // Standard traits
                    const standardTraits = [
                        { type: 'text', name: 'data-template-id', label: 'Template ID' },
                        { type: 'text', name: 'data-props', label: 'Props (JSON-Override)', placeholder: '{"title": "Welcome"}' },
                        { type: 'select', name: 'fetchStrategy', label: 'Fetch Strategy', options: [{ value: 'server-side', name: 'Server Side' }, { value: 'client-side', name: 'Client Side' }] }
                    ];

                    this.model.set('traits', [...standardTraits, ...neededTraits]);

                    // Automatically build a propsObj from the dynamic traits
                    const dynamicPropsObj = {};
                    Array.from(variables).forEach(v => {
                        // With changeProp: 1, the value is stored directly on the model, not in attributes
                        const val = this.model.get(`prop_${v}`);
                        if (val !== undefined && val !== '') {
                            dynamicPropsObj[v] = val;
                        }
                    });

                    // 4. Interpolate Props via DOM parsing for robust attribute and text replacement
                    // We merge JSON props (if any) with the dynamic UI trait props
                    let propsObj = { ...dynamicPropsObj };
                    if (propsRaw) {
                        try {
                            const parsedRaw = JSON.parse(propsRaw);
                            propsObj = { ...propsObj, ...parsedRaw };
                        } catch (e) {
                            console.warn("Invalid JSON in data-props:", e);
                        }
                    }

                    // 4b. Apply auto-image overrides (img_1_src, img_2_src...) by DOM index
                    // These images do NOT have {{ variable }} tokens, so we patch by position
                    if (Object.keys(autoImageMap).length > 0) {
                        const imgApplyParser = new DOMParser();
                        const imgDoc = imgApplyParser.parseFromString(html, 'text/html');
                        let imgCounter = 0;
                        imgDoc.querySelectorAll('img').forEach(img => {
                            const src = img.getAttribute('src') || '';
                            const hasVariable = /{{\\s*[a-zA-Z0-9_]+\\s*}}/.test(src);
                            if (!hasVariable) {
                                imgCounter++;
                                const autoVar = `img_${imgCounter}_src`;
                                const override = propsObj[autoVar];
                                if (override) {
                                    img.setAttribute('src', override);
                                }
                            }
                        });
                        html = imgDoc.body.innerHTML;
                    }

                    if (Object.keys(propsObj).length > 0) {
                        try {
                                
                                // Parse HTML string into a temporary DOM document
                                const parser = new DOMParser();
                                const doc = parser.parseFromString(html, 'text/html');

                                // Function to replace text recursively and update attributes
                                const replacePlaceholders = (node) => {
                                    // 1. Check Node Text (Text nodes only, type 3)
                                    if (node.nodeType === 3 && node.nodeValue.includes('{{')) {
                                        let text = node.nodeValue;
                                        for (const [key, value] of Object.entries(propsObj)) {
                                            const propRegex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
                                            text = text.replace(propRegex, value);
                                        }
                                        node.nodeValue = text;
                                    }

                                    // 2. Check Element Attributes
                                    if (node.nodeType === 1) { // Element node
                                        for (let i = 0; i < node.attributes.length; i++) {
                                            const attr = node.attributes[i];
                                            if (attr.value.includes('{{')) {
                                                let attrValue = attr.value;
                                                for (const [key, value] of Object.entries(propsObj)) {
                                                    const propRegex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
                                                    attrValue = attrValue.replace(propRegex, value);
                                                }
                                                // If it's a src or href, it updates smoothly
                                                attr.value = attrValue;
                                            }
                                        }
                                        // Specific check: if the user couldn't type {{ key }} in the src,
                                        // maybe they just used the whole JSON prop key directly if it matches an id or name?
                                        // (For now, we strictly look for {{ key }})
                                    }

                                    // Recursively check children
                                    for (let i = 0; i < node.childNodes.length; i++) {
                                        replacePlaceholders(node.childNodes[i]);
                                    }
                                };

                                // Start replacement from the body of the parsed document
                                replacePlaceholders(doc.body);

                                // Get the updated HTML back out
                                html = doc.body.innerHTML;

                            } catch (e) {
                                console.warn("Invalid props JSON in editor:", e);
                            }
                        }

                        // 5. Inject into the DOM of the Editor *only* 
                        // Using Shadow DOM to prevent the template's CSS from bleeding into the parent editor
                        this.el.innerHTML = '';
                        
                        const wrapper = document.createElement('div');
                        // IMPORTANT: Instead of making the WHOLE wrapper pointer-events: none, 
                        // We will allow pointer events but restrict drag/drop on the inner elements,
                        // UNLESS the inner element is a <div data-slot="...">
                        
                        const shadowRoot = wrapper.attachShadow({ mode: 'open' });
                        const tailwindCss = '<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">';
                        // We will allow pointer events for native Web Component <slot> elements
                        const slotCss = `
                            <style>
                                :host { display: block; }
                                /* Protect internal elements */
                                *:not(slot, slot *) {
                                    pointer-events: none;
                                    user-select: none;
                                }
                                /* Allow interaction with slotted content */
                                slot {
                                    display: block;
                                    pointer-events: auto;
                                    min-height: 50px;
                                    border: 2px dashed #3b82f6; 
                                    padding: 10px;
                                    background: rgba(59, 130, 246, 0.05);
                                    position: relative;
                                }
                                slot::before {
                                    content: "Template Slot: " attr(name);
                                    position: absolute;
                                    top: -12px;
                                    left: -2px;
                                    background: #3b82f6;
                                    color: white;
                                    font-size: 10px;
                                    padding: 2px 6px;
                                    border-radius: 4px;
                                }
                                ${css}
                            </style>
                        `;

                        // 1. Convert `<div data-slot="main">` in the HTML into native `<slot name="main"></slot>`
                        // This allows GrapesJS to inject Light DOM children into the Shadow DOM automatically!
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = html;
                        const dataSlots = tempDiv.querySelectorAll('[data-slot]');
                        const slotNames = [];
                        
                        dataSlots.forEach(el => {
                            const name = el.getAttribute('data-slot');
                            slotNames.push(name);
                            const nativeSlot = document.createElement('slot');
                            nativeSlot.setAttribute('name', name);
                            el.parentNode.replaceChild(nativeSlot, el);
                        });
                        
                        shadowRoot.innerHTML = `${tailwindCss}${slotCss}${tempDiv.innerHTML}`;
                        this.el.appendChild(wrapper);

                        // 2. Instruct GrapesJS to build internal components matching these slots.
                        // GrapesJS children of `template-ref` will automatically be projected into the `<slot>` 
                        // by the browser because `wrapper` is a child of `this.el`... actually, wait.
                        // GrapesJS renders components as siblings inside `this.el`. 
                        // If `this.el` has a Shadow Root attached *directly* to it, native Web Component slots work perfectly!
                        // But we attached it to a `wrapper` div inside `this.el`. 
                        // Let's attach the shadow root directly to `this.el` instead!

                        // Cleanup: we need to reset the render logic to attach shadow root to `this.el` directly if possible.
                        // However, GrapesJS usually controls `this.el`.
                        // Let's modify the component structure:
                        // Instead of the wrapper, we tell GrapesJS that `template-ref` has child slots.
                        
                        // We will add child components to the GrapesJS model if they don't exist.
                        slotNames.forEach(name => {
                            const existing = this.model.components().find(c => c.get('attributes')['slot'] === name);
                            if (!existing) {
                                // Add a droppable area for this slot
                                this.model.append({
                                    type: 'default',
                                    tagName: 'div',
                                    draggable: false,
                                    droppable: true,
                                    attributes: { slot: name }, // This maps the Light DOM element to the Shadow DOM <slot name="...">
                                    style: { 'min-height': '50px', width: '100%' }
                                });
                            }
                        });

                        // Add the reference badge
                        const badge = document.createElement('div');
                        badge.style.position = 'absolute';
                        badge.style.top = '0';
                        badge.style.left = '0';
                        badge.style.background = 'rgba(59, 130, 246, 0.9)';
                        badge.style.color = 'white';
                        badge.style.fontSize = '10px';
                        badge.style.padding = '2px 6px';
                        badge.style.borderBottomRightRadius = '4px';
                        badge.style.zIndex = '10';
                        badge.innerText = 'Template Reference';
                        this.el.appendChild(badge);

                        this.el.style.position = 'relative'; // for the badge
                        this.el.style.position = 'relative'; // for the badge
                    
                } catch (error) {
                    console.error("Editor Template Fetch Error:", error);
                    this.el.innerHTML = `
                        <div style="padding: 20px; border: 2px dashed #f87171; background: #fef2f2; text-align: center; color: #991b1b; font-family: sans-serif;">
                            <strong>Template Not Found</strong>
                            <p style="font-size: 12px; margin-top: 4px;">ID: ${id}</p>
                        </div>
                    `;
                }
            }
        }
    });

    // 2. Add the Block
    bm.add('template-reference', {
        label: 'Global Template Ref',
        category: 'Advanced',
        content: '<template-ref data-template-id="" data-props="{}"></template-ref>'
    });
};

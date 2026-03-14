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
                droppable: false,
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
                // Listen to trait changes to trigger a re-render
                this.on('change:attributes:data-template-id', this.handlePropsChange);
                this.on('change:attributes:data-props', this.handlePropsChange);
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

                // 3. Fetch from API
                try {
                    // We must dynamically import API_BASE_URL to avoid cyclic dependencies in grapesjs init scope
                    // Alternatively, we can assume the global or use a relative path if the admin portal is served on same origin
                    // In this context, NEXT_PUBLIC_API_URL or config is preferable:
                    const configModule = await import('@/lib/config');
                    const API_BASE_URL = configModule.default;

                    const res = await fetch(`${API_BASE_URL}/pages/id/${id}`);
                    if (!res.ok) throw new Error('API Error');
                    const data = await res.json();
                    
                    if (data.success && data.data) {
                        let html = data.data.gjsHtml || '';
                        const css = data.data.gjsCss || '';

                        // 4. Interpolate Props via DOM parsing for robust attribute and text replacement
                        if (propsRaw) {
                            try {
                                const propsObj = JSON.parse(propsRaw);
                                
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
                        wrapper.style.pointerEvents = 'none';
                        wrapper.style.userSelect = 'none';
                        
                        const shadowRoot = wrapper.attachShadow({ mode: 'open' });
                        // We also need to inject Tailwind since Shadow DOM is isolated from the canvas Tailwind link
                        const tailwindCss = '<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">';
                        const safeCss = css ? `<style>${css}</style>` : '';
                        shadowRoot.innerHTML = `${tailwindCss}${safeCss}${html}`;
                        
                        this.el.appendChild(wrapper);

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
                    } else {
                        throw new Error('No data');
                    }
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

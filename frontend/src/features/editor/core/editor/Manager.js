import grapesjs from 'grapesjs';
import { gjsConfig } from './config';
import API_BASE_URL from '@/lib/config';
import gjsCustomCode from 'grapesjs-custom-code';
import gjsCkeditor from 'grapesjs-plugin-ckeditor';
import { adminService } from '@/services/adminService';
// Import 'grapesjs/dist/css/grapes.min.css'; // This normally needs to be imported in global CSS or locally

const ensureCodeMirror = () => {
    return new Promise((resolve) => {
        if (window.CodeMirror) return resolve(window.CodeMirror);

        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css';
        document.head.appendChild(cssLink);

        const themeLink = document.createElement('link');
        themeLink.rel = 'stylesheet';
        themeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/material-ocean.min.css';
        document.head.appendChild(themeLink);

        const jsScript = document.createElement('script');
        jsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js';
        jsScript.onload = () => {
            let loaded = 0;
            const scripts = [
                'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/xml/xml.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/javascript/javascript.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/css/css.min.js',
                'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/htmlmixed/htmlmixed.min.js'
            ];
            scripts.forEach(src => {
                const s = document.createElement('script');
                s.src = src;
                s.onload = () => {
                    loaded++;
                    if (loaded === scripts.length) resolve(window.CodeMirror);
                };
                document.head.appendChild(s);
            });
        };
        document.head.appendChild(jsScript);
    });
};

export const initEditor = (pageId) => {
    // Clone config to avoid mutation
    const config = { ...gjsConfig };

    // Set dynamic URLs for storage
    // Assuming the API is proxied via Next.js to http://localhost:3005
    // We need to use full URL for client-side fetch if proxy implies different port
    const API_URL = `${API_BASE_URL}/pages`;

    // We are loading a specific page
    // Actually storageManager remote is tricky with specific IDs in URL properties
    // We might handle load saving manually via axios to have full control

    // Let's use local storageManager for now to just getting it running
    // config.storageManager.type = 'local';

    // Better: We configure it to NOT autoload/autosave and we handle it manually
    config.storageManager.type = null;

    // Register plugins
    if (!config.plugins) config.plugins = [];
    config.plugins.push(gjsCustomCode);

    // We wrap gjsCkeditor to intercept GrapeJS's setCustomRte and prevent crashes on inline tags
    config.plugins.push((editorInstance, opts) => {
        const originalSetCustomRte = editorInstance.setCustomRte.bind(editorInstance);
        editorInstance.setCustomRte = (rteConfig) => {
            if (rteConfig && rteConfig.enable) {
                const originalEnable = rteConfig.enable;
                rteConfig.enable = function (el, rte) {
                    // CKEditor 4 does not support inline editing on span, b, i, a, etc.
                    // If we pass an unsupported element, CKEditor throws an error and breaks the editor.
                    const unsupported = ['span', 'a', 'b', 'i', 'strong', 'em', 'small', 'code'];
                    if (el.tagName && unsupported.includes(el.tagName.toLowerCase())) {
                        console.warn(`CKEditor blocked on <${el.tagName.toLowerCase()}> to prevent crash. Falling back to native contentEditable.`);
                        el.contentEditable = true;
                        if (rte && rte.focus) rte.focus();
                        return { 
                            focus: () => el.focus(),
                            getData: () => el.innerHTML,
                            destroy: () => { el.contentEditable = false; }
                        };
                    }
                    return originalEnable.apply(this, arguments);
                };
            }
            return originalSetCustomRte(rteConfig);
        };
        gjsCkeditor(editorInstance, opts);
    });

    // CKEditor plugin options
    if (!config.pluginsOpts) config.pluginsOpts = {};
    config.pluginsOpts[gjsCkeditor] = {
        position: 'center',
        options: {
            startupFocus: true,
            versionCheck: false,
            extraAllowedContent: '*(*);*{*}',  // Allow all classes and inline styles
            allowedContent: true,
            toolbar: [
                { name: 'styles', items: ['Format', 'Font', 'FontSize'] },
                { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript'] },
                { name: 'colors', items: ['TextColor', 'BGColor'] },
                { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
                { name: 'links', items: ['Link', 'Unlink'] },
                { name: 'insert', items: ['Table', 'HorizontalRule', 'SpecialChar'] },
                { name: 'tools', items: ['Maximize', 'Source'] },
            ],
            // Remove element path at the bottom
            removePlugins: 'elementspath',
        },
        onToolbar: (el) => {
            el.style.minWidth = '400px';
        },
    };

    const editor = grapesjs.init(config);

    // ── Register Custom Traits ───────────────────────────────────────────────
    editor.Traits.addType('select-api', {
        createInput({ trait }) {
            const el = document.createElement('div');
            el.innerHTML = `
                <select class="gjs-field gjs-field-select" style="width:100%; cursor:pointer;">
                    <option value="">Loading...</option>
                </select>
            `;
            const input = el.querySelector('select');
            const apiMethod = trait.get('apiMethod') || 'getTestimonials';

            const loadOptions = async () => {
                try {
                    const data = await adminService[apiMethod]();
                    input.innerHTML = '<option value="">-- Select --</option>';
                    data.forEach(item => {
                        const option = document.createElement('option');
                        option.value = item._id;
                        option.textContent = item.name || item.title || item.slug || item._id;
                        input.appendChild(option);
                    });
                    input.value = trait.getTarget().get(trait.getName()) || '';
                } catch (err) {
                    input.innerHTML = '<option value="">Error loading</option>';
                    console.error('Failed to load trait options', err);
                }
            };

            loadOptions();
            return el;
        },
        onEvent({ elInput, component, trait }) {
            const value = elInput.querySelector('select').value;
            component.set(trait.getName(), value);
        },
        onUpdate({ elInput, component, trait }) {
            const value = component.get(trait.getName());
            elInput.querySelector('select').value = value || '';
        }
    });

    // ── Testimonial Picker Trait (Multi-Select Modal) ────────────────────────
    editor.Traits.addType('testimonial-picker', {
        noLabel: true,
        createInput({ component }) {
            const el = document.createElement('div');
            el.style.padding = '10px 0';
            el.innerHTML = `
                <button class="gjs-btn-prim" style="width:100%; padding:10px; font-weight:700; background:#f97316; border:none; border-radius:4px; cursor:pointer;">
                    ✨ Manage Students
                </button>
                <div style="font-size:11px; margin-top:6px; color:#9ca3af; text-align:center;">
                    Select which students appear in the slider
                </div>
            `;
            
            el.querySelector('button').onclick = async () => {
                const modal = editor.Modal;
                modal.setTitle('Select Testimonials');
                
                // Show loading in modal
                modal.setContent('<div style="padding:40px; text-align:center; color:#fff;">Loading students...</div>');
                modal.open();
                
                try {
                    const students = await adminService.getTestimonials();
                    const currentIds = (component.get('prop_selected_ids') || '').split(',').filter(Boolean);
                    
                    const container = document.createElement('div');
                    container.style.padding = '20px';
                    container.style.color = '#fff';
                    container.style.fontFamily = 'sans-serif';
                    
                    let html = `
                        <div style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:14px; color:#9ca3af;">Checking a student adds them to the slider</span>
                            <button id="modal-apply" class="gjs-btn-prim" style="padding:8px 24px; font-weight:700;">Apply Selection</button>
                        </div>
                        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:12px; max-height:400px; overflow-y:auto; padding-right:10px;">
                    `;
                    
                    students.forEach(student => {
                        const isChecked = currentIds.includes(student._id);
                        html += `
                            <label style="display:flex; align-items:center; gap:12px; padding:12px; background:#1e293b; border-radius:8px; cursor:pointer; border:1px solid ${isChecked ? '#f97316' : '#334155'}; transition:all 0.2s;">
                                <input type="checkbox" value="${student._id}" ${isChecked ? 'checked' : ''} style="width:18px; height:18px; accent-color:#f97316; cursor:pointer;" />
                                <div style="flex:1;">
                                    <div style="font-weight:600; font-size:14px;">${student.name}</div>
                                    <div style="font-size:11px; color:#9ca3af;">${student.target_pages?.join(', ') || 'Student'}</div>
                                </div>
                            </label>
                        `;
                    });
                    
                    html += `</div>`;
                    container.innerHTML = html;
                    
                    // Add interactivity
                    container.querySelectorAll('label').forEach(label => {
                        const checkbox = label.querySelector('input');
                        checkbox.onchange = () => {
                            label.style.borderColor = checkbox.checked ? '#f97316' : '#334155';
                            label.style.background = checkbox.checked ? '#0f172a' : '#1e293b';
                        };
                    });
                    
                    container.querySelector('#modal-apply').onclick = () => {
                        const selected = Array.from(container.querySelectorAll('input:checked')).map(cb => cb.value);
                        component.set('prop_selected_ids', selected.join(','));
                        
                        // Force a complete refresh of the sidebar traits to ensure the button persists
                        component.set('_force_trait_reset', true, { silent: true });
                        
                        modal.close();
                        // Trigger re-render of the component
                        component.view.renderTemplate();
                    };
                    
                    modal.setContent(container);
                    
                } catch (err) {
                    modal.setContent(`<div style="padding:40px; color:#ef4444; text-align:center;">Failed to load students: ${err.message}</div>`);
                }
            };
            
            return el;
        }
    });

    // Add Direct Raw Code Editing Feature
    editor.Commands.add('core:custom-edit-code', {
        run(editor, sender) {
            const selected = editor.getSelected();
            if (!selected) return;

            const content = document.createElement('div');
            content.style.cssText = 'padding: 10px; display: flex; flex-direction: column; gap: 10px; height: 500px;';

            // ── SPECIAL UI FOR TEMPLATE-REF COMPONENTS ────────────────────────
            if (selected.get('type') === 'template-ref') {
                const templateId = selected.getAttributes()['data-template-id'] || '';
                if (!templateId) return;

                // Extract the FULLY RENDERED HTML from the browser view directly!
                const viewEl = selected.view?.el;
                let actualHtml = '';
                if (viewEl) {
                    const contentDiv = viewEl.querySelector('.template-ref-content > div');
                    if (contentDiv) {
                        actualHtml = contentDiv.innerHTML;
                    }
                }

                if (!actualHtml) {
                    actualHtml = '<p>Component loading... please try again.</p>';
                }

                content.innerHTML = `
                    <div style="font-size: 13px; color: #94a3b8; margin-bottom: 5px; display:flex; justify-content:space-between; align-items:flex-end;">
                        <div>
                            <div style="font-weight:bold; color:#e2e8f0; font-size: 15px;">Smart HTML Local Property Editor</div>
                            <div style="margin-top:2px;">Edit text, colors, and images inside the <b>data-var="..."</b> attributes. All changes are saved ONLY to this page.</div>
                            <div style="color:#ef4444; margin-top:2px; font-weight:bold;">CRITICAL: If a tag does not have a data-var="..." attribute, your changes will NOT be saved!</div>
                        </div>
                    </div>
                     <textarea id="gjs-edit-props-textarea" style="flex: 1; width: 100%; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 13px; padding: 15px; background: #0f172a; color: #10b981; border: 1px solid #334155; border-radius: 6px; outline: none; resize: none; line-height: 1.5;" spellcheck="false"></textarea>
                    
                    <div id="gjs-edit-code-error" style="display:none; margin-top:10px; padding:10px; background:#fef2f2; border:1px solid #ef4444; border-radius:4px; color:#b91c1c; font-size:13px; font-weight:600;"></div>

                    <div style="display: flex; justify-content: space-between; align-items:center; margin-top: 10px;">
                        <a href="/admin/editor/${templateId}" target="_blank" style="padding: 8px 16px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 13px;">Edit Main Template ↗</a>
                        
                        <div style="display: flex; gap: 10px;">
                            <button id="gjs-edit-code-cancel" style="padding: 8px 16px; background: transparent; color: #94a3b8; border: 1px solid #475569; border-radius: 4px; cursor: pointer; font-weight: bold;">Cancel</button>
                            <button id="gjs-edit-code-unlink-local" style="padding: 8px 16px; background: #fb923c; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;" title="Detaches this section from the master template entirely and applies your exact HTML">✂️ Unlink & Save Static</button>
                            <button id="gjs-edit-code-save-local" style="padding: 8px 16px; background: #10b981; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;" title="Extracts text/images and saves them as local overrides">Apply Variables</button>
                        </div>
                    </div>
                `;

                const textarea = content.querySelector('#gjs-edit-props-textarea');
                const cancelBtn = content.querySelector('#gjs-edit-code-cancel');
                const saveLocalBtn = content.querySelector('#gjs-edit-code-save-local');
                const unlinkLocalBtn = content.querySelector('#gjs-edit-code-unlink-local');
                const errorBox = content.querySelector('#gjs-edit-code-error');

                const formatHTML = (htmlStr) => {
                    let formatted = '';
                    let indent = '';
                    const tab = '  ';
                    let processHtml = htmlStr.replace(/>/g, '>\n').replace(/</g, '\n<');
                    let lines = processHtml.split('\n').filter(line => line.trim() !== '');
                    for (let i = 0; i < lines.length; i++) {
                        let line = lines[i].trim();
                        if (!line) continue;
                        if (line.match(/^<\//)) indent = indent.substring(tab.length);
                        formatted += indent + line + '\n';
                        if (line.match(/^<[^\/][^>]*>$/) && !line.match(/<\s*(img|br|input|hr|meta|link)[^>]*>/i) && !line.match(/\/>$/)) indent += tab;
                    }
                    return formatted.trim();
                };

                const formattedOriginalHtml = formatHTML(actualHtml);
                textarea.value = formattedOriginalHtml;

                let cmProps;
                ensureCodeMirror().then((CM) => {
                    if (!document.body.contains(textarea)) return;
                    cmProps = CM.fromTextArea(textarea, {
                        mode: 'htmlmixed',
                        theme: 'material-ocean',
                        lineNumbers: true,
                        lineWrapping: true
                    });
                    cmProps.setSize('100%', '100%');
                    cmProps.getWrapperElement().style.flex = "1";
                    cmProps.getWrapperElement().style.fontFamily = "ui-monospace, SFMono-Regular, Consolas, monospace";
                    cmProps.getWrapperElement().style.fontSize = "13px";
                    cmProps.getWrapperElement().style.borderRadius = "6px";
                    cmProps.getWrapperElement().style.marginTop = "10px";
                });

                cancelBtn.onclick = () => editor.Modal.close();

                // Unlink completely
                unlinkLocalBtn.onclick = () => {
                    const newHtml = cmProps ? cmProps.getValue() : textarea.value;
                    const parent = selected.parent();
                    const index = selected.index();
                    selected.remove();
                    if (parent) {
                        const newEl = parent.components().add(newHtml, { at: index });
                        editor.select(newEl);
                    } else {
                        editor.setComponents(newHtml);
                    }
                    editor.Modal.close();
                };

                // Keep Link, save Local Overrides
                saveLocalBtn.onclick = () => {
                    errorBox.style.display = 'none';
                    try {
                        const newHtml = cmProps ? cmProps.getValue() : textarea.value;

                        if (newHtml === formattedOriginalHtml) {
                            editor.Modal.close();
                            return;
                        }

                        // Create a DOM tree from the user's edited HTML
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(newHtml, 'text/html');

                        // Check if they mutated text or styles that don't have a data-var!
                        const origDoc = parser.parseFromString(formattedOriginalHtml, 'text/html');
                        origDoc.querySelectorAll('[data-var], [data-var-src]').forEach(el => { el.innerHTML = ''; el.removeAttribute('src'); });
                        const newDocCheck = parser.parseFromString(newHtml, 'text/html');
                        newDocCheck.querySelectorAll('[data-var], [data-var-src]').forEach(el => { el.innerHTML = ''; el.removeAttribute('src'); });

                        // If they changed static tags or CSS styles, trigger a Confirm dialog
                        if (origDoc.body.innerHTML !== newDocCheck.body.innerHTML) {
                            const wantsToUnlink = confirm(
                                "⚠️ You changed static HTML or CSS styles!\n\n" +
                                "Because this section is securely linked to a Main Template, you cannot change its layout or CSS styles here without breaking the link.\n\n" +
                                "👉 Click 'OK' to DETACH this section from the Main Template and save your custom CSS for this page only.\n\n" +
                                "👉 Click 'Cancel' to keep the link and ONLY save the text/image variables."
                            );

                            if (wantsToUnlink) {
                                // Execute the exact same logic as Unlink Button
                                const parent = selected.parent();
                                const index = selected.index();
                                selected.remove();
                                if (parent) {
                                    const newEl = parent.components().add(newHtml, { at: index });
                                    editor.select(newEl);
                                } else {
                                    editor.setComponents(newHtml);
                                }
                                editor.Modal.close();
                                return;
                            }
                            // If they clicked Cancel, it proceeds to only extract text variables below!
                        }

                        // Get current props
                        const rawPropsStr = selected.getAttributes()['data-props'] || '{}';
                        let props = {};
                        try {
                            props = JSON.parse(rawPropsStr.replace(/&quot;/g, '"'));
                        } catch (e) { }

                        // 1. Extract mapped Text variables (innerHTML updates)
                        const varEls = doc.querySelectorAll('[data-var]');
                        let foundTexts = 0;
                        varEls.forEach(el => {
                            const varName = el.getAttribute('data-var');
                            if (varName) {
                                props[varName] = el.innerHTML.trim();
                                foundTexts++;
                            }
                        });

                        // 2. Extract mapped Image variables (src updates)
                        const srcEls = doc.querySelectorAll('[data-var-src]');
                        let foundImgs = 0;
                        srcEls.forEach(el => {
                            const varName = el.getAttribute('data-var-src');
                            const src = el.getAttribute('src');
                            if (varName && src) {
                                props[varName] = src;
                                foundImgs++;
                            }
                        });

                        // Update the component attributes and traits
                        selected.addAttributes({ 'data-props': JSON.stringify(props) });
                        for (const key in props) {
                            const trait = selected.getTrait(`prop_${key}`);
                            if (trait) {
                                trait.set('value', props[key], { avoidStore: true });
                            } else {
                                selected.set(`prop_${key}`, props[key]);
                            }
                        }

                        // Force a re-render
                        selected.trigger('change:templateContent');
                        editor.Modal.close();

                    } catch (err) {
                        alert("An error occurred while saving your changes. Please check the code for any missing brackets or syntax errors. Error: " + err.message);
                    }
                };

                editor.Modal.setTitle('</> Smart Variable Editor');
                editor.Modal.setContent(content);
                editor.Modal.open();
                return;
            }

            // ── NORMAL UI FOR REGULAR COMPONENTS ─────────────────────────────
            // Get component HTML (without GrapesJS script wrapper)
            const fullHtml = selected.toHTML();
            // Strip any GrapesJS-generated script IIFE wrappers from the HTML display
            const htmlOnly = fullHtml.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').trim();

            // Read the component's script property directly (GrapesJS stores it here)
            let componentScript = selected.get('script') || '';

            // In GrapesJS, scripts can be stored as literal functions or strings 
            // representing functions (e.g., "function() { ... }").
            // We need to unwrap them so the user just sees the raw code.
            const unwrapScript = (scriptStr) => {
                const str = scriptStr.trim();
                const match = str.match(/^(?:function\s*\([^)]*\)\s*\{|(?:\(\)\s*=>\s*\{(?:\s*)))([\s\S]*)\s*\}$/);
                if (match) {
                    return match[1].trim();
                }
                return str;
            };

            if (typeof componentScript === 'function') {
                componentScript = unwrapScript(componentScript.toString());
            } else if (typeof componentScript === 'string' && componentScript.trim() !== '') {
                componentScript = unwrapScript(componentScript);
            } else {
                componentScript = '';
            }

            const tabBaseStyle = 'padding:7px 18px; font-size:13px; font-weight:700; cursor:pointer; border:none; border-radius:6px 6px 0 0; transition:all 0.15s; letter-spacing:0.3px;';
            const activeTabStyle = 'background:#0f172a; border:1px solid #334155; border-bottom:1px solid #0f172a;';
            const inactiveTabStyle = 'background:#1e293b; border:1px solid transparent; border-bottom:1px solid #334155;';

            content.innerHTML = `
                <div style="display:flex; align-items:flex-end; gap:2px; margin-bottom:-1px; position:relative; z-index:1;">
                    <button id="gjs-tab-html" style="${tabBaseStyle} ${activeTabStyle} color:#60a5fa;">
                        &lt;/&gt; HTML
                    </button>
                    <button id="gjs-tab-css" style="${tabBaseStyle} ${inactiveTabStyle} color:#c084fc;">
                        # CSS
                    </button>
                    <button id="gjs-tab-js" style="${tabBaseStyle} ${inactiveTabStyle} color:#fbbf24;">
                        ƒ JavaScript
                    </button>
                </div>
                <textarea id="gjs-edit-code-textarea" style="flex:1; width:100%; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size:14px; padding:15px; background:#0f172a; color:#e2e8f0; border:1px solid #334155; border-radius:0 6px 6px 6px; outline:none; resize:none; line-height:1.6;" spellcheck="false"></textarea>
                <textarea id="gjs-edit-css-textarea" style="flex:1; width:100%; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size:14px; padding:15px; background:#0f172a; color:#c084fc; border:1px solid #334155; border-radius:0 6px 6px 6px; outline:none; resize:none; display:none; line-height:1.6;" spellcheck="false" placeholder="/* Append custom CSS rules here */"></textarea>
                <textarea id="gjs-edit-js-textarea" style="flex:1; width:100%; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size:14px; padding:15px; background:#0f172a; color:#fbbf24; border:1px solid #334155; border-radius:0 6px 6px 6px; outline:none; resize:none; display:none; line-height:1.6;" spellcheck="false" placeholder="// Write your JavaScript here...&#10;// 'this' refers to the component's DOM element.&#10;// The script runs when the page renders."></textarea>
                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
                    <button id="gjs-edit-code-cancel" style="padding:8px 16px; background:#334155; color:#fff; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">Cancel</button>
                    <button id="gjs-edit-code-save" style="padding:8px 16px; background:#2563eb; color:#fff; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">Save Changes</button>
                </div>
            `;

            const htmlTextarea = content.querySelector('#gjs-edit-code-textarea');
            const cssTextarea = content.querySelector('#gjs-edit-css-textarea');
            const jsTextarea = content.querySelector('#gjs-edit-js-textarea');

            const tabHtmlBtn = content.querySelector('#gjs-tab-html');
            const tabCssBtn = content.querySelector('#gjs-tab-css');
            const tabJsBtn = content.querySelector('#gjs-tab-js');

            let activeTabName = 'html';
            const switchTab = (tab) => {
                activeTabName = tab;
                const setDisplay = (el, val) => { if (el) el.style.display = val; };

                if (window.cmHtml && window.cmCss && window.cmJs && document.body.contains(window.cmHtml.getWrapperElement())) {
                    setDisplay(window.cmHtml.getWrapperElement(), tab === 'html' ? 'block' : 'none');
                    setDisplay(window.cmCss.getWrapperElement(), tab === 'css' ? 'block' : 'none');
                    setDisplay(window.cmJs.getWrapperElement(), tab === 'js' ? 'block' : 'none');
                    if (tab === 'html') window.cmHtml.refresh();
                    if (tab === 'css') window.cmCss.refresh();
                    if (tab === 'js') window.cmJs.refresh();
                } else {
                    setDisplay(htmlTextarea, tab === 'html' ? 'block' : 'none');
                    setDisplay(cssTextarea, tab === 'css' ? 'block' : 'none');
                    setDisplay(jsTextarea, tab === 'js' ? 'block' : 'none');
                }

                [tabHtmlBtn, tabCssBtn, tabJsBtn].forEach(btn => btn && (btn.style.cssText = `${tabBaseStyle} ${inactiveTabStyle}`));
                if (tab === 'html') tabHtmlBtn.style.cssText = `${tabBaseStyle} ${activeTabStyle} color:#60a5fa;`;
                if (tab === 'css') tabCssBtn.style.cssText = `${tabBaseStyle} ${activeTabStyle} color:#c084fc;`;
                if (tab === 'js') tabJsBtn.style.cssText = `${tabBaseStyle} ${activeTabStyle} color:#fbbf24;`;
            };
            tabHtmlBtn.onclick = () => switchTab('html');
            tabCssBtn.onclick = () => switchTab('css');
            tabJsBtn.onclick = () => switchTab('js');

            // Format HTML helper
            const formatHTML = (htmlStr) => {
                let formatted = '';
                let indent = '';
                const tab = '  ';
                const lines = htmlStr.split(/>\s*</);
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i];
                    if (i !== 0) line = '<' + line;
                    if (i !== lines.length - 1) line = line + '>';
                    if (line.match(/^<\/[^>]+>$/)) {
                        indent = indent.substring(tab.length);
                    }
                    formatted += indent + line + '\n';
                    if (line.match(/^<[^\/][^>]*>$/) && !line.match(/<\s*(img|br|input|hr|meta|link)[^>]*>/i) && !line.match(/\/>$/)) {
                        indent += tab;
                    }
                }
                return formatted.trim();
            };

            htmlTextarea.value = formatHTML(htmlOnly);

            let componentCss = '';
            try { componentCss = editor.CodeManager.getCode(selected, 'css', { cssc: editor.CssComposer }) || ''; } catch (e) { }
            cssTextarea.value = componentCss;

            if (componentScript && componentScript !== '') {
                jsTextarea.value = componentScript;
            }

            content.querySelector('#gjs-edit-code-cancel').onclick = () => {
                editor.Modal.close();
            };

            content.querySelector('#gjs-edit-code-save').onclick = () => {
                const isCmReady = window.cmHtml && document.body.contains(window.cmHtml.getWrapperElement());
                const newHtml = isCmReady ? window.cmHtml.getValue() : htmlTextarea.value;
                const newCss = isCmReady ? window.cmCss.getValue() : cssTextarea.value;
                const newJs = (isCmReady ? window.cmJs.getValue() : jsTextarea.value).trim();

                if (!newHtml) return;

                const oldId = selected.getId(); 

                // VERY IMPORTANT: Change the old component's ID temporarily so GrapeJS's parser 
                // doesn't see a duplicate ID collision when parsing `id="oldId"` in the new HTML string!
                selected.setId(oldId + '-deprecated');

                // We inject the original ID back into the raw HTML string so it natively retains the ID
                let injectedHtml = newHtml;
                if (oldId && !newHtml.includes(`id="${oldId}"`) && !newHtml.includes(`id='${oldId}'`)) {
                    injectedHtml = newHtml.replace(/^\s*<([a-zA-Z0-9\-]+)/, `<$1 id="${oldId}"`);
                }

                // Use native replaceWith ONLY for the HTML. 
                const newComps = selected.replaceWith(injectedHtml);
                const newComp = Array.isArray(newComps) ? newComps[0] : newComps;

                if (newComp) {
                    // Safe guard: Always assert the ID bounds matching the CSS rule
                    if (oldId) newComp.setId(oldId);

                    // 1. Wipe existing CSS specifically targeting oldId to avoid stacking ghosts
                    if (oldId) {
                        try {
                            const cssc = editor.CssComposer;
                            const rules = cssc.getAll();
                            // Safely remove all rules targeting this exact ID backwards
                            for (let i = rules.length - 1; i >= 0; i--) {
                                const r = rules.at(i);
                                if (r && r.getSelectorsString() === `#${oldId}`) {
                                    rules.remove(r);
                                }
                            }
                        } catch (e) {
                            console.error("Error clearing old CSS", e);
                        }
                    }

                    // 2. Push the new CSS via the dedicated parser directly into the Composer database
                    // This is the 100% official GrapesJS way to map strings to rules natively
                    if (newCss.trim()) {
                        try {
                            const parsedCss = editor.Parser.parseCss(newCss);
                            editor.CssComposer.getAll().add(parsedCss);
                        } catch (e) {
                            console.error("GrapesJS CSS parsing error", e);
                        }
                    }

                    if (newJs) {
                        try {
                            newComp.set('script', newJs);
                        } catch (e) {
                            console.error("Error setting script", e);
                            newComp.set('script', newJs);
                        }
                    } else {
                        newComp.set('script', '');
                    }
                    editor.select(newComp);
                }

                setTimeout(() => editor.trigger('change:canvasOffset'), 100);
                editor.Modal.close();
            };

            editor.Modal.setTitle('</> Edit Component Code');
            editor.Modal.setContent(content);
            editor.Modal.open();

            // Setup CodeMirror instances
            ensureCodeMirror().then((CM) => {
                if (!document.body.contains(htmlTextarea)) return;

                window.cmHtml = CM.fromTextArea(htmlTextarea, {
                    mode: 'htmlmixed',
                    theme: 'material-ocean',
                    lineNumbers: true,
                    lineWrapping: true
                });
                window.cmCss = CM.fromTextArea(cssTextarea, {
                    mode: 'css',
                    theme: 'material-ocean',
                    lineNumbers: true,
                    lineWrapping: true
                });
                window.cmJs = CM.fromTextArea(jsTextarea, {
                    mode: 'javascript',
                    theme: 'material-ocean',
                    lineNumbers: true,
                    lineWrapping: true
                });

                window.cmHtml.setSize('100%', '100%');
                window.cmCss.setSize('100%', '100%');
                window.cmJs.setSize('100%', '100%');

                const styleWrapper = (wrap) => {
                    wrap.style.flex = "1";
                    wrap.style.borderRadius = "0 6px 6px 6px";
                    wrap.style.fontFamily = "ui-monospace, SFMono-Regular, Consolas, monospace";
                    wrap.style.fontSize = "14px";
                    wrap.style.height = "100%";
                };

                styleWrapper(window.cmHtml.getWrapperElement());
                styleWrapper(window.cmCss.getWrapperElement());
                styleWrapper(window.cmJs.getWrapperElement());

                switchTab(activeTabName);
            });

            // Widen modal
            setTimeout(() => {
                const modalDialog = editor.Modal.getModel().get('dEl');
                if (modalDialog) {
                    modalDialog.style.width = '80%';
                    modalDialog.style.maxWidth = '1000px';
                    modalDialog.style.height = '80vh';
                    modalDialog.style.display = 'flex';
                    modalDialog.style.flexDirection = 'column';

                    const modalContent = modalDialog.querySelector('.gjs-mdl-content');
                    if (modalContent) {
                        modalContent.style.flex = '1';
                        modalContent.style.display = 'flex';
                        modalContent.style.height = '100%';
                    }
                }

                content.style.height = '100%';
            }, 0);
        }
    });

    editor.on('component:selected', (model) => {
        // Prevent adding on root wrapper or certain system components
        if (model.is('wrapper')) return;

        const toolbar = model.get('toolbar');
        if (toolbar) {
            const hasEditCode = toolbar.some(t => t.command === 'core:custom-edit-code');
            if (!hasEditCode) {
                const newToolbar = [
                    {
                        command: 'core:custom-edit-code',
                        label: '<svg viewBox="0 0 24 24" width="13" height="13" style="display:block;margin:auto;"><path fill="currentColor" d="M14.6 16.6l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4m-5.2 0L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4z"></path></svg>',
                        attributes: { title: 'Edit Code (Raw)' }
                    },
                    ...toolbar
                ];
                model.set('toolbar', newToolbar);
            }
        }

        // ── Auto-Show Hidden Course/Tab Sections when their Nav is selected in Editor ──
        // This makes decomposed HTML components clickable and navigatable within the editor natively
        let sidebarItem = null;
        let tabItem = null;
        
        let curr = model;
        while (curr) {
            const attrs = curr.getAttributes();
            if (attrs['data-sidebar-item']) sidebarItem = attrs['data-sidebar-item'];
            if (attrs['data-tab']) tabItem = attrs['data-tab'];
            if (sidebarItem || tabItem) break;
            curr = curr.parent();
        }

        if (sidebarItem || tabItem) {
            const wrapper = editor.getWrapper();
            if (wrapper) {
                if (sidebarItem) {
                    const sections = wrapper.find('[data-sidebar-section]');
                    sections.forEach(sec => {
                        const secIdx = sec.getAttributes()['data-sidebar-section'];
                        sec.addStyle({ display: String(secIdx) === String(sidebarItem) ? 'block' : 'none' });
                    });
                }
                if (tabItem) {
                    const sections = wrapper.find('[data-tab-pane]');
                    sections.forEach(sec => {
                        const attrs = sec.getAttributes();
                        const secIdx = attrs['data-tab-pane'];
                        // Make sure we only affect the ones configured correctly 
                        if (secIdx) {
                            sec.addStyle({ display: String(secIdx) === String(tabItem) ? 'block' : 'none' });
                        }
                    });
                }
            }
        }
    });

    // Synchronize canvas highlighting and securely clean up corrupted database icons
    const updateCanvasHighlights = (model) => {
        if (!model || model.is('wrapper')) return;

        // Cleanup corrupted icons globally so they get saved cleanly
        let iconStr = model.get('icon');
        if (typeof iconStr === 'string' && (iconStr.includes('<span') || iconStr.includes('<div'))) {
            let s = iconStr;
            s = s.replace(/<span style="background:#(?:fbbf24|c084fc)[^>]+>(?:JS|CSS)<\/span>\s*/gi, '');
            s = s.replace(/<div title="Has[^>]*>[^<]*<\/div>/gi, '');
            s = s.replace(/<div style="width:14px;height:14px[^>]*>[^<]*<\/div>/gi, '');
            s = s.replace(/<div style="display:flex;\s*align-items:center;">(.*?)<\/div>/gi, '$1');
            const newIcon = s.trim();
            if (newIcon !== iconStr) {
                model.set('__orig_icon', undefined);
                model.set('icon', newIcon);
            }
        }

        const hasJs = model.get('script') && model.get('script').trim() !== '';

        let hasCss = false;
        try {
            const rules = editor.CssComposer.getAll().models;
            const selStr = `#${model.getId()}`;
            for (let i = 0; i < rules.length; i++) {
                if (rules[i].getSelectorsString() === selStr) {
                    hasCss = true; break;
                }
            }
        } catch (e) { }

        // Set ephemeral DOM attribute for in-canvas visual highlight
        if (model.view && model.view.el && model.view.el.setAttribute) {
            const el = model.view.el;
            if (hasJs && hasCss) el.setAttribute('data-gjs-has-custom', 'both');
            else if (hasJs) el.setAttribute('data-gjs-has-custom', 'js');
            else if (hasCss) el.setAttribute('data-gjs-has-custom', 'css');
            else el.removeAttribute('data-gjs-has-custom');
        }
    };

    editor.on('load', () => {
        // Disable dashed borders (outline) everywhere by default to clean up the UI
        editor.Commands.stop('sw-visibility');
        editor.Commands.stop('core:component-outline');

        // Forcefully hide CKEditor upgrade warnings that ignore the versionCheck option
        if (!document.getElementById('gjs-cke-warning-fix')) {
            const style = document.createElement('style');
            style.id = 'gjs-cke-warning-fix';
            style.innerHTML = `
                .cke_notifications_area,
                .cke_notification_warning, 
                .cke_notification_info { 
                    display: none !important; 
                    opacity: 0 !important; 
                    visibility: hidden !important; 
                    height: 0 !important; 
                    pointer-events: none !important;
                }
            `;
            document.head.appendChild(style);
        }

        // --- Floating Toggle Button for Component Highlights ---
        const gjsContainer = editor.getContainer();
        if (gjsContainer && !document.getElementById('gjs-toggle-borders')) {
            const toggleBtn = document.createElement('div');
            toggleBtn.id = 'gjs-toggle-borders';
            toggleBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke-dasharray="4 4"></rect>
                </svg>
            `;
            toggleBtn.title = "Toggle Block Highlights (Borders)";
            toggleBtn.style.cssText = `
                position: absolute;
                bottom: 20px;
                right: 320px; /* Offset from the traits panel */
                width: 44px;
                height: 44px;
                background: #1e293b;
                color: #cbd5e1;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 100 !important;
                box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
                transition: all 0.2s ease;
                border: 2px solid rgba(255,255,255,0.1);
            `;
            
            const updateState = () => {
                if (editor.Commands.isActive('sw-visibility')) {
                    toggleBtn.style.background = '#3b82f6';
                    toggleBtn.style.color = '#fff';
                    toggleBtn.style.borderColor = '#60a5fa';
                } else {
                    toggleBtn.style.background = '#1e293b';
                    toggleBtn.style.color = '#cbd5e1';
                    toggleBtn.style.borderColor = 'rgba(255,255,255,0.1)';
                }
            };

            toggleBtn.addEventListener('mouseenter', () => toggleBtn.style.transform = 'scale(1.1)');
            toggleBtn.addEventListener('mouseleave', () => toggleBtn.style.transform = 'scale(1)');
            
            toggleBtn.addEventListener('click', () => {
                if (editor.Commands.isActive('sw-visibility')) {
                    editor.Commands.stop('sw-visibility');
                } else {
                    editor.Commands.run('sw-visibility');
                }
                updateState();
            });

            gjsContainer.style.position = 'relative';
            gjsContainer.appendChild(toggleBtn);
            
            // Sync initial state
            updateState();
            editor.on('run:sw-visibility stop:sw-visibility', updateState);
        }

        // Add visual highlighting CSS directly to the Canvas frame
        const canvasDoc = editor.Canvas.getDocument();
        if (canvasDoc && !canvasDoc.getElementById('gjs-canvas-custom-highlights')) {
            const style = canvasDoc.createElement('style');
            style.id = 'gjs-canvas-custom-highlights';
            style.innerHTML = `
                .gjs-dashed [data-gjs-has-custom] { position: relative; }
                .gjs-dashed [data-gjs-has-custom]::after {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    pointer-events: none;
                    z-index: 10;
                    outline-offset: -2px;
                }
                .gjs-dashed [data-gjs-has-custom="js"]::after { outline: 2px dashed rgba(251, 191, 36, 0.4) !important; }
                .gjs-dashed [data-gjs-has-custom="css"]::after { outline: 2px dashed rgba(192, 132, 252, 0.4) !important; }
                .gjs-dashed [data-gjs-has-custom="both"]::after { outline: 2px dashed rgba(236, 72, 153, 0.4) !important; }
            `;
            canvasDoc.head.appendChild(style);
        }

        let updateTimeout;
        const triggerUpdate = () => {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
                try {
                    if (!editor || typeof editor.getWrapper !== 'function') return;

                    const walk = (cmp) => { updateCanvasHighlights(cmp); cmp.components().forEach(walk); };
                    const wrapper = editor.getWrapper();
                    if (wrapper) walk(wrapper);

                    if (editor.Layers && editor.Layers.render) {
                        editor.Layers.render();
                    }
                } catch (err) {
                    // Ignore errors during async highlight updates if editor is destroyed
                }
            }, 500);
        };

        triggerUpdate();

        editor.on('component:add component:update:script', (model) => {
            updateCanvasHighlights(model);
        });

        editor.CssComposer.getAll().on('add remove change', triggerUpdate);
    });

    // Layer UI native API extension
    editor.on('layer:customize', ({ el, model }) => {
        let badgeContainer = el.querySelector('.gjs-custom-code-badges');
        if (!badgeContainer) {
            badgeContainer = document.createElement('div');
            badgeContainer.className = 'gjs-custom-code-badges';
            badgeContainer.style.cssText = 'position:absolute; right:35px; top:50%; transform:translateY(-50%); display:flex; gap:3px; align-items:center; pointer-events:none; z-index:10;';
            el.appendChild(badgeContainer);
        }

        const hasJs = model.get('script') && model.get('script').trim() !== '';
        let hasCss = false;
        try {
            const rules = editor.CssComposer.getAll().models;
            const selStr = `#${model.getId()}`;
            for (let i = 0; i < rules.length; i++) {
                if (rules[i].getSelectorsString() === selStr) {
                    hasCss = true; break;
                }
            }
        } catch (e) { }

        const mkBadge = (bg, color, label) => `<div style="background:${bg};border-radius:3px;display:flex;align-items:center;justify-content:center;color:${color};font-size:8px;font-weight:900;line-height:1;padding:3px 5px;box-shadow:0 1px 3px rgba(0,0,0,0.2);">${label}</div>`;

        let html = '';
        if (hasJs && hasCss) html = mkBadge('linear-gradient(135deg, #fbbf24 45%, #c084fc 55%)', '#fff', '&lt;/&gt;');
        else if (hasJs) html = mkBadge('#fbbf24', '#000', 'JS');
        else if (hasCss) html = mkBadge('#c084fc', '#fff', 'CSS');

        badgeContainer.innerHTML = html;
    });

    return editor;
}

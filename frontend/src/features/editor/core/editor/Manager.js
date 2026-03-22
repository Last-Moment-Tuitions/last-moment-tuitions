import grapesjs from 'grapesjs';
import { gjsConfig } from './config';
import API_BASE_URL from '@/lib/config';
import gjsCustomCode from 'grapesjs-custom-code';
// Import 'grapesjs/dist/css/grapes.min.css'; // This normally needs to be imported in global CSS or locally

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

    const editor = grapesjs.init(config);

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

                cancelBtn.onclick = () => editor.Modal.close();

                // Unlink completely
                unlinkLocalBtn.onclick = () => {
                    const newHtml = textarea.value;
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
                        const newHtml = textarea.value;
                        
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
                        } catch(e) {}
                        
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
            // Get component HTML
            const html = selected.toHTML();
            
            content.innerHTML = `
                <div style="font-size: 13px; color: #94a3b8; margin-bottom: 5px;">Edit the HTML for this component directly:</div>
                <textarea id="gjs-edit-code-textarea" style="flex: 1; width: 100%; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 14px; padding: 15px; background: #0f172a; color: #e2e8f0; border: 1px solid #334155; border-radius: 6px; outline: none; resize: none;" spellcheck="false"></textarea>
                <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
                    <button id="gjs-edit-code-cancel" style="padding: 8px 16px; background: #334155; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Cancel</button>
                    <button id="gjs-edit-code-save" style="padding: 8px 16px; background: #2563eb; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">Save Changes</button>
                </div>
            `;
            
            const textarea = content.querySelector('#gjs-edit-code-textarea');

            // Format HTML helper
            const formatHTML = (htmlStr) => {
                let formatted = '';
                let indent = '';
                const tab = '  ';
                let processHtml = htmlStr.replace(/>/g, '>\n').replace(/</g, '\n<');
                let lines = processHtml.split('\n').filter(line => line.trim() !== '');
                for (let i = 0; i < lines.length; i++) {
                    let line = lines[i].trim();
                    if (!line) continue;
                    if (line.match(/^<\//)) {
                        indent = indent.substring(tab.length);
                    }
                    formatted += indent + line + '\n';
                    if (line.match(/^<[^\/][^>]*>$/) && !line.match(/<\s*(img|br|input|hr|meta|link)[^>]*>/i) && !line.match(/\/>$/)) {
                        indent += tab;
                    }
                }
                return formatted.trim();
            };

            textarea.value = formatHTML(html);

            content.querySelector('#gjs-edit-code-cancel').onclick = () => {
                editor.Modal.close();
            };

            content.querySelector('#gjs-edit-code-save').onclick = () => {
                const newHtml = textarea.value;
                const parent = selected.parent();
                const index = selected.index();
                
                // Keep classes if possible? For now, replacing removes old and parses new
                selected.remove();
                if (parent) {
                    const newEl = parent.components().add(newHtml, { at: index });
                    editor.select(newEl);
                } else {
                    editor.setComponents(newHtml);
                }
                editor.Modal.close();
            };

            editor.Modal.setTitle('</> Edit Component Code');
            editor.Modal.setContent(content);
            editor.Modal.open();
            
            // Widen modal
            setTimeout(() => {
                const modalDialog = editor.Modal.getModel().get('dEl');
                if (modalDialog) {
                    modalDialog.style.width = '80%';
                    modalDialog.style.maxWidth = '1000px';
                }
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
    });

    return editor;
}

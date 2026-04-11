/**
 * templateRef.js — Generic Composable Section Engine
 * 
 * Renders any section template stored in MongoDB as a fully editable GrapeJS component.
 * Supports 3 variable binding types:
 *   data-var="name"       → text content binding → text/textarea trait
 *   data-var-src="name"   → image src binding → image-picker trait (with preview + AM)
 *   data-var-video="name" → video URL binding → text trait
 * 
 * Fixes applied vs legacy version:
 *   ✅ Trait bug fixed: uses .reset() not .set('traits')
 *   ✅ Light DOM rendering (not Shadow DOM) — Tailwind & global CSS work correctly
 *   ✅ data-var / data-var-src / data-var-video detection (not just {{ }})
 *   ✅ Default value hydration on first drag (no empty placeholders)
 *   ✅ Template caching (avoid repeated API calls)
 *   ✅ Human-readable trait labels
 */

// Module-level template cache (survives re-renders, cleared on page reload)
export const _templateCache = new Map();

if (typeof window !== 'undefined') {
    window.addEventListener('clear-template-cache', (e) => {
        if (e.detail && e.detail.id) {
            _templateCache.delete(e.detail.id);
        } else {
            _templateCache.clear();
        }
    });
}

/**
 * Convert a variable name to a human-readable trait label.
 * e.g. "hero_headline_part1" → "Headline Part 1"
 * e.g. "faq_question_2" → "Question 2"
 */
function toLabel(varName) {
    return varName
        .replace(/^[a-z]+_/, '')   // strip leading section prefix (hero_, faq_, etc.)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

export const loadTemplateRefBlock = (editor) => {
    const bm = editor.BlockManager;
    const domc = editor.DomComponents;

    // ── Register the 'image-picker' trait type (idempotent) ─────────────────────
    if (!editor.TraitManager.getType('image-picker')) {
        editor.TraitManager.addType('image-picker', {
            createInput({ trait }) {
                const propName = trait.get('name');
                const defaultSrc = trait.get('defaultSrc') || '';
                const PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDgwIDYwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iNjAiIGZpbGw9IiNlNWU3ZWIiLz48cGF0aCBmaWxsPSIjOWNhM2FmIiBkPSJNMjcgMjBoMjZ2MjBIMjd6Ii8+PGNpcmNsZSBjeD0iMzYiIGN5PSIyOCIgcj0iNCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yNyA0MGwxMi0xMCA4IDYgNS00IDYgOEgyN3oiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii43Ii8+PC9zdmc+';

                // Capture model ref at trait creation time  
                const modelRef = editor.getSelected();

                const el = document.createElement('div');
                el.style.cssText = 'display:flex; flex-direction:column; gap:6px; padding:4px 0;';
                el.dataset.propName = propName;

                // Preview thumbnail
                const preview = document.createElement('img');
                preview.className = 'img-picker-preview';
                preview.style.cssText = 'width:100%; height:70px; object-fit:cover; border-radius:6px; border:1px solid #374151; background:#1f2937;';

                // URL input
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'img-picker-input';
                input.placeholder = 'Paste image URL...';
                input.style.cssText = 'width:100%; background:#1f2937; color:#f3f4f6; border:1px solid #374151; border-radius:4px; padding:5px 8px; font-size:12px; box-sizing:border-box; text-overflow:ellipsis;';

                // Keep preview + input in sync with model
                const syncDisplay = (url) => {
                    preview.src = url || PLACEHOLDER;
                    input.value = url || '';
                    input.title = url || '';
                };

                // In GrapeJS custom trait types, trait.target is the component model.
                // Never use editor.getSelected() in trait handlers; it returns null
                // when the Asset Manager or panel steals focus.
                const componentModel = trait.target || trait.model;

                // Guard: safety net if neither is available (e.g. during type registration).
                if (!componentModel) {
                    const fallback = document.createElement('div');
                    fallback.style.cssText = 'color:#9ca3af; font-size:11px; padding:4px 0;';
                    fallback.textContent = 'No component selected';
                    return fallback;
                }

                const currentVal = componentModel.get(propName) || defaultSrc;
                syncDisplay(currentVal);

                input.addEventListener('input', (e) => {
                    componentModel.set(propName, e.target.value);
                    componentModel.trigger('change:templateContent');
                    preview.src = e.target.value || PLACEHOLDER;
                    input.title = e.target.value;
                });

                // Buttons
                const btnRow = document.createElement('div');
                btnRow.style.cssText = 'display:flex; gap:4px;';

                const pickBtn = document.createElement('button');
                pickBtn.innerHTML = '🖼 Pick';
                pickBtn.style.cssText = 'flex:1; background:#2563eb; color:white; border:none; border-radius:4px; padding:5px 0; font-size:12px; cursor:pointer;';
                pickBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    editor.AssetManager.open({
                        types: ['image'],
                        onSelect(asset) {
                            const url = asset.getSrc ? asset.getSrc() : asset.get('src');
                            // componentModel captured at trait creation — always valid
                            componentModel.set(propName, url);
                            componentModel.trigger('change:templateContent');
                            syncDisplay(url);
                            editor.AssetManager.close();
                        }
                    });
                });

                const clearBtn = document.createElement('button');
                clearBtn.innerHTML = '✕ Remove';
                clearBtn.title = 'Revert to default';
                clearBtn.style.cssText = 'flex:1; background:#dc2626; color:white; border:none; border-radius:4px; padding:5px 0; font-size:12px; cursor:pointer;';
                clearBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    // Clear override → reverts to defaultSrc on next re-render
                    componentModel.set(propName, defaultSrc);
                    componentModel.trigger('change:templateContent');
                    syncDisplay(defaultSrc);
                });

                btnRow.appendChild(pickBtn);
                btnRow.appendChild(clearBtn);
                el.appendChild(preview);
                el.appendChild(input);
                el.appendChild(btnRow);
                return el;
            },
            onEvent() { },
            onUpdate({ elInput, trait }) {
                const propName = trait.get('name');
                const defaultSrc = trait.get('defaultSrc') || '';
                const PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDgwIDYwIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iNjAiIGZpbGw9IiNlNWU3ZWIiLz48cGF0aCBmaWxsPSIjOWNhM2FmIiBkPSJNMjcgMjBoMjZ2MjBIMjd6Ii8+PGNpcmNsZSBjeD0iMzYiIGN5PSIyOCIgcj0iNCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0yNyA0MGwxMi0xMCA4IDYgNS00IDYgOEgyN3oiIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii43Ii8+PC9zdmc+';

                // Use trait.target — consistent with createInput
                const componentModel = trait.target || trait.model;
                if (!componentModel) return;
                const newVal = componentModel.get(propName) || defaultSrc;
                const previewEl = elInput?.querySelector('.img-picker-preview');
                const inputEl = elInput?.querySelector('.img-picker-input');
                if (previewEl) previewEl.src = newVal || PLACEHOLDER;
                if (inputEl) { inputEl.value = newVal; inputEl.title = newVal; }
            }
        });
    }

    // ── Register the 'rich-text' trait type (Quill powered) ─────────────────────
    if (!editor.TraitManager.getType('rich-text')) {
        editor.TraitManager.addType('rich-text', {
            createInput({ trait }) {
                const propName = trait.get('name');
                const componentModel = trait.target || trait.model;
                const label = trait.get('label') || propName;

                const wrapper = document.createElement('div');
                wrapper.style.cssText = 'display:flex; flex-direction:column; gap:6px; padding:4px 0;';

                // Toolbar
                const toolbar = document.createElement('div');
                toolbar.style.cssText = 'display:flex; flex-wrap:wrap; gap:3px; background:#1f2937; border-radius:4px 4px 0 0; padding:4px;';
                toolbar.dataset.propName = propName;

                const btnStyle = 'background:#374151; color:#e5e7eb; border:none; border-radius:3px; padding:3px 7px; font-size:12px; cursor:pointer; font-weight:bold;';

                const buttons = [
                    { cmd: 'bold', label: 'B', title: 'Bold' },
                    { cmd: 'italic', label: '<i>I</i>', title: 'Italic' },
                    { cmd: 'underline', label: '<u>U</u>', title: 'Underline' },
                    { cmd: 'insertUnorderedList', label: '• List', title: 'Bullet List' },
                    { cmd: 'insertOrderedList', label: '1. List', title: 'Numbered List' },
                    { cmd: 'formatBlock:h2', label: 'H2', title: 'Heading 2' },
                    { cmd: 'formatBlock:h3', label: 'H3', title: 'Heading 3' },
                    { cmd: 'formatBlock:p', label: 'P', title: 'Paragraph' },
                    { cmd: 'removeFormat', label: 'Clear', title: 'Clear Format' },
                ];

                buttons.forEach(({ cmd, label, title }) => {
                    const btn = document.createElement('button');
                    btn.innerHTML = label;
                    btn.title = title;
                    btn.style.cssText = btnStyle;
                    btn.addEventListener('mousedown', (e) => {
                        e.preventDefault();
                        const [command, arg] = cmd.split(':');
                        editableDiv.focus();
                        document.execCommand(command, false, arg || null);
                        if (componentModel) {
                            componentModel.set(propName, editableDiv.innerHTML);
                            componentModel.trigger('change:templateContent');
                        }
                    });
                    toolbar.appendChild(btn);
                });

                // Link button
                const linkBtn = document.createElement('button');
                linkBtn.textContent = '🔗';
                linkBtn.title = 'Insert Link';
                linkBtn.style.cssText = btnStyle;
                linkBtn.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    const url = prompt('Enter URL:');
                    if (url) {
                        editableDiv.focus();
                        document.execCommand('createLink', false, url);
                        if (componentModel) {
                            componentModel.set(propName, editableDiv.innerHTML);
                            componentModel.trigger('change:templateContent');
                        }
                    }
                });
                toolbar.appendChild(linkBtn);

                // Expand/Modal button
                const expandBtn = document.createElement('button');
                expandBtn.textContent = '⛶ Expand';
                expandBtn.title = 'Full Screen Editor';
                expandBtn.style.cssText = btnStyle + 'margin-left:auto; background:#10b981;';

                let isExpanded = false;
                // Save original styles
                const origWrapperStyle = wrapper.style.cssText;
                const origDivStyle = 'min-height:120px; max-height:300px; overflow-y:auto; background:#0f172a; color:#e5e7eb; border:1px solid #374151; border-top:none; border-radius:0 0 4px 4px; padding:8px; font-size:13px; line-height:1.6; outline:none;';

                expandBtn.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    isExpanded = !isExpanded;
                    if (isExpanded) {
                        expandBtn.textContent = '✖ Close';
                        expandBtn.style.background = '#ef4444';

                        // Fullscreen modal styles overlaying the entire grapejs editor
                        wrapper.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:60vw; height:60vh; z-index:99999; background:#1f2937; padding:16px; border-radius:8px; box-shadow:0 25px 50px -12px rgba(0, 0, 0, 0.5); display:flex; flex-direction:column;';
                        editableDiv.style.cssText = origDivStyle + ' flex:1; max-height:none; background:#0f172a; border-radius:4px; font-size:15px; padding:16px;';

                        // Add modal overlay backdrop
                        const backdrop = document.createElement('div');
                        backdrop.id = 'rte-backdrop';
                        backdrop.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.7); z-index:99998;';
                        document.body.appendChild(backdrop);
                    } else {
                        expandBtn.textContent = '⛶ Expand';
                        expandBtn.style.background = '#10b981';
                        wrapper.style.cssText = origWrapperStyle;
                        editableDiv.style.cssText = origDivStyle;
                        const backdrop = document.getElementById('rte-backdrop');
                        if (backdrop) backdrop.remove();
                    }
                });
                toolbar.appendChild(expandBtn);

                // Table button
                const tableBtn = document.createElement('button');
                tableBtn.textContent = '⊞ Table';
                tableBtn.title = 'Insert 2x2 Table';
                tableBtn.style.cssText = btnStyle;
                tableBtn.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    editableDiv.focus();
                    const tableHtml = `
                    <table style="width:100%; border-collapse: collapse; margin-bottom: 1rem;">
                        <tbody>
                            <tr>
                                <td style="border: 1px solid #cbd5e1; padding: 8px;">Header 1</td>
                                <td style="border: 1px solid #cbd5e1; padding: 8px;">Header 2</td>
                            </tr>
                            <tr>
                                <td style="border: 1px solid #cbd5e1; padding: 8px;">Row 1 Col 1</td>
                                <td style="border: 1px solid #cbd5e1; padding: 8px;">Row 1 Col 2</td>
                            </tr>
                        </tbody>
                    </table><br/>`;
                    document.execCommand('insertHTML', false, tableHtml);
                    if (componentModel) {
                        componentModel.set(propName, editableDiv.innerHTML);
                        componentModel.trigger('change:templateContent');
                    }
                });
                // Insert tableBtn just before Link button
                toolbar.insertBefore(tableBtn, linkBtn);

                // Color button
                const colorBtn = document.createElement('button');
                colorBtn.textContent = '🎨 Color';
                colorBtn.title = 'Text Color';
                colorBtn.style.cssText = btnStyle;
                colorBtn.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    const col = prompt('Enter color hex (e.g. #ea580c):');
                    if (col) {
                        editableDiv.focus();
                        document.execCommand('foreColor', false, col);
                        if (componentModel) {
                            componentModel.set(propName, editableDiv.innerHTML);
                            componentModel.trigger('change:templateContent');
                        }
                    }
                });
                toolbar.insertBefore(colorBtn, linkBtn);

                // Editable content area
                const editableDiv = document.createElement('div');
                editableDiv.contentEditable = 'true';
                editableDiv.style.cssText = origDivStyle;
                editableDiv.innerHTML = componentModel ? (componentModel.get(propName) || '') : '';

                editableDiv.addEventListener('input', () => {
                    if (componentModel) {
                        componentModel.set(propName, editableDiv.innerHTML);
                        componentModel.trigger('change:templateContent');
                    }
                });

                // Paste as plain HTML
                editableDiv.addEventListener('paste', (e) => {
                    e.preventDefault();
                    // Basic strip to keep semantic tags but remove heavy word/excel tracking styles if needed
                    const text = e.clipboardData.getData('text/html') || e.clipboardData.getData('text/plain');
                    document.execCommand('insertHTML', false, text);
                });

                wrapper.appendChild(toolbar);
                wrapper.appendChild(editableDiv);
                return wrapper;
            },
            onEvent() { },
            onUpdate({ elInput, trait }) {
                const propName = trait.get('name');
                const componentModel = trait.target || trait.model;
                if (!componentModel || !elInput) return;
                const editableDiv = elInput.querySelector('[contenteditable]');
                if (editableDiv) {
                    const val = componentModel.get(propName) || '';
                    if (editableDiv.innerHTML !== val) {
                        editableDiv.innerHTML = val;
                    }
                }
            }
        });
    }

    // ── Component Type: template-ref ──────────────────────────────────────────
    domc.addType('template-ref', {
        isComponent: el => el.tagName === 'TEMPLATE-REF',

        model: {
            defaults: {
                tagName: 'template-ref',
                draggable: true,
                droppable: false,
                attributes: { class: 'template-ref-placeholder' },
                style: { display: 'block', 'min-height': '60px', width: '100%' },
                // Base traits — replaced dynamically once template loads
                traits: [
                    { type: 'text', name: 'data-template-id', label: 'Template ID' },
                ],
                components: '',
            },

            init() {
                this.on('change:attributes:data-template-id', this.handleTemplateChange);
                this.on('change', (model) => {
                    const changed = model.changedAttributes();
                    if (!changed) return;
                    const hasVarChange = Object.keys(changed).some(k => k.startsWith('prop_'));
                    if (hasVarChange) {
                        this.trigger('change:templateContent');
                        this.updateDataProps();
                    }
                });

                // Handle sidebar duplication (Cloning items in the canvas)
                const em = this.model.opt.em;
                if (em) {
                    em.on('component:clone', (cloned) => {
                        const el = cloned.getEl ? cloned.getEl() : null;
                        if (!el) return;

                        // If it's a sidebar item, auto-index it
                        if (el.hasAttribute('data-sidebar-item')) {
                            const items = el.closest('[data-sidebar-nav]')?.querySelectorAll('[data-sidebar-item]') || [];
                            const nextIdx = items.length;
                            cloned.addAttributes({ 'data-sidebar-item': String(nextIdx) });

                            // Set default content for the new slot
                            const contentKey = `prop_nav${nextIdx}_content`;
                            if (!this.model.get(contentKey)) {
                                this.model.set(contentKey, `<h2>New Section ${nextIdx}</h2><p>Click to edit this content.</p>`, { silent: true });
                                this.model.set(`prop_nav${nextIdx}_label`, `New Item ${nextIdx}`, { silent: true });
                            }
                            this.trigger('change:templateContent');
                        }
                    });
                }
            },

            updateDataProps() {
                const propsObj = {};
                const attrs = this.attributes;
                for (const key in attrs) {
                    // Collect all generic section traits into a JSON object 
                    // for SSR rendering on the frontend
                    if (key.startsWith('prop_')) {
                        const realKey = key.substring(5);
                        propsObj[realKey] = attrs[key];
                    }
                }
                const currentDataProps = this.getAttributes()['data-props'];
                const newDataProps = JSON.stringify(propsObj);

                if (currentDataProps !== newDataProps) {
                    // Update the model attributes so GrapsJS serializes it to the HTML
                    this.addAttributes({ 'data-props': newDataProps });
                }
            },

            handleTemplateChange() {
                this.trigger('change:templateContent');
            }
        },

        view: {
            _lastRenderedTemplateId: null,

            init() {
                this.listenTo(this.model, 'change:templateContent', this.renderTemplate);
            },

            onRender() {
                // Enforce block formatting immediately upon element creation 
                // (before template loading) to prevent newly dragged empty templates
                // from overlapping with existing ones since custom tags default to 'inline'
                this.el.style.cssText = 'display: block; width: 100%; clear: both; position: relative; contain: content;';
                this.renderTemplate();
            },

            /**
             * Wire up interactive elements inside a rendered section.
             * Called after every render. Works because pointer-events is now 'auto'
             * (changed from 'none') so clicks reach inner elements naturally.
             *
             * Handles:
             *  1. data-tab buttons — active tab styling
             *  2. details/summary — chevron icon update on toggle
             */
            _initSectionInteractivity(contentDiv) {
                // ── 1. Tab Switcher ──────────────────────────────────────────────
                const tabs = contentDiv.querySelectorAll('[data-tab]');
                if (tabs.length > 0) {
                    const activateTab = (activeBtn) => {
                        tabs.forEach(btn => {
                            const isActive = btn === activeBtn;
                            btn.style.background = isActive ? '#111827' : 'transparent';
                            btn.style.color = isActive ? '#fff' : '#374151';
                            btn.style.borderColor = isActive ? '#111827' : 'transparent';
                            btn.style.fontWeight = isActive ? '700' : '600';
                        });
                    };

                    const currentTabId = this.model.get('prop_active_tab');
                    if (currentTabId) {
                        const activeBtn = Array.from(tabs).find(b => b.getAttribute('data-tab') === currentTabId);
                        if (activeBtn) activateTab(activeBtn);
                    } else if (tabs.length > 0) {
                        activateTab(tabs[0]);
                    }

                    tabs.forEach(btn => {
                        btn.style.pointerEvents = 'auto';
                        btn.addEventListener('click', (e) => e.preventDefault());
                        btn.addEventListener('mousedown', (e) => {
                            e.stopPropagation(); // Prevent GrapeJS from selecting inner text nodes
                            e.preventDefault();
                            activateTab(btn);

                            const tabId = btn.getAttribute('data-tab');
                            if (tabId) {
                                setTimeout(() => {
                                    const editor = this.model.opt.em.get('Editor');
                                    editor.select(this.model); // Force GrapeJS to select the Wrapper instead of the Span

                                    this.model.set('_force_trait_reset', true, { silent: true });
                                    this.model.set('prop_active_tab', tabId, { silent: true });
                                    this.renderTemplate();
                                }, 50);
                            }
                        });
                    });
                }

                // ── 2. Accordion chevron sync ────────────────────────────────────
                const allDetails = contentDiv.querySelectorAll('details[data-module]');
                allDetails.forEach(details => {
                    const summary = details.querySelector('summary');
                    const chevron = summary?.querySelector('span:last-child, .mod-chevron');

                    if (chevron) chevron.textContent = details.open ? '−' : '›';

                    // details uses native browser click behavior which works sometimes, 
                    // but we can augment the summary with mousedown just in case.
                    if (summary) {
                        summary.style.pointerEvents = 'auto';
                        details.style.pointerEvents = 'auto';
                        summary.addEventListener('mousedown', (e) => {
                            // Let it bubble
                        });
                    }

                    details.addEventListener('toggle', () => {
                        if (chevron) chevron.textContent = details.open ? '−' : '›';
                    });
                });

                // ── 3. Testimonial Slider Interaction ─────────────────────────────────
                const testTrack = contentDiv.querySelector('.test-track');
                const testPrev = contentDiv.querySelector('.test-prev');
                const testNext = contentDiv.querySelector('.test-next');
                if (testTrack && testPrev && testNext) {
                    const scrollAmount = 344; // 320px width + 24px gap

                    testPrev.style.pointerEvents = 'auto';
                    testPrev.addEventListener('mousedown', (e) => {
                        e.preventDefault();
                        testTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                    });

                    testNext.style.pointerEvents = 'auto';
                    testNext.addEventListener('mousedown', (e) => {
                        e.preventDefault();
                        testTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    });

                    let isHovering = false;
                    testTrack.style.pointerEvents = 'auto';
                    testTrack.addEventListener('mouseenter', () => isHovering = true);
                    testTrack.addEventListener('mouseleave', () => isHovering = false);

                    if (this._sliderInterval) clearInterval(this._sliderInterval);
                    this._sliderInterval = setInterval(() => {
                        if (isHovering || !testTrack.isConnected) return;
                        if (Math.ceil(testTrack.scrollLeft + testTrack.clientWidth) >= testTrack.scrollWidth) {
                            testTrack.scrollTo({ left: 0, behavior: 'smooth' });
                        } else {
                            testTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                        }
                    }, 3000);
                }

                // ── 4. Course Detail Page: Left Sidebar ─────────────────────────
                const sidebarItems = contentDiv.querySelectorAll('[data-sidebar-item]');
                const allSidebarSections = contentDiv.querySelectorAll('[data-sidebar-section]');

                if (sidebarItems.length > 0) {
                    const activateSidebarItem = (targetIdx) => {
                        sidebarItems.forEach((item, i) => {
                            const isActive = String(i + 1) === String(targetIdx);
                            item.style.borderLeftColor = isActive ? '#f97316' : 'transparent';
                            item.style.background = isActive ? '#fff7ed' : 'transparent';
                            item.style.color = isActive ? '#ea580c' : '#374151';
                            item.style.fontWeight = isActive ? '600' : '500';
                        });
                        allSidebarSections.forEach(section => {
                            const idx = section.getAttribute('data-sidebar-section');
                            section.style.display = String(idx) === String(targetIdx) ? 'block' : 'none';
                        });
                    };

                    let currentSidebarIdx = this.model.get('prop_active_sidebar') || '1';
                    activateSidebarItem(currentSidebarIdx);

                    sidebarItems.forEach((item, i) => {
                        // Use mousedown and allow internal interaction!
                        item.style.pointerEvents = 'auto';
                        item.addEventListener('click', (e) => e.preventDefault());
                        item.addEventListener('mousedown', (e) => {
                            e.stopPropagation(); // Prevent GrapeJS from selecting inner text nodes
                            e.preventDefault();
                            activateSidebarItem(i + 1);

                            // Sync tab highlighting if it's the "Placement Papers" (Section 1)
                            if (String(i + 1) === '1') {
                                this.model.set('prop_active_tab', '1', { silent: true });
                            }

                            // Process UI change sequentially so GrapeJS can finish bubbling first
                            setTimeout(() => {
                                const editor = this.model.opt.em.get('Editor');
                                editor.select(this.model);

                                this.model.set('_force_trait_reset', true, { silent: true });
                                this.model.set('prop_active_sidebar', String(i + 1), { silent: true });
                                this.renderTemplate();
                            }, 50);
                        });
                    });
                }

                // ── 5. Course Detail Page: Content Tab → Smooth Scroll ──────────
                const contentTabBtns = contentDiv.querySelectorAll('[data-content-tab]');
                if (contentTabBtns.length > 0) {
                    contentTabBtns.forEach(btn => {
                        btn.style.pointerEvents = 'auto';
                        btn.addEventListener('click', (e) => e.preventDefault());
                        btn.addEventListener('mousedown', (e) => {
                            e.preventDefault();
                            const href = btn.getAttribute('href') || `#content-tab-${btn.getAttribute('data-content-tab')}`;
                            const targetId = href.replace('#', '');
                            const targetEl = contentDiv.querySelector(`#${targetId}`) || document.getElementById(targetId);
                            if (targetEl) {
                                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                            contentTabBtns.forEach(b => {
                                b.style.borderBottom = '2px solid transparent';
                                b.style.color = '#64748b';
                                b.style.fontWeight = '600';
                            });
                            btn.style.borderBottom = '2px solid #f97316';
                            btn.style.color = '#0f172a';
                            btn.style.fontWeight = '700';
                        });
                    });
                }
            },

            async renderTemplate() {
                const attrs = this.model.getAttributes();
                const templateId = attrs['data-template-id'];

                // ── Loading state ──────────────────────────────────────────────
                if (!templateId) {
                    this.el.innerHTML = `
                        <div style="padding:20px; border:2px dashed #60a5fa; background:#eff6ff; text-align:center; color:#1e3a8a; font-family:sans-serif; border-radius:8px;">
                            <strong style="display:block; margin-bottom:4px;">Section Block</strong>
                            <span style="font-size:12px; color:#3b82f6;">Select a Template ID in the Settings panel</span>
                        </div>`;
                    return;
                }

                // If not in cache, show loading
                if (!_templateCache.has(templateId)) {
                    this.el.innerHTML = `
                        <div style="padding:20px; border:2px dashed #d1d5db; background:#f9fafb; text-align:center; color:#6b7280; font-family:sans-serif; border-radius:8px;">
                            <div style="display:inline-block; width:20px; height:20px; border:2px solid #9ca3af; border-top-color:#f97316; border-radius:50%; animation:spin 0.8s linear infinite; margin-bottom:8px;"></div>
                            <div style="font-size:13px;">Loading section...</div>
                        </div>
                        <style>@keyframes spin{100%{transform:rotate(360deg)}}</style>`;
                }

                try {
                    // ── Fetch with cache / timestamp ───────────────────────────
                    let templateData;
                    // Provide a way to bypass cache: just clear local _templateCache
                    // or append timestamp if we want global bypass. For now, rely on _templateCache
                    if (_templateCache.has(templateId)) {
                        templateData = _templateCache.get(templateId);
                    } else {
                        const { adminService } = await import('@/services/adminService');
                        // Bypassing browser-level cache for template fetches can be done via query 
                        // if needed, but adminService.getPage uses standard fetch
                        templateData = await adminService.getPage(templateId);

                        if (!templateData) {
                            throw new Error(`No data for template ${templateId}`);
                        }

                        // Handle the case where the backend wraps it in 'data'
                        if (templateData.data) {
                            templateData = templateData.data;
                        }

                        _templateCache.set(templateId, templateData);
                    }

                    let html = templateData.gjsHtml || '';
                    const css = templateData.gjsCss || '';
                    const fetchedDefaultProps = templateData.defaultProps || {};

                    // ── Parse HTML once ────────────────────────────────────────
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    // ── Active Tab Support ─────────────────────────────────────
                    let activeTab = this.model.get('prop_active_tab');
                    const firstTabBtn = doc.querySelector('[data-tab]');
                    if (firstTabBtn && !activeTab) {
                        activeTab = firstTabBtn.getAttribute('data-tab');
                        this.model.set('prop_active_tab', activeTab, { silent: true });
                    }

                    // Pre-process doc to find hidden standard tabs
                    doc.querySelectorAll('[data-tab-pane]').forEach(pane => {
                        if (pane.getAttribute('data-tab-pane') === activeTab) {
                            pane.setAttribute('data-hidden-pane', 'false');
                        } else {
                            pane.setAttribute('data-hidden-pane', 'true');
                        }
                    });

                    // Pre-process doc to find hidden Course Detail sidebar sections
                    let activeSidebar = this.model.get('prop_active_sidebar') || '1';
                    doc.querySelectorAll('[data-sidebar-section]').forEach(section => {
                        if (section.getAttribute('data-sidebar-section') === activeSidebar) {
                            section.setAttribute('data-hidden-section', 'false');
                        } else {
                            section.setAttribute('data-hidden-section', 'true');
                        }
                    });

                    // Helper: only show form controls for variables in visible panes
                    const isVisible = (el) => {
                        const pane = el.closest('[data-tab-pane]');
                        const sidebarSection = el.closest('[data-sidebar-section]');
                        if (pane && pane.getAttribute('data-hidden-pane') === 'true') return false;
                        if (sidebarSection && sidebarSection.getAttribute('data-hidden-section') === 'true') return false;
                        return true;
                    };

                    // ── Variable Detection ─────────────────────────────────────
                    // 1. data-var (text content)
                    const textVars = new Map();   // varName → defaultText
                    doc.querySelectorAll('[data-var]').forEach(el => {
                        if (!isVisible(el)) return;
                        const name = el.getAttribute('data-var');
                        if (!textVars.has(name)) {
                            textVars.set(name, fetchedDefaultProps[name] || el.textContent.trim() || '');
                        }
                    });

                    // Auto-detect {{ variable }} text in the HTML for backward compatibility
                    // This creates traits for plain {{ variable }} placements so users can edit them.
                    const templateRegex = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
                    let match;
                    while ((match = templateRegex.exec(html)) !== null) {
                        const name = match[1];
                        if (!textVars.has(name) && !name.startsWith('img_') && !name.startsWith('video_')) {
                            // Only add if not already captured by other rules to avoid duplicates
                            textVars.set(name, fetchedDefaultProps[name] || `{{${name}}}`);
                        }
                    }

                    // 2. data-var-src (image src)
                    const imageVars = new Map();  // varName → defaultSrc
                    doc.querySelectorAll('[data-var-src]').forEach(el => {
                        if (!isVisible(el)) return;
                        const name = el.getAttribute('data-var-src');
                        if (!imageVars.has(name)) {
                            imageVars.set(name, fetchedDefaultProps[name] || el.getAttribute('src') || '');
                        }
                    });

                    // 3. data-var-video (video URLs)
                    const videoVars = new Map();  // varName → defaultUrl
                    doc.querySelectorAll('[data-var-video]').forEach(el => {
                        if (!isVisible(el)) return;
                        const name = el.getAttribute('data-var-video');
                        if (!videoVars.has(name)) {
                            videoVars.set(name, fetchedDefaultProps[name] || el.getAttribute('src') || '');
                        }
                    });

                    // 4. data-var-link (href for links/buttons)
                    const linkVars = new Map();  // varName → defaultHref
                    doc.querySelectorAll('[data-var-link]').forEach(el => {
                        if (!isVisible(el)) return;
                        const name = el.getAttribute('data-var-link');
                        if (!linkVars.has(name)) {
                            linkVars.set(name, fetchedDefaultProps[name] || el.getAttribute('href') || '#');
                        }
                    });

                    // 5. data-var-html (rich HTML content — innerHTML binding)
                    const htmlVars = new Map();  // varName → defaultHtml
                    doc.querySelectorAll('[data-var-html]').forEach(el => {
                        if (!isVisible(el)) return;
                        const name = el.getAttribute('data-var-html');
                        if (!htmlVars.has(name)) {
                            htmlVars.set(name, fetchedDefaultProps[name] || el.innerHTML.trim() || '');
                        }
                    });

                    // 6. Auto-detect unbound <img> tags (img_1_src, img_2_src...)
                    const autoImageVars = new Map();
                    let autoImgIndex = 0;
                    doc.querySelectorAll('img').forEach(img => {
                        if (!isVisible(img)) return;
                        if (!img.getAttribute('data-var-src')) {
                            autoImgIndex++;
                            const autoName = `img_${autoImgIndex}_src`;
                            autoImageVars.set(autoName, fetchedDefaultProps[autoName] || img.getAttribute('src') || '');
                        }
                    });

                    // ── Default Value Hydration ────────────────────────────────
                    // Pre-populate model with defaults so first render shows real content
                    textVars.forEach((defaultVal, name) => {
                        if (!this.model.get(`prop_${name}`)) {
                            this.model.set(`prop_${name}`, defaultVal, { silent: true });
                        }
                    });
                    imageVars.forEach((defaultSrc, name) => {
                        if (!this.model.get(`prop_${name}`)) {
                            this.model.set(`prop_${name}`, defaultSrc, { silent: true });
                        }
                    });
                    videoVars.forEach((defaultUrl, name) => {
                        if (!this.model.get(`prop_${name}`)) {
                            this.model.set(`prop_${name}`, defaultUrl, { silent: true });
                        }
                    });
                    linkVars.forEach((defaultHref, name) => {
                        if (!this.model.get(`prop_${name}`)) {
                            this.model.set(`prop_${name}`, defaultHref, { silent: true });
                        }
                    });
                    htmlVars.forEach((defaultHtml, name) => {
                        if (!this.model.get(`prop_${name}`)) {
                            this.model.set(`prop_${name}`, defaultHtml, { silent: true });
                        }
                    });
                    autoImageVars.forEach((defaultSrc, name) => {
                        if (!this.model.get(`prop_${name}`)) {
                            this.model.set(`prop_${name}`, defaultSrc, { silent: true });
                        }
                    });

                    // ── Trait Generation ───────────────────────────────────────
                    // ✅ CRITICAL FIX: use .reset() not .set('traits', ...)
                    const newTraits = [];

                    // Standard control traits first
                    newTraits.push({ type: 'text', name: 'data-template-id', label: 'Template ID' });

                    // Text variable traits
                    textVars.forEach((_, name) => {
                        newTraits.push({
                            type: 'text',
                            name: `prop_${name}`,
                            label: toLabel(name),
                            placeholder: textVars.get(name),
                            changeProp: 1,
                        });
                    });

                    // Image variable traits
                    imageVars.forEach((defaultSrc, name) => {
                        newTraits.push({
                            type: 'image-picker',
                            name: `prop_${name}`,
                            label: `Image: ${toLabel(name)}`,
                            changeProp: 1,
                            defaultSrc,
                        });
                    });

                    // Auto-image traits
                    autoImageVars.forEach((defaultSrc, name) => {
                        newTraits.push({
                            type: 'image-picker',
                            name: `prop_${name}`,
                            label: `Image: ${toLabel(name)}`,
                            changeProp: 1,
                            defaultSrc,
                        });
                    });

                    // Video variable traits
                    videoVars.forEach((_, name) => {
                        newTraits.push({
                            type: 'text',
                            name: `prop_${name}`,
                            label: `🎬 Video: ${toLabel(name)}`,
                            placeholder: 'https://youtube.com/embed/...',
                            changeProp: 1,
                        });
                    });

                    // Link/Href variable traits
                    linkVars.forEach((_, name) => {
                        newTraits.push({
                            type: 'text',
                            name: `prop_${name}`,
                            label: `🔗 Link: ${toLabel(name)}`,
                            placeholder: 'https://...',
                            changeProp: 1,
                        });
                    });

                    // Rich HTML variable traits
                    htmlVars.forEach((_, name) => {
                        newTraits.push({
                            type: 'rich-text',
                            name: `prop_${name}`,
                            label: `📝 Content: ${toLabel(name)}`,
                            changeProp: 1,
                        });
                    });

                    // ── Dynamic Module Count Support ───────────────────────────
                    // Detect how many [data-module] rows are in the active pane
                    let targetPane = doc;
                    if (activeTab) {
                        targetPane = doc.querySelector(`[data-tab-pane="${activeTab}"]`) || doc;
                    }
                    const moduleEls = targetPane.querySelectorAll('[data-module]');
                    const baseModuleCount = moduleEls.length;

                    if (baseModuleCount > 0) {
                        const propKey = activeTab ? `prop_${activeTab}_modules_count` : 'prop_modules_count';
                        if (!this.model.get(propKey)) {
                            this.model.set(propKey, fetchedDefaultProps[propKey] || baseModuleCount, { silent: true });
                        }
                        newTraits.push({
                            type: 'number',
                            name: propKey,
                            label: '📚 Module Count',
                            changeProp: 1,
                            min: 1,
                            max: 20,
                        });

                        const currentCount = parseInt(this.model.get(propKey) || baseModuleCount, 10);
                        for (let i = baseModuleCount + 1; i <= currentCount; i++) {
                            const prefix = activeTab ? `${activeTab}_` : '';
                            const titleKey = `prop_${prefix}mod${i}_title`;
                            const descKey = `prop_${prefix}mod${i}_desc`;
                            if (!this.model.get(titleKey)) {
                                this.model.set(titleKey, `Module ${i}: New Topic`, { silent: true });
                            }
                            newTraits.push({ type: 'text', name: titleKey, label: `Module ${i} Title`, changeProp: 1 });
                            newTraits.push({ type: 'text', name: descKey, label: `Module ${i} Desc`, changeProp: 1, placeholder: 'Module description...' });
                        }
                    }

                    // ── Dynamic Testimonial Count Support ───────────────────────────
                    const testimonialEls = doc.querySelectorAll('[data-testimonial]');
                    const baseTestCount = testimonialEls.length;

                    if (baseTestCount > 0) {
                        const propKey = 'prop_testimonials_count';
                        if (!this.model.get(propKey)) {
                            this.model.set(propKey, fetchedDefaultProps[propKey] || baseTestCount, { silent: true });
                        }
                        newTraits.push({
                            type: 'number',
                            name: propKey,
                            label: '💬 Slider Count',
                            changeProp: 1,
                            min: 1,
                            max: 20,
                        });

                        const currentCount = parseInt(this.model.get(propKey) || baseTestCount, 10);
                        for (let i = baseTestCount + 1; i <= currentCount; i++) {
                            const prefix = `test_t${i}_`;
                            if (!this.model.get(`prop_${prefix}name`)) {
                                this.model.set(`prop_${prefix}name`, `John Doe ${i}`, { silent: true });
                                this.model.set(`prop_${prefix}company`, `Company ${i}`, { silent: true });
                                this.model.set(`prop_${prefix}role`, `Manager`, { silent: true });
                                this.model.set(`prop_${prefix}desc`, `Description ${i}...`, { silent: true });
                                this.model.set(`prop_${prefix}logo`, `https://placehold.co/40x40/475569/ffffff?text=C${i}`, { silent: true });
                                this.model.set(`prop_${prefix}avatar`, `https://i.pravatar.cc/60?img=${i + 10}`, { silent: true });
                            }
                            newTraits.push({ type: 'text', name: `prop_${prefix}company`, label: `T${i}: Company`, changeProp: 1 });
                            newTraits.push({ type: 'text', name: `prop_${prefix}desc`, label: `T${i}: Quote (Text)`, changeProp: 1 });
                            newTraits.push({ type: 'text', name: `prop_${prefix}name`, label: `T${i}: Name`, changeProp: 1 });
                            newTraits.push({ type: 'text', name: `prop_${prefix}role`, label: `T${i}: Role`, changeProp: 1 });
                            newTraits.push({ type: 'image-picker', name: `prop_${prefix}logo`, label: `T${i}: Logo (Img)`, changeProp: 1, defaultSrc: 'https://placehold.co/40' });
                            newTraits.push({ type: 'image-picker', name: `prop_${prefix}avatar`, label: `T${i}: Avatar (Img)`, changeProp: 1, defaultSrc: 'https://i.pravatar.cc/60' });
                        }
                    }

                    // ── Dynamic Sidebar Item Count Support ──────────────────────────
                    const sidebarItemEls = doc.querySelectorAll('[data-sidebar-item]');
                    const baseSidebarCount = sidebarItemEls.length;

                    if (baseSidebarCount > 0) {
                        const propKey = 'prop_sidebar_items_count';
                        if (!this.model.get(propKey)) {
                            this.model.set(propKey, fetchedDefaultProps[propKey] || baseSidebarCount, { silent: true });
                        }
                        newTraits.push({
                            type: 'number',
                            name: propKey,
                            label: '🗂 Sidebar Item Count',
                            changeProp: 1,
                            min: 1,
                            max: 30,
                        });

                        const currentCount = parseInt(this.model.get(propKey) || baseSidebarCount, 10);
                        for (let i = baseSidebarCount + 1; i <= currentCount; i++) {
                            const labelKey = `prop_sidebar_item${i}_label`;
                            const hrefKey = `prop_sidebar_item${i}_href`;
                            const contentKey = `prop_sidebar_item${i}_content`;
                            if (!this.model.get(labelKey)) {
                                this.model.set(labelKey, `Item ${i}`, { silent: true });
                                this.model.set(hrefKey, `#section-${i}`, { silent: true });
                                this.model.set(contentKey, `<h2>Section ${i}</h2><p>Add your content here...</p>`, { silent: true });
                            }
                            newTraits.push({ type: 'text', name: labelKey, label: `Nav ${i}: Label`, changeProp: 1 });
                            newTraits.push({ type: 'text', name: hrefKey, label: `Nav ${i}: URL/Slug`, changeProp: 1 });
                            newTraits.push({ type: 'rich-text', name: contentKey, label: `📝 Nav ${i}: Content`, changeProp: 1 });
                        }
                    }

                    // ── Dynamic Tab Count Support (top tabs on course detail page) –
                    const tabBtns = doc.querySelectorAll('[data-content-tab]');
                    const baseTabCount = tabBtns.length;

                    if (baseTabCount > 0) {
                        const propKey = 'prop_tabs_count';
                        if (!this.model.get(propKey)) {
                            this.model.set(propKey, fetchedDefaultProps[propKey] || baseTabCount, { silent: true });
                        }
                        newTraits.push({
                            type: 'number',
                            name: propKey,
                            label: '📑 Tab Count',
                            changeProp: 1,
                            min: 1,
                            max: 10,
                        });

                        const currentCount = parseInt(this.model.get(propKey) || baseTabCount, 10);
                        for (let i = baseTabCount + 1; i <= currentCount; i++) {
                            const tabLabelKey = `prop_tab${i}_label`;
                            const tabContentKey = `prop_tab${i}_content`;
                            if (!this.model.get(tabLabelKey)) {
                                this.model.set(tabLabelKey, `Tab ${i}`, { silent: true });
                                this.model.set(tabContentKey, `<h2>Tab ${i} Content</h2><p>Add tab content here...</p>`, { silent: true });
                            }
                            newTraits.push({ type: 'text', name: tabLabelKey, label: `Tab ${i}: Label`, changeProp: 1 });
                            newTraits.push({ type: 'rich-text', name: tabContentKey, label: `📝 Tab ${i}: Content`, changeProp: 1 });
                        }
                    }

                    // Only reset traits when the template ID changes, Or trait count changes, Or forced.
                    const prevCount = this.model.get('traits').length;
                    const newCount = newTraits.length;

                    if (templateId !== this._lastRenderedTemplateId || this.model.get('_force_trait_reset')) {
                        // Full reset (tab change or template change)
                        this.model.get('traits').reset(newTraits);
                        this._lastRenderedTemplateId = templateId;
                        this.model.set('_force_trait_reset', false, { silent: true });
                    } else if (prevCount !== newCount) {
                        // Just added/removed modules - selectively update without destroying focus container
                        const currentTraits = this.model.get('traits');
                        const newNames = newTraits.map(t => t.name);

                        // Remove stale traits
                        const toRemove = currentTraits.models.filter(t => !newNames.includes(t.get('name')));
                        currentTraits.remove(toRemove);

                        // Add new traits
                        const existingNames = currentTraits.models.map(t => t.get('name'));
                        const toAdd = newTraits.filter(t => !existingNames.includes(t.name));
                        toAdd.forEach(t => currentTraits.add(t));
                    }

                    // Push model traits into attributes quietly for HTML Serialization
                    if (typeof this.model.updateDataProps === 'function') {
                        this.model.updateDataProps();
                    }

                    // ── Apply Variable Values to HTML ───────────────────────────
                    const renderDoc = parser.parseFromString(html, 'text/html');

                    // Sync Layout Gaps
                    const mainWrapper = renderDoc.querySelector('div[style*="max-width:"]');
                    if (mainWrapper) {
                        mainWrapper.style.maxWidth = '1400px';
                        mainWrapper.style.gap = '32px';
                    }

                    // Sync Content Tab Highlighting (Overview, Syllabus, etc.)
                    activeTab = this.model.get('prop_active_tab') || '1';
                    renderDoc.querySelectorAll('[data-content-tab], [data-tab]').forEach(btn => {
                        const tabIdx = btn.getAttribute('data-content-tab') || btn.getAttribute('data-tab');
                        const isActive = String(tabIdx) === String(activeTab);

                        // Vibrant Highlight for the selected tab
                        if (isActive) {
                            btn.style.borderBottom = '2px solid #063f78';
                            btn.style.color = '#063f78';
                            btn.style.fontWeight = '700';
                            btn.style.background = '#f0f9ff';
                        } else {
                            btn.style.borderBottom = '2px solid transparent';
                            btn.style.color = '#64748b';
                            btn.style.fontWeight = '600';
                            btn.style.background = 'transparent';
                        }
                    });

                    // Sync Section Visibility (Exclusively show only the active tab's section)
                    renderDoc.querySelectorAll('[data-content-section], [data-tab-pane]').forEach(section => {
                        const sectionIdx = section.getAttribute('data-content-section') || section.getAttribute('data-tab-pane');
                        section.style.display = (String(sectionIdx) === String(activeTab)) ? 'block' : 'none';
                    });

                    // ── Course Detail Sidebar Visibility ───────────────────────
                    activeSidebar = this.model.get('prop_active_sidebar') || '1';
                    renderDoc.querySelectorAll('[data-sidebar-section]').forEach(section => {
                        if (section.getAttribute('data-sidebar-section') === activeSidebar) {
                            section.style.display = 'block';
                        } else {
                            section.style.display = 'none';
                        }
                    });

                    renderDoc.querySelectorAll('[data-sidebar-item]').forEach((item, i) => {
                        const targetIdx = item.getAttribute('data-sidebar-item') || String(i + 1);
                        const isActive = String(targetIdx) === String(activeSidebar);
                        item.style.borderLeftColor = isActive ? '#063f78' : 'transparent';
                        item.style.background = isActive ? '#f0f9ff' : 'transparent';
                        item.style.color = isActive ? '#063f78' : '#374151';
                        item.style.fontWeight = isActive ? '600' : '500';
                    });

                    // Apply data-var text overrides
                    renderDoc.querySelectorAll('[data-var]').forEach(el => {
                        const name = el.getAttribute('data-var');
                        const propKey = `prop_${name}`;
                        let value = this.model.get(propKey);

                        // If explicitly cleared (empty string), use a placeholder in editor
                        if (value === '') value = `[Empty ${name}]`;
                        else value = value || fetchedDefaultProps[name] || el.textContent.trim();

                        // Only update text content (preserve child elements that have their own data-var)
                        if (el.children.length === 0) {
                            el.textContent = value;
                        } else {
                            // For elements with children, only update direct text nodes
                            el.childNodes.forEach(node => {
                                if (node.nodeType === 3 /* TEXT_NODE */ && node.textContent.trim()) {
                                    node.textContent = value;
                                }
                            });
                        }
                    });

                    // Apply data-var-src image overrides
                    renderDoc.querySelectorAll('[data-var-src]').forEach(el => {
                        const name = el.getAttribute('data-var-src');
                        const propKey = `prop_${name}`;
                        let value = this.model.get(propKey);

                        if (value === '') value = 'https://placehold.co/600x400/f3f4f6/9ca3af?text=Add+Image';
                        else value = value || fetchedDefaultProps[name] || el.getAttribute('src');

                        el.setAttribute('src', value);
                    });

                    // Apply data-var-video overrides
                    renderDoc.querySelectorAll('[data-var-video]').forEach(el => {
                        const name = el.getAttribute('data-var-video');
                        const propKey = `prop_${name}`;
                        const value = this.model.get(propKey) || fetchedDefaultProps[name] || el.getAttribute('src');
                        el.setAttribute('src', value);
                    });

                    // Apply data-var-html innerHTML overrides
                    renderDoc.querySelectorAll('[data-var-html]').forEach(el => {
                        const name = el.getAttribute('data-var-html');
                        const propKey = `prop_${name}`;
                        let value = this.model.get(propKey);

                        if (value === '') {
                            value = `<div style="padding:20px; border:2px dashed #e2e8f0; background:#f8fafc; border-radius:8px; text-align:center; color:#64748b; font-family:sans-serif;">
                                <div style="font-weight:700; margin-bottom:4px;">[Empty ${name}]</div>
                                <div style="font-size:12px;">Click to edit content</div>
                            </div>`;
                        } else {
                            value = value || fetchedDefaultProps[name] || el.innerHTML.trim();
                        }

                        el.innerHTML = value;
                    });

                    // Apply data-var-link overrides
                    renderDoc.querySelectorAll('[data-var-link]').forEach(el => {
                        const name = el.getAttribute('data-var-link');
                        const propKey = `prop_${name}`;
                        const value = this.model.get(propKey) || fetchedDefaultProps[name] || el.getAttribute('href');
                        el.setAttribute('href', value);
                    });

                    // ── Inject Editor-Only CSS (Hide distracting outlines) ──────────────────
                    const style = renderDoc.createElement('style');
                    style.textContent = `
                        /* Remove purple dashed outlines for nav icons and text to reduce distraction */
                        .gjs-dashed [data-sidebar-nav] *, 
                        .gjs-dashed [style*="border-bottom"] *,
                        .gjs-dashed [data-var] { 
                            outline: none !important; 
                        }
                        /* Sticky Tab Bar in Editor */
                        [data-content-tabs-bar] {
                            position: sticky !important;
                            top: 0 !important;
                            background: white !important;
                            z-index: 100 !important;
                            padding: 4px 0 !important;
                            border-bottom: 1px solid #e2e8f0 !important;
                        }

                        /* Responsive Editor Preview Simulation */
                        @media (max-width: 991px) {
                            [style*="max-width:1400px"] { flex-direction: column !important; padding: 0 !important; }
                            aside { width: 100% !important; margin-bottom: 0 !important; position: sticky !important; top: 0 !important; z-index: 100 !important; background: white !important; }
                            nav[data-sidebar-nav] { display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; overflow-x: auto !important; }
                            [data-sidebar-item] { flex-shrink: 0 !important; border-left: 0 !important; border-bottom: 3px solid transparent !important; }
                            main { width: 100% !important; padding: 16px !important; }
                            [data-content-tabs-bar] { position: sticky !important; top: 47px !important; z-index: 99 !important; background: white !important; margin: -16px -16px 20px -16px !important; width: calc(100% + 32px) !important; }
                        }
                        
                        /* But keep a subtle focus for the whole item */
                        .gjs-dashed [data-sidebar-item],
                        .gjs-dashed [data-content-tab] {
                            outline: 1px dashed rgba(6, 63, 120, 0.3) !important;
                        }
                    `;
                    renderDoc.head.appendChild(style);

                    // Apply auto-image overrides by index
                    let autoIdx = 0;
                    renderDoc.querySelectorAll('img').forEach(img => {
                        if (!img.getAttribute('data-var-src')) {
                            autoIdx++;
                            const autoName = `prop_img_${autoIdx}_src`;
                            const value = this.model.get(autoName);
                            if (value) img.setAttribute('src', value);
                        }
                    });

                    let finalHtml = renderDoc.body.innerHTML;

                    // Apply {{ variable }} global text replacements for backwards compatibility
                    textVars.forEach((_, name) => {
                        const propKey = `prop_${name}`;
                        const value = this.model.get(propKey);
                        if (value !== undefined && value !== null) {
                            // Replace exactly {{name}} or {{ name }} in the final HTML
                            const regex = new RegExp(`\\{\\{\\s*${name}\\s*\\}\\}`, 'g');
                            finalHtml = finalHtml.replace(regex, value);
                        }
                    });

                    // ── Dynamic module row expansion ───────────────────────────
                    // If modules_count > base module count, inject additional rows
                    let htmlToRender = finalHtml;
                    if (baseModuleCount > 0) {
                        const propKey = activeTab ? `prop_${activeTab}_modules_count` : 'prop_modules_count';
                        const currentCount = parseInt(this.model.get(propKey) || baseModuleCount, 10);
                        if (currentCount > baseModuleCount) {
                            const tempDoc = parser.parseFromString(htmlToRender, 'text/html');
                            const activePane = activeTab ? tempDoc.querySelector(`[data-tab-pane="${activeTab}"]`) : tempDoc;
                            const moduleList = activePane ? activePane.querySelectorAll('[data-module]') : [];
                            const lastModule = moduleList[moduleList.length - 1];
                            const parentList = lastModule?.parentElement;
                            if (parentList) {
                                const prefix = activeTab ? `${activeTab}_` : '';
                                for (let i = baseModuleCount + 1; i <= currentCount; i++) {
                                    const title = this.model.get(`prop_${prefix}mod${i}_title`) || `Module ${i}: New Topic`;
                                    const desc = this.model.get(`prop_${prefix}mod${i}_desc`) || '';
                                    const newRow = document.createElement('details');
                                    newRow.setAttribute('data-module', '');
                                    newRow.style.cssText = 'margin-bottom:8px; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;';
                                    newRow.innerHTML = `
                                    <summary style="display:flex; align-items:center; gap:12px; padding:14px 16px; cursor:pointer; background:#fff; list-style:none; font-weight:600; font-size:14px; color:#111827;">
                                        <span style="width:26px; height:26px; background:#e5e7eb; color:#374151; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">${i}</span>
                                        <span style="flex:1;" data-module-title>${title}</span>
                                        <span class="mod-chevron">›</span>
                                    </summary>
                                    ${desc ? `<div style="padding:12px 16px 16px 54px; background:#fff; border-top:1px solid #f3f4f6;"><p style="font-size:13px; color:#6b7280; margin:0; line-height:1.6;">${desc}</p></div>` : ''}
                                `;
                                    parentList.appendChild(newRow);
                                }
                            }
                            htmlToRender = tempDoc.body.innerHTML;
                        }
                    }

                    // ── Dynamic testimonial row expansion ───────────────────────────
                    if (baseTestCount > 0) {
                        const currentCount = parseInt(this.model.get('prop_testimonials_count') || baseTestCount, 10);
                        if (currentCount > baseTestCount) {
                            const tempDoc = parser.parseFromString(htmlToRender, 'text/html');
                            const list = tempDoc.querySelectorAll('[data-testimonial]');
                            const parentList = list[list.length - 1]?.parentElement;
                            if (parentList) {
                                for (let i = baseTestCount + 1; i <= currentCount; i++) {
                                    const prefix = `prop_test_t${i}_`;
                                    const company = this.model.get(prefix + 'company') || 'Company';
                                    const desc = this.model.get(prefix + 'desc') || '';
                                    const name = this.model.get(prefix + 'name') || 'Name';
                                    const role = this.model.get(prefix + 'role') || 'Role';
                                    const logoSrc = this.model.get(prefix + 'logo') || `https://placehold.co/40x40/475569/ffffff?text=C${i}`;
                                    const avatarSrc = this.model.get(prefix + 'avatar') || `https://i.pravatar.cc/60?img=${i + 10}`;

                                    const newRow = document.createElement('div');
                                    newRow.setAttribute('data-testimonial', '');
                                    newRow.style.cssText = 'flex:0 0 320px; background:#fff; border-radius:16px; padding:32px; box-shadow:0 10px 25px rgba(0,0,0,0.05); border:1px solid #f1f5f9; display:flex; flex-direction:column; min-height:280px; scroll-snap-align:start;';
                                    newRow.innerHTML = `
                                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
                                        <img data-var-src="test_t${i}_logo" src="${logoSrc}" style="width:32px; height:32px; object-fit:contain; border-radius:50%;" />
                                        <span style="font-weight:700; font-size:18px; color:#334155; text-transform:uppercase;" data-var="test_t${i}_company">${company}</span>
                                    </div>
                                    <p style="font-size:15px; color:#475569; line-height:1.6; flex:1; margin:0 0 32px 0;" data-var="test_t${i}_desc">${desc}</p>
                                    <div style="display:flex; align-items:center; gap:16px;">
                                        <img data-var-src="test_t${i}_avatar" src="${avatarSrc}" style="width:48px; height:48px; border-radius:50%; object-fit:cover;" />
                                        <div>
                                            <div style="font-weight:700; font-size:15px; color:#1e293b;" data-var="test_t${i}_name">${name}</div>
                                            <div style="font-size:13px; color:#64748b;" data-var="test_t${i}_role">${role}</div>
                                        </div>
                                    </div>
                                `;
                                    parentList.appendChild(newRow);
                                }
                            }
                            htmlToRender = tempDoc.body.innerHTML;
                        }
                    }

                    // ── Dynamic Sidebar Item Expansion ─────────────────────────
                    if (baseSidebarCount > 0) {
                        const currentCount = parseInt(this.model.get('prop_sidebar_items_count') || baseSidebarCount, 10);
                        if (currentCount > baseSidebarCount) {
                            const tempDoc = parser.parseFromString(htmlToRender, 'text/html');
                            const sidebarNav = tempDoc.querySelector('[data-sidebar-nav]');
                            const sidebarContentArea = tempDoc.querySelector('[data-sidebar-content]');
                            const lastSidebarItem = tempDoc.querySelector('[data-sidebar-item]:last-of-type');

                            if (sidebarNav && lastSidebarItem) {
                                for (let i = baseSidebarCount + 1; i <= currentCount; i++) {
                                    const label = this.model.get(`prop_sidebar_item${i}_label`) || `Item ${i}`;
                                    const href = this.model.get(`prop_sidebar_item${i}_href`) || `#section-${i}`;
                                    const content = this.model.get(`prop_sidebar_item${i}_content`) || `<h2>${label}</h2><p>Add your content here...</p>`;

                                    // Add nav item
                                    const navItem = document.createElement('a');
                                    navItem.setAttribute('data-sidebar-item', `${i}`);
                                    navItem.setAttribute('href', href);
                                    navItem.style.cssText = 'display:flex; align-items:center; gap:8px; padding:10px 16px; text-decoration:none; color:#374151; font-size:14px; font-weight:500; border-left:2px solid transparent; transition:all 0.2s;';
                                    navItem.innerHTML = `<span>${label}</span>`;
                                    sidebarNav.appendChild(navItem);

                                    // Add content section
                                    if (sidebarContentArea) {
                                        const section = document.createElement('section');
                                        section.setAttribute('data-sidebar-section', `${i}`);
                                        section.style.cssText = 'padding:20px 0; border-top:1px solid #e5e7eb; margin-top:20px;';
                                        section.innerHTML = content;
                                        sidebarContentArea.appendChild(section);
                                    }
                                }
                            }
                            htmlToRender = tempDoc.body.innerHTML;
                        }
                    }

                    // ── Dynamic Content Tab Expansion ──────────────────────────
                    if (baseTabCount > 0) {
                        const currentCount = parseInt(this.model.get('prop_tabs_count') || baseTabCount, 10);
                        if (currentCount > baseTabCount) {
                            const tempDoc = parser.parseFromString(htmlToRender, 'text/html');
                            const tabBar = tempDoc.querySelector('[data-content-tabs-bar]');
                            const tabContents = tempDoc.querySelector('[data-content-tabs-content]');

                            if (tabBar) {
                                for (let i = baseTabCount + 1; i <= currentCount; i++) {
                                    const tabLabel = this.model.get(`prop_tab${i}_label`) || `Tab ${i}`;
                                    const tabContent = this.model.get(`prop_tab${i}_content`) || `<h2>${tabLabel}</h2><p>Add content here...</p>`;
                                    const sectionId = `content-tab-${i}`;

                                    const tabBtn = document.createElement('a');
                                    tabBtn.setAttribute('data-content-tab', `${i}`);
                                    tabBtn.href = `#${sectionId}`;
                                    tabBtn.style.cssText = 'padding:10px 16px; text-decoration:none; color:#374151; font-size:14px; font-weight:600; border-bottom:2px solid transparent; white-space:nowrap;';
                                    tabBtn.textContent = tabLabel;
                                    tabBar.appendChild(tabBtn);

                                    if (tabContents) {
                                        const contentSection = document.createElement('section');
                                        contentSection.id = sectionId;
                                        contentSection.setAttribute('data-content-section', `${i}`);
                                        contentSection.style.cssText = 'padding:32px 0; scroll-margin-top:80px;';
                                        contentSection.innerHTML = tabContent;
                                        tabContents.appendChild(contentSection);
                                    }
                                }
                            }
                            htmlToRender = tempDoc.body.innerHTML;
                        }
                    }

                    // ── Recursive Nested Template Resolution ───────────────────
                    const resolveNested = async (htmlString) => {
                        const tempParser = new DOMParser();
                        const tempDoc = tempParser.parseFromString(htmlString, 'text/html');
                        const nestedRefs = tempDoc.querySelectorAll('template-ref');
                        if (nestedRefs.length === 0) return htmlString;

                        const { adminService } = await import('@/services/adminService');
                        for (const ref of nestedRefs) {
                            const nId = ref.getAttribute('data-template-id');
                            if (!nId) continue;

                            try {
                                let nData;
                                if (_templateCache.has(nId)) {
                                    nData = _templateCache.get(nId);
                                } else {
                                    nData = await adminService.getPage(nId);
                                    if (nData?.data) nData = nData.data;
                                    _templateCache.set(nId, nData);
                                }

                                if (nData) {
                                    let nHtml = nData.gjsHtml || '';
                                    let nProps = nData.defaultProps || {};
                                    const rawProps = ref.getAttribute('data-props');
                                    if (rawProps) {
                                        try { Object.assign(nProps, JSON.parse(rawProps.replace(/&quot;/g, '"'))); } catch (e) { }
                                    }

                                    for (const [key, val] of Object.entries(nProps)) {
                                        if (val !== undefined && val !== null) {
                                            const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
                                            nHtml = nHtml.replace(regex, val);
                                        }
                                    }

                                    const nDoc = tempParser.parseFromString(nHtml, 'text/html');
                                    nDoc.querySelectorAll('[data-var]').forEach(el => {
                                        const name = el.getAttribute('data-var');
                                        if (nProps[name] !== undefined) {
                                            if (el.children.length === 0) {
                                                el.textContent = nProps[name];
                                            } else {
                                                el.childNodes.forEach(node => {
                                                    if (node.nodeType === 3 && node.textContent.trim()) {
                                                        node.textContent = nProps[name];
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    nDoc.querySelectorAll('[data-var-src]').forEach(el => {
                                        const name = el.getAttribute('data-var-src');
                                        if (nProps[name]) el.setAttribute('src', nProps[name]);
                                    });
                                    nDoc.querySelectorAll('[data-var-video]').forEach(el => {
                                        const name = el.getAttribute('data-var-video');
                                        if (nProps[name]) el.setAttribute('src', nProps[name]);
                                    });
                                    nDoc.querySelectorAll('[data-var-link]').forEach(el => {
                                        const name = el.getAttribute('data-var-link');
                                        if (nProps[name]) el.setAttribute('href', nProps[name]);
                                    });

                                    // ── Dynamic module row expansion (nested) ─────────────────────────
                                    const moduleEls = nDoc.querySelectorAll('[data-module]');
                                    const baseModuleCount = moduleEls.length;
                                    if (baseModuleCount > 0) {
                                        const currentCount = parseInt(nProps['modules_count'] || baseModuleCount, 10);
                                        if (currentCount > baseModuleCount) {
                                            const lastModule = moduleEls[moduleEls.length - 1];
                                            const parentList = lastModule?.parentElement;
                                            if (parentList) {
                                                for (let i = baseModuleCount + 1; i <= currentCount; i++) {
                                                    const title = nProps[`mod${i}_title`] || `Module ${i}: New Topic`;
                                                    const desc = nProps[`mod${i}_desc`] || '';
                                                    const newRow = document.createElement('details');
                                                    newRow.setAttribute('data-module', '');
                                                    newRow.style.cssText = 'margin-bottom:8px; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;';
                                                    newRow.innerHTML = `
                                                    <summary style="display:flex; align-items:center; gap:12px; padding:14px 16px; cursor:pointer; background:#fff; list-style:none; font-weight:600; font-size:14px; color:#111827;">
                                                        <span style="width:26px; height:26px; background:#e5e7eb; color:#374151; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0;">${i}</span>
                                                        <span style="flex:1;" data-module-title>${title}</span>
                                                        <span class="mod-chevron">›</span>
                                                    </summary>
                                                    ${desc ? `<div style="padding:12px 16px 16px 54px; background:#fff; border-top:1px solid #f3f4f6;"><p style="font-size:13px; color:#6b7280; margin:0; line-height:1.6;">${desc}</p></div>` : ''}
                                                `;
                                                    parentList.appendChild(newRow);
                                                }
                                            }
                                        }
                                    }

                                    // ── Dynamic testimonial row expansion (nested) ────────────────────
                                    const testimonialEls = nDoc.querySelectorAll('[data-testimonial]');
                                    const baseTestCount = testimonialEls.length;
                                    if (baseTestCount > 0) {
                                        const currentCount = parseInt(nProps['testimonials_count'] || baseTestCount, 10);
                                        if (currentCount > baseTestCount) {
                                            const lastTest = testimonialEls[testimonialEls.length - 1];
                                            const parentList = lastTest?.parentElement;
                                            if (parentList) {
                                                for (let i = baseTestCount + 1; i <= currentCount; i++) {
                                                    const prefix = `test_t${i}_`;
                                                    const company = nProps[`${prefix}company`] || 'Company';
                                                    const desc = nProps[`${prefix}desc`] || '';
                                                    const name = nProps[`${prefix}name`] || 'Name';
                                                    const role = nProps[`${prefix}role`] || 'Role';
                                                    const logoSrc = nProps[`${prefix}logo`] || `https://placehold.co/40x40/475569/ffffff?text=C${i}`;
                                                    const avatarSrc = nProps[`${prefix}avatar`] || `https://i.pravatar.cc/60?img=${i + 10}`;

                                                    const newRow = document.createElement('div');
                                                    newRow.setAttribute('data-testimonial', '');
                                                    newRow.style.cssText = 'flex:0 0 320px; background:#fff; border-radius:16px; padding:32px; box-shadow:0 10px 25px rgba(0,0,0,0.05); border:1px solid #f1f5f9; display:flex; flex-direction:column; min-height:280px; scroll-snap-align:start;';
                                                    newRow.innerHTML = `
                                                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
                                                        <img data-var-src="${prefix}logo" src="${logoSrc}" style="width:32px; height:32px; object-fit:contain; border-radius:50%;" />
                                                        <span style="font-weight:700; font-size:18px; color:#334155; text-transform:uppercase;" data-var="${prefix}company">${company}</span>
                                                    </div>
                                                    <p style="font-size:15px; color:#475569; line-height:1.6; flex:1; margin:0 0 32px 0;" data-var="${prefix}desc">${desc}</p>
                                                    <div style="display:flex; align-items:center; gap:16px;">
                                                        <img data-var-src="${prefix}avatar" src="${avatarSrc}" style="width:48px; height:48px; border-radius:50%; object-fit:cover;" />
                                                        <div>
                                                            <div style="font-weight:700; font-size:15px; color:#1e293b;" data-var="${prefix}name">${name}</div>
                                                            <div style="font-size:13px; color:#64748b;" data-var="${prefix}role">${role}</div>
                                                        </div>
                                                    </div>
                                                `;
                                                    parentList.appendChild(newRow);
                                                }
                                            }
                                        }
                                    }

                                    nHtml = nDoc.body.innerHTML;

                                    const wrapper = document.createElement('div');
                                    wrapper.className = ref.className || 'template-ref-placeholder';
                                    wrapper.setAttribute('data-template-id', nId);
                                    wrapper.innerHTML = await resolveNested(nHtml);
                                    ref.replaceWith(wrapper);
                                }
                            } catch (e) {
                                console.error('[templateRef] Failed to resolve nested template', e);
                            }
                        }
                        return tempDoc.body.innerHTML;
                    };

                    htmlToRender = await resolveNested(htmlToRender);

                    // ── Light DOM Rendering ────────────────────────────────────
                    // NO Shadow DOM — inject directly so Tailwind & global CSS apply
                    this.el.innerHTML = '';

                    const wrapper = document.createElement('div');
                    wrapper.className = 'template-ref-content';
                    wrapper.setAttribute('data-template-id', templateId);

                    // Inject template CSS as scoped style tag
                    if (css) {
                        const styleEl = document.createElement('style');
                        styleEl.textContent = css;
                        wrapper.appendChild(styleEl);
                    }

                    // Inject rendered HTML
                    const contentDiv = document.createElement('div');
                    contentDiv.innerHTML = htmlToRender;

                    // user-select:none prevents text selection (better than pointer-events:none
                    // which blocks ALL clicks — including accordion/tabs inside the section).
                    // GrapeJS won't select inner elements because they're raw DOM, not GrapeJS models.
                    // IMPORTANT: display: flow-root prevents inner floats/margins from breaking the container boundaries
                    contentDiv.style.cssText = 'user-select: none; display: flow-root; width: 100%;';
                    wrapper.appendChild(contentDiv);
                    wrapper.style.cssText = 'position:relative; display:block; width: 100%;';

                    // Tabs + accordion work natively now that pointer-events:none is gone.
                    // We just need to wire up tab active state switching and chevron updates.
                    this._initSectionInteractivity(contentDiv);

                    // Identity badge
                    const badge = document.createElement('div');
                    badge.style.cssText = 'position:absolute; top:0; left:0; background:rgba(249,115,22,0.9); color:white; font-size:10px; padding:2px 8px; border-bottom-right-radius:4px; z-index:10; font-family:sans-serif; font-weight:600; pointer-events:none;';
                    badge.textContent = templateData.title || 'Section';
                    wrapper.appendChild(badge);

                    this.el.appendChild(wrapper);

                    // CRITICAL: CSS layout constraints are applied in onRender
                    // to ensure both empty and loaded templates are properly isolated.

                } catch (err) {
                    console.error('[templateRef] Render error:', err);
                    this.el.innerHTML = `
                    <div style="padding:20px; border:2px dashed #f87171; background:#fef2f2; text-align:center; color:#991b1b; font-family:sans-serif; border-radius:8px;">
                        <strong>Failed to load section</strong>
                        <p style="font-size:12px; margin-top:4px; color:#dc2626;">ID: ${templateId}</p>
                        <p style="font-size:11px; color:#9ca3af;">${err.message}</p>
                    </div>`;
                }
            },
            onDuplicate() {
                this.model.set('_force_trait_reset', true, { silent: true });
            }
        }
    });

    // ── Block: manual template reference ─────────────────────────────────────
    bm.add('template-reference', {
        label: `
            <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24">
                    <rect x="2" y="3" width="20" height="18" rx="2" stroke="#3b82f6" stroke-width="1.5"/>
                    <path d="M2 8h20M8 12h8M8 16h5" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <div style="font-size:11px; font-weight:600;">Template Ref</div>
            </div>`,
        category: 'Advanced',
        content: '<template-ref data-template-id=""></template-ref>',
    });
};

// ── Helper re-exported so templateBlocks.js can use the same label logic ──────
export { toLabel };

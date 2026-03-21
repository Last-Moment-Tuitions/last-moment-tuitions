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
const _templateCache = new Map();

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
                    if (hasVarChange) this.trigger('change:templateContent');
                });
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

                    tabs.forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            // stopPropagation so GrapeJS doesn't interpret the click
                            // as an attempt to deselect / re-select the component
                            e.stopPropagation();
                            activateTab(btn);

                            const tabId = btn.getAttribute('data-tab');
                            if (tabId) {
                                // Important: trigger a re-render of the component and force
                                // the traits panel to update with variables from the new tab
                                this.model.set('_force_trait_reset', true, { silent: true });
                                this.model.set('prop_active_tab', tabId);
                            }
                        });
                    });
                }

                // ── 2. Accordion chevron sync ────────────────────────────────────
                // <details> opens/closes natively, but the chevron span inside
                // <summary> needs to be updated manually.
                const allDetails = contentDiv.querySelectorAll('details[data-module]');
                allDetails.forEach(details => {
                    const summary = details.querySelector('summary');
                    const chevron = summary?.querySelector('span:last-child, .mod-chevron');

                    // Set initial state
                    if (chevron) chevron.textContent = details.open ? '−' : '›';

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
                    testPrev.addEventListener('click', (e) => {
                        e.stopPropagation();
                        testTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                    });
                    testNext.addEventListener('click', (e) => {
                        e.stopPropagation();
                        testTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                    });

                    // Auto-slide logic
                    let isHovering = false;
                    testTrack.addEventListener('mouseenter', () => isHovering = true);
                    testTrack.addEventListener('mouseleave', () => isHovering = false);

                    if (this._sliderInterval) clearInterval(this._sliderInterval);
                    this._sliderInterval = setInterval(() => {
                        if (isHovering || !testTrack.isConnected) return;

                        // Check if we hit the end
                        if (Math.ceil(testTrack.scrollLeft + testTrack.clientWidth) >= testTrack.scrollWidth) {
                            testTrack.scrollTo({ left: 0, behavior: 'smooth' });
                        } else {
                            testTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                        }
                    }, 3000);
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

                this.el.innerHTML = `
                    <div style="padding:20px; border:2px dashed #d1d5db; background:#f9fafb; text-align:center; color:#6b7280; font-family:sans-serif; border-radius:8px;">
                        <div style="display:inline-block; width:20px; height:20px; border:2px solid #9ca3af; border-top-color:#f97316; border-radius:50%; animation:spin 0.8s linear infinite; margin-bottom:8px;"></div>
                        <div style="font-size:13px;">Loading section...</div>
                    </div>
                    <style>@keyframes spin{100%{transform:rotate(360deg)}}</style>`;

                try {
                    const configModule = await import('@/lib/config');
                    const API_BASE_URL = configModule.default;

                    // ── Fetch with cache ───────────────────────────────────────
                    let templateData;
                    if (_templateCache.has(templateId)) {
                        templateData = _templateCache.get(templateId);
                    } else {
                        const res = await fetch(`${API_BASE_URL}/pages/id/${templateId}`);
                        if (!res.ok) throw new Error(`API Error: ${res.status} for template ${templateId}`);
                        const json = await res.json();
                        if (!json.success || !json.data) throw new Error(`No data for template ${templateId}`);
                        templateData = json.data;
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

                    // Pre-process doc to find hidden panes
                    // If a tab pane is not active, we ignore its variables so they don't clutter the sidebar
                    doc.querySelectorAll('[data-tab-pane]').forEach(pane => {
                        if (pane.getAttribute('data-tab-pane') === activeTab) {
                            pane.setAttribute('data-hidden-pane', 'false');
                        } else {
                            pane.setAttribute('data-hidden-pane', 'true');
                        }
                    });

                    const isVisible = (el) => {
                        const pane = el.closest('[data-tab-pane]');
                        return !pane || pane.getAttribute('data-hidden-pane') !== 'true';
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

                    // 5. Auto-detect unbound <img> tags (img_1_src, img_2_src...)
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

                    // ── Apply Variable Values to HTML ───────────────────────────
                    const renderDoc = parser.parseFromString(html, 'text/html');

                    // Apply active styles to the buttons to prevent them from reverting to Seeded HTML state
                    renderDoc.querySelectorAll('[data-tab]').forEach(btn => {
                        if (btn.getAttribute('data-tab') === activeTab) {
                            btn.style.background = '#111827';
                            btn.style.color = '#fff';
                            btn.style.borderColor = '#111827';
                            btn.style.fontWeight = '700';
                        } else {
                            btn.style.background = 'transparent';
                            btn.style.color = '#374151';
                            btn.style.borderColor = 'transparent';
                            btn.style.fontWeight = '600';
                        }
                    });

                    // Make sure renderDoc hides/shows the right tab panes for final output
                    // Note: activeTab was already extracted at the beginning of the function
                    renderDoc.querySelectorAll('[data-tab-pane]').forEach(pane => {
                        if (pane.getAttribute('data-tab-pane') === activeTab) {
                            pane.style.display = 'block';
                        } else {
                            pane.style.display = 'none';
                        }
                    });

                    // Apply data-var text overrides
                    renderDoc.querySelectorAll('[data-var]').forEach(el => {
                        const name = el.getAttribute('data-var');
                        const propKey = `prop_${name}`;
                        const value = this.model.get(propKey) || fetchedDefaultProps[name] || el.textContent.trim();
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
                        const value = this.model.get(propKey) || fetchedDefaultProps[name] || el.getAttribute('src');
                        el.setAttribute('src', value);
                    });

                    // Apply data-var-video overrides
                    renderDoc.querySelectorAll('[data-var-video]').forEach(el => {
                        const name = el.getAttribute('data-var-video');
                        const propKey = `prop_${name}`;
                        const value = this.model.get(propKey) || fetchedDefaultProps[name] || el.getAttribute('src');
                        el.setAttribute('src', value);
                    });

                    // Apply data-var-link overrides
                    renderDoc.querySelectorAll('[data-var-link]').forEach(el => {
                        const name = el.getAttribute('data-var-link');
                        const propKey = `prop_${name}`;
                        const value = this.model.get(propKey) || fetchedDefaultProps[name] || el.getAttribute('href');
                        el.setAttribute('href', value);
                    });

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

                    const finalHtml = renderDoc.body.innerHTML;

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
                    contentDiv.style.cssText = 'user-select: none;';
                    wrapper.appendChild(contentDiv);
                    wrapper.style.cssText = 'position:relative; display:block;';

                    // ── Section Interactivity ──────────────────────────────────
                    // Tabs + accordion work natively now that pointer-events:none is gone.
                    // We just need to wire up tab active state switching and chevron updates.
                    this._initSectionInteractivity(contentDiv);

                    // Identity badge
                    const badge = document.createElement('div');
                    badge.style.cssText = 'position:absolute; top:0; left:0; background:rgba(249,115,22,0.9); color:white; font-size:10px; padding:2px 8px; border-bottom-right-radius:4px; z-index:10; font-family:sans-serif; font-weight:600; pointer-events:none;';
                    badge.textContent = templateData.title || 'Section';
                    wrapper.appendChild(badge);

                    this.el.appendChild(wrapper);
                    this.el.style.position = 'relative';

                } catch (err) {
                    console.error('[templateRef] Render error:', err);
                    this.el.innerHTML = `
                        <div style="padding:20px; border:2px dashed #f87171; background:#fef2f2; text-align:center; color:#991b1b; font-family:sans-serif; border-radius:8px;">
                            <strong>Failed to load section</strong>
                            <p style="font-size:12px; margin-top:4px; color:#dc2626;">ID: ${templateId}</p>
                            <p style="font-size:11px; color:#9ca3af;">${err.message}</p>
                        </div>`;
                }
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

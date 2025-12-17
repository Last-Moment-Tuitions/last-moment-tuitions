export const loadTemplateRefBlock = (editor) => {
    const bm = editor.BlockManager;
    const domc = editor.DomComponents;

    // 1. Define the Component Type
    domc.addType('template-ref', {
        model: {
            defaults: {
                tagName: 'template-ref',
                draggable: true,
                droppable: false,
                attributes: { class: 'template-ref-placeholder' },
                traits: [
                    {
                        type: 'text',
                        name: 'templateId',
                        label: 'Template ID'
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
                // Visual representation in Editor
                components: (model) => {
                    const id = model.get('attributes').templateId || 'Select ID';
                    return `
                        <div class="p-4 border-2 border-dashed border-blue-400 bg-blue-50 rounded text-center">
                            <h4 class="font-bold text-blue-800">Global Template</h4>
                            <p class="text-xs text-blue-600">ID: ${id}</p>
                            <p class="text-xs text-gray-500 mt-1">Content will include automatically.</p>
                        </div>
                     `;
                }
            },
            init() {
                this.on('change:attributes:templateId', this.handleIdChange);
            },
            handleIdChange() {
                const id = this.getAttributes().templateId || 'None';
                // Update specific visual element if needed, or re-render
                const content = `
                        <div class="p-4 border-2 border-dashed border-blue-400 bg-blue-50 rounded text-center">
                            <h4 class="font-bold text-blue-800">Global Template</h4>
                            <p class="text-xs text-blue-600">ID: ${id}</p>
                            <p class="text-xs text-gray-500 mt-1">Content will include automatically.</p>
                        </div>
                     `;
                this.components(content);
            }
        },
        view: {
            // View logic if needed
        }
    });

    // 2. Add the Block
    bm.add('template-reference', {
        label: 'Global Template Ref',
        category: 'Advanced',
        content: { type: 'template-ref' } // Use the custom type
    });
};

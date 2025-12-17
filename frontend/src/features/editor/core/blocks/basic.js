export const loadBlocks = (editor) => {
    const bm = editor.BlockManager;

    bm.add('section', {
        label: 'Section',
        category: 'Basic',
        attributes: { class: 'gjs-fonts gjs-f-b1' },
        content: `<section class="py-12 px-4 container mx-auto">
      <h2 class="text-3xl font-bold mb-4 text-gray-900">New Section</h2>
      <p class="text-gray-600">Add your content here.</p>
    </section>`
    });

    bm.add('text', {
        label: 'Text',
        category: 'Basic',
        attributes: { class: 'gjs-fonts gjs-f-text' },
        content: '<div class="text-gray-700 p-2">Insert your text here</div>'
    });

    bm.add('image', {
        label: 'Image',
        category: 'Basic',
        attributes: { class: 'gjs-fonts gjs-f-image' },
        content: { type: 'image', classes: ['w-full', 'h-auto', 'rounded-lg'] }
    });

    bm.add('columns-2', {
        label: '2 Columns',
        category: 'Layout',
        content: `<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="p-4 border border-dashed border-gray-300 rounded">Column 1</div>
        <div class="p-4 border border-dashed border-gray-300 rounded">Column 2</div>
      </div>`
    });
};

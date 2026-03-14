export const loadBlocks = (editor) => {
    const bm = editor.BlockManager;

    // --- BASIC & LAYOUT ---
    bm.add('section', {
        label: 'Section',
        category: 'Basic',
        attributes: { class: 'gjs-fonts gjs-f-b1' },
        content: `<section class="py-12 px-4 w-full">
      <div class="container mx-auto">
        <h2 class="text-3xl font-bold mb-4 text-gray-900">New Section</h2>
        <p class="text-gray-600">Add your content here.</p>
      </div>
    </section>`
    });

    // --- TYPOGRAPHY ---
    bm.add('h1', {
        label: 'Heading 1',
        category: 'Typography',
        attributes: { class: 'gjs-fonts gjs-f-h1p' },
        content: '<h1 class="text-4xl font-extrabold text-gray-900 mb-4">Heading 1</h1>'
    });

    bm.add('h2', {
        label: 'Heading 2',
        category: 'Typography',
        attributes: { class: 'gjs-fonts gjs-f-h2p' },
        content: '<h2 class="text-3xl font-bold text-gray-900 mb-3">Heading 2</h2>'
    });

    bm.add('h3', {
        label: 'Heading 3',
        category: 'Typography',
        attributes: { class: 'gjs-fonts gjs-f-h3p' },
        content: '<h3 class="text-2xl font-semibold text-gray-800 mb-2">Heading 3</h3>'
    });

    bm.add('text', {
        label: 'Paragraph',
        category: 'Typography',
        attributes: { class: 'gjs-fonts gjs-f-text' },
        content: '<p class="text-base text-gray-600 leading-relaxed mb-4">Insert your text here. This is a standard paragraph block component.</p>'
    });

    bm.add('link', {
        label: 'Link',
        category: 'Typography',
        attributes: { class: 'gjs-fonts gjs-f-button' },
        content: '<a href="#" class="text-blue-600 hover:text-blue-800 underline">Link Text</a>'
    });

    bm.add('quote', {
        label: 'Blockquote',
        category: 'Typography',
        attributes: { class: 'gjs-fonts gjs-f-text' },
        content: '<blockquote class="p-4 my-4 border-l-4 border-blue-500 bg-gray-50 italic text-gray-700">"This is a sample blockquote."</blockquote>'
    });

    // --- MEDIA ---
    bm.add('image', {
        label: 'Image',
        category: 'Media',
        attributes: { class: 'gjs-fonts gjs-f-image' },
        content: { type: 'image', classes: ['w-full', 'h-auto', 'rounded-lg', 'shadow-sm'] }
    });

    bm.add('video', {
        label: 'Video',
        category: 'Media',
        attributes: { class: 'gjs-fonts gjs-f-video' },
        content: `<div class="aspect-w-16 aspect-h-9 w-full">
            <iframe class="w-full h-full min-h-[300px] rounded-lg shadow-sm" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>`
    });

    // --- FORMS ---
    bm.add('form', {
        label: 'Form',
        category: 'Forms',
        attributes: { class: 'gjs-fonts gjs-f-form' },
        content: `<form class="bg-gray-50 p-6 rounded-xl border border-gray-100 max-w-lg w-full flex flex-col gap-4">
            <div class="flex flex-col gap-1">
                <label class="font-semibold text-sm text-gray-700">Email Address</label>
                <input type="email" placeholder="you@example.com" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
            </div>
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-2 transition-colors">Submit</button>
        </form>`
    });

    bm.add('input', {
        label: 'Input',
        category: 'Forms',
        content: '<input type="text" placeholder="Text input" class="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />'
    });

    bm.add('textarea', {
        label: 'Textarea',
        category: 'Forms',
        content: '<textarea placeholder="Enter your message..." rows="4" class="px-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>'
    });

    bm.add('button', {
        label: 'Button',
        category: 'Forms',
        attributes: { class: 'gjs-fonts gjs-f-button' },
        content: '<button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm">Click Me</button>'
    });
};

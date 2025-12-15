export const gjsConfig = {
    container: '#gjs',
    height: '100vh',
    width: '100%',
    fromElement: false,
    canvas: {
        styles: [
            'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css', // Tailwind CDN for Editor Preview
            // 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css' // Optional: FontAwesome
        ]
    },
    storageManager: {
        type: 'remote',
        autosave: false, // We will manually trigger save
        stepsBeforeSave: 10,
        urlStore: '', // Set dynamically
        urlLoad: '', // Set dynamically
        contentTypeJson: true,
        headers: {
            'Content-Type': 'application/json',
        },
        // Map GrapesJS JSON to our Backend Schema
        onStore: (data, editor) => {
            const pagesHtml = editor.getHtml();
            const pagesCss = editor.getCss();
            return {
                gjsComponents: data.components,
                gjsStyles: data.styles,
                gjsHtml: pagesHtml,
                gjsCss: pagesCss,
                gjsAssets: data.assets,
            };
        },
        onLoad: (result) => {
            return {
                components: result.data.gjsComponents || [],
                styles: result.data.gjsStyles || [],
                assets: result.data.gjsAssets || [],
            };
        }
    },
    panels: { defaults: [] },
    deviceManager: {
        devices: [
            { name: 'Desktop', width: '' },
            { name: 'Mobile', width: '320px', widthMedia: '480px' }
        ]
    },
    blockManager: {
        appendTo: '#blocks',
    },
    selectorManager: { appendTo: '#styles-container' },
    styleManager: {
        appendTo: '#styles-container',
        sectors: [{
            name: 'Dimension',
            open: false,
            buildProps: ['width', 'min-height', 'padding', 'margin'],
            properties: [{
                type: 'integer',
                name: 'The width',
                property: 'width',
                units: ['px', '%'],
                defaults: 'auto',
                min: 0,
            }]
        }, {
            name: 'Layout',
            open: true,
            buildProps: ['display', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content', 'gap'],
            properties: [
                {
                    name: 'Display',
                    property: 'display',
                    type: 'select',
                    defaults: 'block',
                    list: [
                        { value: 'block', name: 'Block' },
                        { value: 'inline-block', name: 'Inline Block' },
                        { value: 'flex', name: 'Flex' },
                        { value: 'grid', name: 'Grid' },
                        { value: 'none', name: 'None' }
                    ],
                }
            ]
        }, {
            name: 'Typography',
            open: false,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align'],
        }, {
            name: 'Decorations',
            open: false,
            buildProps: ['background-color', 'border-radius', 'border', 'box-shadow', 'background'],
        }, {
            name: 'Extra',
            open: false,
            buildProps: ['opacity', 'cursor', 'overflow'],
        }]
    },
};

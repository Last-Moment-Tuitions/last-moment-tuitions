import grapesjs from 'grapesjs';
import { gjsConfig } from './config';
// Import 'grapesjs/dist/css/grapes.min.css'; // This normally needs to be imported in global CSS or locally

export function initEditor(pageId) {
    // Clone config to avoid mutating the original export
    const config = { ...gjsConfig };

    // Set dynamic URLs for storage
    // Assuming the API is proxied via Next.js to http://localhost:3001
    // We need to use full URL for client-side fetch if proxy implies different port
    const API_URL = 'http://localhost:3001/api/pages';

    // We are loading a specific page
    // Actually storageManager remote is tricky with specific IDs in URL properties
    // We might handle load saving manually via axios to have full control

    // Let's use local storageManager for now to just getting it running
    // config.storageManager.type = 'local';

    // Better: We configure it to NOT autoload/autosave and we handle it manually
    config.storageManager.type = null;

    const editor = grapesjs.init(config);

    return editor;
}

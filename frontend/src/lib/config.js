let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api';
if (!url.startsWith('http')) {
    url = `https://${url}`;
}
const API_BASE_URL = url;

export default API_BASE_URL;

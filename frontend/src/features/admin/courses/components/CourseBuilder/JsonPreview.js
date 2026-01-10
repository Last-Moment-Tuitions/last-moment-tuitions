import React from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui';

export default function JsonPreview({ data }) {
    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    };

    return (
        <div className="h-full flex flex-col bg-gray-900 rounded-xl overflow-hidden shadow-inner font-mono text-sm">
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                <span className="text-gray-400 font-semibold">Database Preview</span>
                <Button onClick={handleCopy} size="sm" variant="ghost" className="text-gray-400 hover:text-white h-7 gap-1">
                    <Copy size={12} /> Copy
                </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
                <pre className="text-green-400">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        </div>
    );
}

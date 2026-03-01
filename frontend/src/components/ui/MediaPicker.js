'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui';
import FileUpload from './FileUpload';
import { Loader2, CheckCircle, Image as ImageIcon, Video, FileText } from 'lucide-react';
import { getCookie } from '@/utils/cookie';
import API_BASE_URL from '@/lib/config';

export default function MediaPicker({
    category = 'image',
    onSelect,
    currentUrl = '',
    className = '',
    label = 'Select Media'
}) {
    const [mediaItems, setMediaItems] = useState([]);
    const [loadingLibrary, setLoadingLibrary] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('upload');
    const [selectedUrl, setSelectedUrl] = useState(currentUrl);

    useEffect(() => {
        setSelectedUrl(currentUrl);
    }, [currentUrl]);

    useEffect(() => {
        if (activeTab === 'library') {
            fetchMedia();
        }
    }, [activeTab, category]);

    const fetchMedia = async () => {
        setLoadingLibrary(true);
        setError(null);
        try {
            const sessionId = getCookie('sessionId');
            const res = await fetch(`${API_BASE_URL}/admin/uploads/media?type=${category}`, {
                headers: {
                    ...(sessionId ? { 'x-session-id': sessionId } : {})
                }
            });
            if (!res.ok) throw new Error('Failed to fetch media library');
            const data = await res.json();
            setMediaItems(data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingLibrary(false);
        }
    };

    const handleUploadComplete = (result) => {
        if (result && result.url) {
            setSelectedUrl(result.url);
        } else {
            setSelectedUrl(''); // Removed
        }
        if (onSelect) onSelect(result);
    };

    const handleLibrarySelect = (item) => {
        setSelectedUrl(item.url);
        if (onSelect) onSelect(item);
    };

    const Icon = category === 'image' ? ImageIcon : category === 'video' ? Video : FileText;

    return (
        <div className={`space-y-4 ${className}`}>
            <label className="block text-sm font-semibold text-gray-700">{label}</label>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">Upload New</TabsTrigger>
                    <TabsTrigger value="library">Media Library</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="pt-2">
                    <FileUpload
                        category={category}
                        onUploadComplete={handleUploadComplete}
                        currentUrl={selectedUrl}
                        label={`Upload ${category}`}
                    />
                </TabsContent>

                <TabsContent value="library" className="pt-2">
                    <div className="border border-gray-200 rounded-xl p-4 min-h-[250px] bg-gray-50/50">
                        {loadingLibrary ? (
                            <div className="flex flex-col items-center justify-center h-48">
                                <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-2" />
                                <span className="text-sm text-gray-500">Loading your media...</span>
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-500 py-8">{error}</div>
                        ) : mediaItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                                <Icon className="w-12 h-12 mb-3 text-gray-300 opacity-50" />
                                <p>No {category}s found in your library.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[300px] overflow-y-auto p-2">
                                {mediaItems.map((item) => (
                                    <div
                                        key={item.key}
                                        onClick={() => handleLibrarySelect(item)}
                                        className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden bg-white transition-all ${selectedUrl === item.url ? 'border-primary-500 ring-2 ring-primary-500/20' : 'border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        {category === 'image' ? (
                                            <div className="aspect-video relative">
                                                <img src={item.url} className="w-full h-full object-cover" alt="thumbnail" />
                                            </div>
                                        ) : (
                                            <div className="aspect-video flex items-center justify-center bg-gray-100">
                                                <Icon className="w-8 h-8 text-gray-400" />
                                                <span className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 rounded">{item.key.split('.').pop().toUpperCase()}</span>
                                            </div>
                                        )}

                                        {selectedUrl === item.url && (
                                            <div className="absolute top-2 right-2 bg-white rounded-full p-0.5 shadow-sm">
                                                <CheckCircle className="w-5 h-5 text-primary-600" />
                                            </div>
                                        )}

                                        <div className="text-xs text-center text-gray-500 truncate p-2 bg-gray-50/80 absolute bottom-0 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            {(item.size / 1024 / 1024).toFixed(1)} MB
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { getCookie } from '@/utils/cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Reusable FileUpload component with drag-and-drop and progress.
 *
 * Props:
 * - category: 'image' | 'video' | 'document'
 * - onUploadComplete: (result: { url, key, originalName, size, mimeType }) => void
 * - currentUrl?: string (show existing file)
 * - accept?: string (e.g. "image/*", "video/*", ".pdf")
 * - maxSizeMB?: number
 * - label?: string
 * - className?: string
 */
export default function FileUpload({
    category = 'image',
    onUploadComplete,
    currentUrl = '',
    accept = '',
    maxSizeMB = 10,
    label = 'Upload a file',
    className = '',
}) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState(currentUrl);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    // Determine accept string based on category if not provided
    const acceptStr = accept || {
        image: 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml',
        video: 'video/mp4,video/webm,video/ogg,video/quicktime',
        document: '.pdf,.doc,.docx,.ppt,.pptx,.txt',
    }[category] || '*';

    const handleFile = async (file) => {
        if (!file) return;

        // Client-side size check
        const maxBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxBytes) {
            setError(`File size exceeds ${maxSizeMB}MB limit`);
            return;
        }

        setError(null);
        setUploading(true);
        setProgress(0);

        try {
            const sessionId = getCookie('sessionId');
            const headers = { 'Content-Type': 'application/json' };
            if (sessionId) {
                headers['x-session-id'] = sessionId;
            }

            // 1. Request presigned URL from our backend
            setProgress(10);
            const presignedRes = await fetch(`${API_BASE_URL}/admin/uploads/presigned-url`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type,
                    category,
                    size: file.size,
                }),
            });

            if (!presignedRes.ok) {
                const errData = await presignedRes.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to get upload URL');
            }

            const { data } = await presignedRes.json();
            const { uploadUrl, publicUrl, key } = data;

            // 2. Upload file directly to S3 using the presigned URL
            setProgress(30);

            // We use XMLHttpRequest here to get real upload progress events to S3
            const xhr = new XMLHttpRequest();
            await new Promise((resolve, reject) => {
                xhr.open('PUT', uploadUrl);
                xhr.setRequestHeader('Content-Type', file.type);

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        // Progress from 30% to 100% during S3 upload
                        const uploadPct = Math.round((event.loaded / event.total) * 70);
                        setProgress(30 + uploadPct);
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve();
                    } else {
                        reject(new Error(`S3 upload failed with status ${xhr.status}`));
                    }
                };

                xhr.onerror = () => reject(new Error('S3 upload failed. Network error.'));
                xhr.send(file);
            });

            // 3. Upload successful
            setUploading(false);
            setUploadedUrl(publicUrl);
            setProgress(100);

            if (onUploadComplete) {
                onUploadComplete({
                    url: publicUrl,
                    key,
                    originalName: file.name,
                    size: file.size,
                    mimeType: file.type
                });
            }

        } catch (err) {
            setUploading(false);
            setError(err.message || 'Upload failed');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer?.files?.[0];
        if (file) handleFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleRemove = () => {
        setUploadedUrl('');
        setProgress(0);
        setError(null);
        if (onUploadComplete) {
            onUploadComplete({ url: '', key: '', originalName: '', size: 0, mimeType: '' });
        }
    };

    // Show uploaded preview
    if (uploadedUrl && !uploading) {
        return (
            <div className={`relative border border-gray-200 rounded-xl p-4 ${className}`}>
                <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                        {category === 'image' ? (
                            <img
                                src={uploadedUrl}
                                alt="Uploaded"
                                className="max-h-32 rounded-lg object-cover"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        ) : (
                            <p className="text-sm text-gray-700 truncate">{uploadedUrl}</p>
                        )}
                    </div>
                    <button
                        onClick={handleRemove}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${dragActive
                    ? 'border-primary-400 bg-primary-50'
                    : uploading
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                        : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
                    }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptStr}
                    onChange={handleInputChange}
                    className="sr-only"
                    disabled={uploading}
                />

                {uploading ? (
                    <div className="text-center">
                        <Loader2 className="mx-auto h-10 w-10 text-primary-500 animate-spin mb-3" />
                        <p className="text-sm font-medium text-gray-700">Uploading... {progress}%</p>
                        <div className="mt-2 w-48 bg-gray-200 rounded-full h-2 mx-auto">
                            <div
                                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                        <div className="flex text-sm text-gray-600">
                            <span className="font-medium text-primary-600 hover:text-primary-500">{label}</span>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Max {maxSizeMB}MB</p>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}

import React from 'react';
import { Video, FileText, Lock, Unlock, Folder } from 'lucide-react';

export default function LessonEditor({ node, onUpdate }) {
    if (!node) return <div className="p-10 text-center text-gray-500">Select an item to edit</div>;

    // Handle Folder Editing (Title only)
    if (node.type === 'folder') {
        return (
            <div className="max-w-2xl mx-auto space-y-8 text-center pt-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                    <Folder size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Folder</h2>
                <div className="max-w-sm mx-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Folder Name</label>
                    <input
                        type="text"
                        value={node.title}
                        onChange={(e) => onUpdate(node.id, { title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center font-medium"
                    />
                </div>
            </div>
        );
    }

    // Handle File Editing
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Edit Lesson</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="uppercase tracking-wide font-semibold text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{node.data?.type || 'file'}</span>
                    <span>•</span>
                    <span className="font-mono text-xs">{node.id}</span>
                </div>
            </div>

            {/* Main Form */}
            <div className="space-y-6">

                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title</label>
                    <input
                        type="text"
                        value={node.title}
                        onChange={(e) => onUpdate(node.id, { title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 font-medium text-lg"
                        placeholder="e.g. Introduction to React"
                    />
                </div>

                {/* Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => onUpdate(node.id, { data: { ...node.data, type: 'video' } })}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${node.data?.type === 'video'
                                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                                }`}
                        >
                            <Video size={18} />
                            <span className="font-medium text-sm">Video Lesson</span>
                        </button>
                        <button
                            onClick={() => onUpdate(node.id, { data: { ...node.data, type: 'document' } })}
                            className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${node.data?.type === 'document'
                                    ? 'border-orange-600 bg-orange-50 text-orange-700'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                                }`}
                        >
                            <FileText size={18} />
                            <span className="font-medium text-sm">Document / PDF</span>
                        </button>
                    </div>
                </div>

                {/* Dynamic Fields based on Type */}
                {node.data?.type === 'video' ? (
                    <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Video size={18} /> Video Details
                        </h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Video Source (URL or Embed ID)</label>
                            <input
                                type="text"
                                value={node.data?.content || ''}
                                onChange={(e) => onUpdate(node.id, { data: { ...node.data, content: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="e.g. YouTube ID or Vimeo URL"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <FileText size={18} /> Document Details
                        </h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload PDF or Enter Content URL</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-white">
                                <div className="space-y-1 text-center">
                                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                                            <span>Upload a PDF</span>
                                            <input type="file" className="sr-only" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Access Control */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Access Control</label>
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="lockStatus"
                                checked={!node.data?.isLocked}
                                onChange={() => onUpdate(node.id, { data: { ...node.data, isLocked: false } })}
                                className="text-primary-600 focus:ring-primary-500"
                            />
                            <span className="flex items-center gap-1.5 text-sm text-gray-700">
                                <Unlock size={16} className="text-green-600" /> Free Preview
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="lockStatus"
                                checked={node.data?.isLocked}
                                onChange={() => onUpdate(node.id, { data: { ...node.data, isLocked: true } })}
                                className="text-primary-600 focus:ring-primary-500"
                            />
                            <span className="flex items-center gap-1.5 text-sm text-gray-700">
                                <Lock size={16} className="text-amber-600" /> Locked (Premium)
                            </span>
                        </label>
                    </div>
                </div>

            </div>
        </div>
    );
}

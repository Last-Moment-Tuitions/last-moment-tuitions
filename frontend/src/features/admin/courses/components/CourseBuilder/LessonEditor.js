import React from 'react';
import { Video, FileText, Lock, Unlock, Folder, ClipboardList, BookOpen, Clock } from 'lucide-react';
import MediaPicker from '@/components/ui/MediaPicker';

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

    const contentType = node.data?.type || 'video';

    const contentTypes = [
        { key: 'video', label: 'Video Lesson', icon: Video, color: 'purple' },
        { key: 'document', label: 'Document / PDF', icon: FileText, color: 'orange' },
        { key: 'quiz', label: 'Quiz', icon: ClipboardList, color: 'green' },
        { key: 'assignment', label: 'Assignment', icon: BookOpen, color: 'blue' },
    ];

    // Handle File Editing
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Edit Lesson</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="uppercase tracking-wide font-semibold text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{contentType}</span>
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
                        {contentTypes.map(({ key, label, icon: Icon, color }) => (
                            <button
                                key={key}
                                onClick={() => onUpdate(node.id, { data: { ...node.data, type: key } })}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${contentType === key
                                    ? `border-${color}-600 bg-${color}-50 text-${color}-700`
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
                                    }`}
                            >
                                <Icon size={18} />
                                <span className="font-medium text-sm">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dynamic Fields based on Type */}
                {contentType === 'video' && (
                    <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Video size={18} /> Video Details
                        </h4>
                        <div>
                            <MediaPicker
                                category="video"
                                label="Upload Video or Select from Library"
                                currentUrl={node.data?.content || ''}
                                onSelect={(result) => onUpdate(node.id, { data: { ...node.data, content: result.url } })}
                            />
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Or enter External URL (e.g. YouTube ID)</label>
                                <input
                                    type="text"
                                    value={node.data?.content || ''}
                                    onChange={(e) => onUpdate(node.id, { data: { ...node.data, content: e.target.value } })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="e.g. YouTube ID or Vimeo URL"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {contentType === 'document' && (
                    <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <FileText size={18} /> Document Details
                        </h4>
                        <div>
                            <MediaPicker
                                category="document"
                                label="Upload Document/PDF or Select from Library"
                                currentUrl={node.data?.content || ''}
                                onSelect={(result) => onUpdate(node.id, { data: { ...node.data, content: result.url } })}
                            />
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Or enter External URL</label>
                                <input
                                    type="text"
                                    value={node.data?.content || ''}
                                    onChange={(e) => onUpdate(node.id, { data: { ...node.data, content: e.target.value } })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    placeholder="e.g. https://example.com/document.pdf"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {contentType === 'quiz' && (
                    <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <ClipboardList size={18} /> Quiz Details
                        </h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Content URL or Embed Link</label>
                            <input
                                type="text"
                                value={node.data?.content || ''}
                                onChange={(e) => onUpdate(node.id, { data: { ...node.data, content: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="e.g. Google Forms URL or quiz resource ID"
                            />
                        </div>
                        <p className="text-xs text-gray-500">
                            Link to an external quiz or enter a resource identifier. Full quiz builder will be available in a future update.
                        </p>
                    </div>
                )}

                {contentType === 'assignment' && (
                    <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <BookOpen size={18} /> Assignment Details
                        </h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Resource URL</label>
                            <input
                                type="text"
                                value={node.data?.content || ''}
                                onChange={(e) => onUpdate(node.id, { data: { ...node.data, content: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="e.g. Link to assignment instructions or resource"
                            />
                        </div>
                        <p className="text-xs text-gray-500">
                            Provide an assignment instructions URL. Submissions handling will be available in a future update.
                        </p>
                    </div>
                )}

                {/* Description Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Description</label>
                    <textarea
                        value={node.data?.description || ''}
                        onChange={(e) => onUpdate(node.id, { data: { ...node.data, description: e.target.value } })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                        placeholder="Describe what students will learn in this lesson..."
                    />
                </div>

                {/* Duration Field */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                        <Clock size={14} /> Duration (in minutes)
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={node.data?.duration ? Math.round(node.data.duration / 60) : ''}
                        onChange={(e) => {
                            const minutes = parseInt(e.target.value) || 0;
                            onUpdate(node.id, { data: { ...node.data, duration: minutes * 60 } });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="e.g. 15"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        {node.data?.duration ? `${Math.round(node.data.duration / 60)} minutes (${node.data.duration} seconds)` : 'Not set'}
                    </p>
                </div>

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

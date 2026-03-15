import React, { useState } from 'react';
import { Menu, Plus, Edit2, Trash2, ChevronDown, ChevronUp, Folder, File, Link2, Upload, Video, FileText, ClipboardList, BookOpen, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Inline file uploader used inside the curriculum panel
function InlineUploader({ category, onUploadComplete, currentUrl }) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const acceptMap = {
        image: 'image/jpeg,image/png,image/gif,image/webp',
        video: 'video/mp4,video/webm,video/ogg',
        document: '.pdf,.doc,.docx,.ppt,.pptx,.txt',
    };

    const handleFile = (file) => {
        if (!file) return;
        setError(null);
        setUploading(true);
        setProgress(0);

        const formData = new FormData();
        formData.append('file', file);
        const token = localStorage.getItem('token');

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_BASE_URL}/uploads/${category}`);
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
            setUploading(false);
            if (xhr.status >= 200 && xhr.status < 300) {
                const res = JSON.parse(xhr.responseText);
                setProgress(100);
                onUploadComplete(res.data?.url || res.data?.key || '');
            } else {
                try { setError(JSON.parse(xhr.responseText).message); } catch { setError('Upload failed'); }
            }
        };
        xhr.onerror = () => { setUploading(false); setError('Upload failed'); };
        xhr.send(formData);
    };

    if (currentUrl) {
        return (
            <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                <span className="truncate flex-1 text-green-800">{currentUrl}</span>
                <button onClick={() => onUploadComplete('')} className="p-1 hover:bg-green-100 rounded text-green-600">
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        );
    }

    return (
        <div>
            <div
                onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = acceptMap[category] || '*';
                    input.onchange = (e) => handleFile(e.target.files?.[0]);
                    input.click();
                }}
                onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files?.[0]); }}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all text-sm ${dragActive ? 'border-primary-400 bg-primary-50' : uploading ? 'border-gray-200 bg-gray-50' : 'border-gray-300 hover:border-primary-300 hover:bg-gray-50'
                    }`}
            >
                {uploading ? (
                    <div className="text-center w-full">
                        <Loader2 className="mx-auto h-6 w-6 text-primary-500 animate-spin mb-1" />
                        <p className="text-xs text-gray-600">Uploading... {progress}%</p>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-primary-600 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <Upload className="mx-auto h-6 w-6 text-gray-400 mb-1" />
                        <p className="text-xs text-gray-500"><span className="text-primary-600 font-medium">Click to upload</span> or drag & drop</p>
                    </div>
                )}
            </div>
            {error && (
                <div className="mt-1 flex items-center gap-1 text-xs text-red-600">
                    <AlertCircle className="w-3 h-3" /> {error}
                </div>
            )}
        </div>
    );
}

// Content type configuration
const CONTENT_TYPES = {
    video: { label: 'Video', icon: Video, color: 'purple', uploadCategory: 'video', placeholder: 'https://youtube.com/watch?v=... or video URL' },
    document: { label: 'Document / PDF', icon: FileText, color: 'orange', uploadCategory: 'document', placeholder: 'https://example.com/document.pdf' },
    quiz: { label: 'Quiz', icon: ClipboardList, color: 'green', uploadCategory: null, placeholder: 'https://forms.google.com/... or quiz URL' },
    assignment: { label: 'Assignment', icon: BookOpen, color: 'blue', uploadCategory: 'document', placeholder: 'https://example.com/assignment-instructions' },
};

// Recursive Section/Lesson Component
const CurriculumNode = ({
    node,
    nodeIndex,
    parentId,
    level,
    updateNode,
    deleteNode,
    addNode,
    moveNode,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    dragOverItem,
    openDropdown,
    toggleDropdown,
    expandedLesson,
    toggleLesson,
    maxLevel = 5
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const isSection = node.type === 'folder' || node.type === 'section';
    const hasChildren = node.children && node.children.length > 0;
    const canAddChildren = level < maxLevel;
    const isLessonExpanded = expandedLesson === node.id;

    const indentStyle = {
        marginLeft: `${level * 48}px`
    };

    const contentType = node.data?.type || 'video';
    const typeConfig = CONTENT_TYPES[contentType] || CONTENT_TYPES.video;
    const TypeIcon = typeConfig.icon;

    const contentOptions = Object.entries(CONTENT_TYPES).map(([key, cfg]) => ({
        key,
        label: cfg.label,
        icon: cfg.icon,
        action: () => updateNode(node.id, { data: { ...node.data, type: key } }),
    }));

    const currentTypeLabel = CONTENT_TYPES[node.data?.type]?.label || 'Contents';

    // Input mode for the content panel: 'url' or 'upload'
    const [inputMode, setInputMode] = useState('url');

    return (
        <div className={`transition-all ${dragOverItem?.item.id === node.id && dragOverItem.parentId === parentId
            ? 'ring-2 ring-primary-400 ring-opacity-50'
            : ''
            }`}>
            {/* Node Row */}
            <div
                style={indentStyle}
                draggable
                onDragStart={(e) => onDragStart(e, node, parentId)}
                onDragOver={(e) => onDragOver(e, node, parentId)}
                onDrop={(e) => onDrop(e, node, parentId)}
                onDragEnd={onDragEnd}
                className={`flex justify-between items-center px-6 py-${isSection ? '6' : '3'} ${isSection ? 'bg-gray-50' : 'bg-white'
                    } cursor-move`}
            >
                <div className="flex items-center gap-3 flex-1">
                    <Menu className={`w-5 h-5 ${isSection ? 'text-gray-900' : 'text-gray-500'} cursor-grab active:cursor-grabbing`} />

                    {isSection && (
                        <div className="flex items-center gap-2">
                            {level === 0 ? (
                                <span className="font-medium text-base text-gray-900">
                                    Sections {String(nodeIndex + 1).padStart(2, '0')}:
                                </span>
                            ) : (
                                <Folder className="w-4 h-4 text-gray-600" />
                            )}
                        </div>
                    )}

                    {!isSection && (
                        <File className="w-4 h-4 text-gray-500" />
                    )}

                    <input
                        type="text"
                        value={node.title || (isSection ? 'Section name' : 'Lecture name')}
                        onChange={(e) => updateNode(node.id, { title: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                        className={`font-normal ${isSection ? 'text-base' : 'text-sm'} text-gray-900 bg-transparent border-none outline-none focus:ring-0 flex-1`}
                        placeholder={isSection ? 'Section name' : 'Lecture name'}
                    />

                    {/* Show content indicator for lessons with content */}
                    {!isSection && node.data?.content && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            has content
                        </span>
                    )}
                </div>

                <div className={`flex items-center gap-${isSection ? '4' : '3'}`}>
                    {/* Expand/Collapse for sections with children */}
                    {isSection && hasChildren && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        >
                            {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-500" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                        </button>
                    )}

                    {/* Add buttons for sections */}
                    {isSection && canAddChildren && (
                        <>
                            <button
                                onClick={() => {
                                    addNode(node.id, 'folder');
                                    setIsExpanded(true);
                                }}
                                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                title="Add Subsection"
                            >
                                <Folder className="w-5 h-5 text-gray-500" />
                            </button>
                            <button
                                onClick={() => {
                                    addNode(node.id, 'file');
                                    setIsExpanded(true);
                                }}
                                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                                title="Add Lecture"
                            >
                                <Plus className="w-6 h-6 text-gray-500" />
                            </button>
                        </>
                    )}

                    {/* Contents dropdown for lessons */}
                    {!isSection && (
                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown(node.id)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-primary-50 text-primary-600 font-semibold rounded-lg text-sm hover:bg-primary-100 transition-colors"
                            >
                                <TypeIcon className="w-4 h-4" />
                                <span>{currentTypeLabel}</span>
                                {openDropdown === node.id ? (
                                    <ChevronUp className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                            </button>
                            {openDropdown === node.id && (
                                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-100 rounded-lg shadow-lg z-10">
                                    {contentOptions.map((option) => {
                                        const Icon = option.icon;
                                        return (
                                            <button
                                                key={option.key}
                                                className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${node.data?.type === option.key
                                                        ? 'text-primary-600 font-medium bg-primary-50'
                                                        : 'text-gray-700'
                                                    }`}
                                                onClick={() => {
                                                    option.action();
                                                    toggleDropdown(null);
                                                    // Auto-expand content panel when selecting a type
                                                    if (!isLessonExpanded) toggleLesson(node.id);
                                                }}
                                            >
                                                <Icon className="w-4 h-4" />
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Edit button - toggles content panel for lessons */}
                    <button
                        className={`p-1.5 rounded transition-colors ${isLessonExpanded ? 'bg-primary-100 text-primary-600' : 'hover:bg-gray-100'
                            }`}
                        title={isSection ? 'Edit Section' : 'Edit Lecture Content'}
                        onClick={() => {
                            if (!isSection) toggleLesson(node.id);
                        }}
                    >
                        <Edit2 className={`w-${isSection ? '6' : '5'} h-${isSection ? '6' : '5'} ${isLessonExpanded ? 'text-primary-600' : isSection ? 'text-gray-500' : 'text-gray-900'
                            }`} />
                    </button>
                    <button
                        onClick={() => deleteNode(node.id)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title={isSection ? 'Delete Section' : 'Delete Lecture'}
                    >
                        <Trash2 className={`w-${isSection ? '6' : '5'} h-${isSection ? '6' : '5'} ${isSection ? 'text-gray-500' : 'text-red-500'}`} />
                    </button>
                </div>
            </div>

            {/* ─── Expandable Content Panel (for lessons only) ─── */}
            {!isSection && isLessonExpanded && (
                <div style={indentStyle}>
                    <div className="mx-6 mb-3 p-5 bg-white border border-gray-200 rounded-xl shadow-sm space-y-4">
                        {/* Panel Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TypeIcon className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-semibold text-gray-700">{typeConfig.label} Content</span>
                            </div>
                            <button onClick={() => toggleLesson(null)} className="p-1 hover:bg-gray-100 rounded">
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>

                        {/* Input Mode Toggle */}
                        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setInputMode('url')}
                                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${inputMode === 'url'
                                        ? 'bg-white shadow-sm text-gray-900'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Link2 className="w-4 h-4" />
                                Enter URL
                            </button>
                            {typeConfig.uploadCategory && (
                                <button
                                    onClick={() => setInputMode('upload')}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${inputMode === 'upload'
                                            ? 'bg-white shadow-sm text-gray-900'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Upload className="w-4 h-4" />
                                    Upload File
                                </button>
                            )}
                        </div>

                        {/* URL Input */}
                        {inputMode === 'url' && (
                            <div>
                                <input
                                    type="text"
                                    value={node.data?.content || ''}
                                    onChange={(e) => updateNode(node.id, { data: { ...node.data, content: e.target.value } })}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder={typeConfig.placeholder}
                                />
                                {node.data?.content && (
                                    <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" /> Content URL saved
                                    </p>
                                )}
                            </div>
                        )}

                        {/* File Upload */}
                        {inputMode === 'upload' && typeConfig.uploadCategory && (
                            <InlineUploader
                                category={typeConfig.uploadCategory}
                                currentUrl={node.data?.content || ''}
                                onUploadComplete={(url) => updateNode(node.id, { data: { ...node.data, content: url } })}
                            />
                        )}

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Description (optional)</label>
                            <textarea
                                value={node.data?.description || ''}
                                onChange={(e) => updateNode(node.id, { data: { ...node.data, description: e.target.value } })}
                                onClick={(e) => e.stopPropagation()}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 resize-none"
                                placeholder="Brief description of this lesson..."
                            />
                        </div>

                        {/* Duration + Access in a row */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Duration (minutes)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={node.data?.duration ? Math.round(node.data.duration / 60) : ''}
                                    onChange={(e) => {
                                        const mins = parseInt(e.target.value) || 0;
                                        updateNode(node.id, { data: { ...node.data, duration: mins * 60 } });
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                                    placeholder="e.g. 15"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-gray-600 mb-1">Access</label>
                                <select
                                    value={node.data?.isLocked ? 'locked' : 'free'}
                                    onChange={(e) => updateNode(node.id, { data: { ...node.data, isLocked: e.target.value === 'locked' } })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 bg-white"
                                >
                                    <option value="free">Free Preview</option>
                                    <option value="locked">Locked (Premium)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Recursive Children */}
            {isSection && hasChildren && isExpanded && (
                <div className="space-y-0">
                    {node.children.map((child, index) => (
                        <CurriculumNode
                            key={child.id}
                            node={child}
                            nodeIndex={index}
                            parentId={node.id}
                            level={level + 1}
                            updateNode={updateNode}
                            deleteNode={deleteNode}
                            addNode={addNode}
                            moveNode={moveNode}
                            onDragStart={onDragStart}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                            onDragEnd={onDragEnd}
                            dragOverItem={dragOverItem}
                            openDropdown={openDropdown}
                            toggleDropdown={toggleDropdown}
                            expandedLesson={expandedLesson}
                            toggleLesson={toggleLesson}
                            maxLevel={maxLevel}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function CourseCurriculum({
    data,
    addNode,
    updateNode,
    deleteNode,
    moveNode,
    onNext,
    onPrev
}) {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverItem, setDragOverItem] = useState(null);
    const [expandedLesson, setExpandedLesson] = useState(null);

    const toggleDropdown = (lectureId) => {
        setOpenDropdown(openDropdown === lectureId ? null : lectureId);
    };

    const toggleLesson = (lessonId) => {
        setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
    };

    // Get sections (top-level content items)
    const sections = data?.content || [];

    const handleAddSection = () => {
        addNode(null, 'folder');
    };

    // Drag handlers
    const handleDragStart = (e, item, parentId = null) => {
        setDraggedItem({ item, parentId });
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, targetItem, targetParentId = null) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverItem({ item: targetItem, parentId: targetParentId });
    };

    const handleDrop = (e, targetItem, targetParentId = null) => {
        e.preventDefault();

        if (!draggedItem || draggedItem.item.id === targetItem.id) {
            setDraggedItem(null);
            setDragOverItem(null);
            return;
        }

        // Call moveNode if provided
        if (moveNode) {
            moveNode(
                draggedItem.item.id,
                draggedItem.parentId,
                targetItem.id,
                targetParentId
            );
        }

        setDraggedItem(null);
        setDragOverItem(null);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragOverItem(null);
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white px-10 py-6 flex justify-between items-center border-b border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Course Curriculum</h2>
                <div className="flex gap-3">
                    <button className="px-6 py-3 bg-primary-50 text-primary-600 font-semibold rounded-lg text-sm hover:bg-primary-100 transition-colors">
                        Save
                    </button>
                    <button className="px-6 py-3 bg-primary-50 text-primary-600 font-semibold rounded-lg text-sm hover:bg-primary-100 transition-colors">
                        Save & Preview
                    </button>
                </div>
            </div>

            {/* Curriculum Content */}
            <div className="max-w-[1240px] mx-auto py-10 px-10">
                <div className="space-y-4">
                    {sections.map((section, sectionIndex) => (
                        <CurriculumNode
                            key={section.id}
                            node={section}
                            nodeIndex={sectionIndex}
                            parentId={null}
                            level={0}
                            updateNode={updateNode}
                            deleteNode={deleteNode}
                            addNode={addNode}
                            moveNode={moveNode}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onDragEnd={handleDragEnd}
                            dragOverItem={dragOverItem}
                            openDropdown={openDropdown}
                            toggleDropdown={toggleDropdown}
                            expandedLesson={expandedLesson}
                            toggleLesson={toggleLesson}
                            maxLevel={5}
                        />
                    ))}

                    {/* Add Sections Button */}
                    <button
                        onClick={handleAddSection}
                        className="w-full py-3 bg-primary-50 text-primary-600 font-semibold text-base rounded-lg hover:bg-primary-100 transition-colors flex items-center justify-center gap-3"
                    >
                        <Plus className="w-5 h-5" />
                        Add Sections
                    </button>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-between items-center px-10 py-10 max-w-[1240px] mx-auto mt-auto">
                <button
                    onClick={onPrev}
                    className="px-8 py-3.5 bg-white border border-gray-100 text-gray-600 font-semibold rounded-lg text-lg hover:bg-gray-50 transition-all"
                >
                    Previous
                </button>
                <button
                    onClick={onNext}
                    className="px-8 py-3.5 bg-primary-600 text-white font-semibold rounded-lg text-lg hover:bg-primary-700 transition-all"
                >
                    Save & Next
                </button>
            </div>
        </div>
    );
}

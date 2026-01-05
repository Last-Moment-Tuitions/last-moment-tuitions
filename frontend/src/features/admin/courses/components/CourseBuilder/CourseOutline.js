import React, { useState } from 'react';
import {
    Plus, Video, FileText, Settings, Trash2,
    Folder, FolderOpen, ChevronRight, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui';

// Recursive Tree Node Component
const TreeNode = ({ node, level, activeItemId, onSelect, onAddNode, onDeleteNode }) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = node.children && node.children.length > 0;
    const isFolder = node.type === 'folder';

    const handleToggle = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleSelect = (e) => {
        e.stopPropagation();
        onSelect(node.id, node.type);
    };

    const isActive = activeItemId === node.id;
    const paddingLeft = `${level * 12}px`;

    return (
        <div>
            {/* Node Row */}
            <div
                onClick={handleSelect}
                className={`group flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors text-sm border border-transparent ${isActive
                        ? 'bg-primary-50 text-primary-900 border-primary-100 font-medium'
                        : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                    }`}
                style={{ marginLeft: paddingLeft }}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    {/* Toggle Icon */}
                    {isFolder && (
                        <div
                            onClick={handleToggle}
                            className="p-0.5 rounded hover:bg-black/5 text-gray-400 cursor-pointer"
                        >
                            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </div>
                    )}

                    {/* Type Icon */}
                    {isFolder ? (
                        isOpen ? <FolderOpen size={16} className="text-blue-400 shrink-0" /> : <Folder size={16} className="text-blue-400 shrink-0" />
                    ) : (
                        node.data?.type === 'video'
                            ? <Video size={16} className="text-purple-500 shrink-0" />
                            : <FileText size={16} className="text-orange-500 shrink-0" />
                    )}

                    <span className="truncate">{node.title}</span>
                </div>

                {/* Actions (Hover) */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                    {isFolder && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); onAddNode(node.id, 'folder'); setIsOpen(true); }}
                                className="p-1 hover:bg-white rounded text-gray-500 hover:text-blue-600"
                                title="Add Folder"
                            >
                                <FolderOpen size={12} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onAddNode(node.id, 'file'); setIsOpen(true); }}
                                className="p-1 hover:bg-white rounded text-gray-500 hover:text-green-600"
                                title="Add File"
                            >
                                <Plus size={12} />
                            </button>
                        </>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); onDeleteNode(node.id); }}
                        className="p-1 hover:bg-white rounded text-gray-500 hover:text-red-600"
                        title="Delete"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            </div>

            {/* Children (Recursive) */}
            {isFolder && isOpen && node.children && (
                <div className="border-l border-gray-100 ml-4">
                    {node.children.map(child => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            level={0} // Padding handled by marginLeft now, simpler
                            activeItemId={activeItemId}
                            onSelect={onSelect}
                            onAddNode={onAddNode}
                            onDeleteNode={onDeleteNode}
                        />
                    ))}
                    {node.children.length === 0 && (
                        <div className="pl-6 py-1 text-xs text-gray-400 italic">Empty folder</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default function CourseOutline({
    course,
    activeItemId,
    onSelect,
    onAddNode,
    onDeleteNode
}) {
    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                <div>
                    <h3 className="font-bold text-gray-900 text-sm">Course Structure</h3>
                    <p className="text-xs text-gray-500">Recursive nesting enabled</p>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => onAddNode(null, 'folder')}
                        className="p-1.5 hover:bg-white border border-transparent hover:border-gray-200 rounded text-gray-600 hover:text-blue-600 transition-all shadow-sm"
                        title="Add Root Folder"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>

            {/* Tree View Action: Root Settings */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">

                <div
                    onClick={() => onSelect('settings', 'settings')}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors text-sm mb-4 ${activeItemId === 'settings'
                            ? 'bg-gray-100 text-gray-900 border border-gray-200 font-medium'
                            : 'hover:bg-gray-50 text-gray-600'
                        }`}
                >
                    <Settings size={16} />
                    <span>Course Settings</span>
                </div>

                {/* Recursive Nodes */}
                {course.content && course.content.map(node => (
                    <TreeNode
                        key={node.id}
                        node={node}
                        level={0}
                        activeItemId={activeItemId}
                        onSelect={onSelect}
                        onAddNode={onAddNode}
                        onDeleteNode={onDeleteNode}
                    />
                ))}
            </div>
        </div>
    );
}

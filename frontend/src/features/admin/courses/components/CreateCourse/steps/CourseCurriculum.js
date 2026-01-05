import React, { useState } from 'react';
import { Menu, Plus, Edit2, Trash2, ChevronDown, ChevronUp, Folder, File } from 'lucide-react';

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
    maxLevel = 5
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const isSection = node.type === 'folder' || node.type === 'section';
    const hasChildren = node.children && node.children.length > 0;
    const canAddChildren = level < maxLevel;

    const indentStyle = {
        marginLeft: `${level * 48}px`
    };

    const contentOptions = [
        'Video',
        'Attach File',
        'Captions',
        'Description',
        'Lecture Notes'
    ];

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
                </div>

                <div className="flex items-center gap-${isSection ? '4' : '3'}">
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
                                <span>Contents</span>
                                {openDropdown === node.id ? (
                                    <ChevronUp className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                            </button>
                            {openDropdown === node.id && (
                                <div className="absolute right-0 top-full mt-2 w-45 bg-white border border-gray-100 rounded-lg shadow-lg z-10">
                                    {contentOptions.map((option, idx) => (
                                        <button
                                            key={idx}
                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                                            onClick={() => {
                                                // Handle content type selection
                                                toggleDropdown(null);
                                            }}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title={isSection ? 'Edit Section' : 'Edit Lecture'}
                    >
                        <Edit2 className={`w-${isSection ? '6' : '5'} h-${isSection ? '6' : '5'} ${isSection ? 'text-gray-500' : 'text-gray-900'}`} />
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

    const toggleDropdown = (lectureId) => {
        setOpenDropdown(openDropdown === lectureId ? null : lectureId);
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

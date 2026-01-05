import { useState, useCallback } from 'react';

const INITIAL_COURSE_STATE = {
    title: '',
    description: '',
    thumbnail: '',
    trailer: '',
    tags: [],
    // Advance Information Fields
    descriptions: '',
    whatToLearn: [],
    targetAudience: [],
    requirements: [],
    subtitle: '',
    category: '',
    subCategory: '',
    level: 'beginner',
    duration: '',
    price: 0,
    content: [
        {
            id: 'root_folder_1',
            type: 'folder',
            title: 'Introduction',
            children: [
                { id: 'node_1', type: 'file', title: 'Welcome', data: { type: 'video', isLocked: false, content: '' } }
            ]
        }
    ]
};

// --- Recursive Helpers ---

const findNode = (nodes, id) => {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findNode(node.children, id);
            if (found) return found;
        }
    }
    return null;
};

const insertNode = (nodes, parentId, newNode) => {
    return nodes.map(node => {
        if (node.id === parentId) {
            return { ...node, children: [...(node.children || []), newNode] };
        }
        if (node.children) {
            return { ...node, children: insertNode(node.children, parentId, newNode) };
        }
        return node;
    });
};

const updateNodeRecursive = (nodes, id, updates) => {
    return nodes.map(node => {
        if (node.id === id) {
            // If updating 'data', merge it carefully
            if (updates.data) {
                return { ...node, ...updates, data: { ...node.data, ...updates.data } };
            }
            return { ...node, ...updates };
        }
        if (node.children) {
            return { ...node, children: updateNodeRecursive(node.children, id, updates) };
        }
        return node;
    });
};

const deleteNodeRecursive = (nodes, id) => {
    return nodes
        .filter(node => node.id !== id)
        .map(node => {
            if (node.children) {
                return { ...node, children: deleteNodeRecursive(node.children, id) };
            }
            return node;
        });
};

// --- Hook ---

export function useCourseForm(initialData = null) {
    // If initialData comes from DB, it might already be in new format or need migration.
    // For now assuming new format or simple fallback.
    const [course, setCourse] = useState(initialData || INITIAL_COURSE_STATE);

    // Active Item: { id, type }
    // type: 'settings' | 'folder' | 'file'
    const [activeItemId, setActiveItemId] = useState('settings');
    const [activeItemType, setActiveItemType] = useState('settings');

    const updateCourseInfo = (field, value) => {
        setCourse(prev => ({ ...prev, [field]: value }));
    };

    // --- Content Actions ---

    const addNode = (parentId, type) => {
        const newNode = {
            id: `node_${Date.now()}`,
            type: type, // 'folder' | 'file'
            title: type === 'folder' ? 'New Folder' : 'New Lesson',
            children: type === 'folder' ? [] : undefined,
            data: type === 'file' ? { type: 'video', isLocked: true, content: '' } : undefined
        };

        // If parentId is null, add to root content array
        if (!parentId) {
            setCourse(prev => ({
                ...prev,
                content: [...prev.content, newNode]
            }));
        } else {
            setCourse(prev => ({
                ...prev,
                content: insertNode(prev.content, parentId, newNode)
            }));
        }

        setActiveItemId(newNode.id);
        setActiveItemType(type);
    };

    const updateNode = (id, updates) => {
        setCourse(prev => ({
            ...prev,
            content: updateNodeRecursive(prev.content, id, updates)
        }));
    };

    const deleteNode = (id) => {
        setCourse(prev => ({
            ...prev,
            content: deleteNodeRecursive(prev.content, id)
        }));
        if (activeItemId === id) {
            setActiveItemId('settings');
            setActiveItemType('settings');
        }
    };


    // Move node (for drag-and-drop reordering)
    const moveNode = (draggedId, draggedParentId, targetId, targetParentId) => {
        setCourse(prev => {
            // Helper to find and reorder within same parent
            const reorderWithinParent = (nodes, parentId, draggedId, targetId) => {
                if (!parentId) {
                    // Root level - direct reorder
                    const draggedIndex = nodes.findIndex(n => n.id === draggedId);
                    const targetIndex = nodes.findIndex(n => n.id === targetId);

                    if (draggedIndex !== -1 && targetIndex !== -1) {
                        const newArray = [...nodes];
                        const [draggedItem] = newArray.splice(draggedIndex, 1);
                        // Adjust target index if dragged was before target
                        const adjustedTargetIndex = draggedIndex < targetIndex ? targetIndex : targetIndex + 1;
                        newArray.splice(adjustedTargetIndex, 0, draggedItem);
                        return newArray;
                    }
                } else {
                    // Nested level - find parent and reorder its children
                    return nodes.map(node => {
                        if (node.id === parentId && node.children) {
                            const draggedIndex = node.children.findIndex(n => n.id === draggedId);
                            const targetIndex = node.children.findIndex(n => n.id === targetId);

                            if (draggedIndex !== -1 && targetIndex !== -1) {
                                const newChildren = [...node.children];
                                const [draggedItem] = newChildren.splice(draggedIndex, 1);
                                // Adjust target index if dragged was before target
                                const adjustedTargetIndex = draggedIndex < targetIndex ? targetIndex : targetIndex + 1;
                                newChildren.splice(adjustedTargetIndex, 0, draggedItem);
                                return { ...node, children: newChildren };
                            }
                        }
                        if (node.children) {
                            return { ...node, children: reorderWithinParent(node.children, parentId, draggedId, targetId) };
                        }
                        return node;
                    });
                }
                return nodes;
            };

            // Helper to remove node from anywhere
            const removeNode = (nodes, id, parentId) => {
                if (!parentId) {
                    return nodes.filter(n => n.id !== id);
                }
                return nodes.map(node => {
                    if (node.id === parentId && node.children) {
                        return { ...node, children: node.children.filter(n => n.id !== id) };
                    }
                    if (node.children) {
                        return { ...node, children: removeNode(node.children, id, parentId) };
                    }
                    return node;
                });
            };

            // Helper to insert node at target
            const insertAtTarget = (nodes, targetId, targetParentId, nodeToInsert) => {
                if (!targetParentId) {
                    const targetIndex = nodes.findIndex(n => n.id === targetId);
                    if (targetIndex !== -1) {
                        const newArray = [...nodes];
                        newArray.splice(targetIndex + 1, 0, nodeToInsert);
                        return newArray;
                    }
                } else {
                    return nodes.map(node => {
                        if (node.id === targetParentId && node.children) {
                            const targetIndex = node.children.findIndex(n => n.id === targetId);
                            if (targetIndex !== -1) {
                                const newChildren = [...node.children];
                                newChildren.splice(targetIndex + 1, 0, nodeToInsert);
                                return { ...node, children: newChildren };
                            }
                        }
                        if (node.children) {
                            return { ...node, children: insertAtTarget(node.children, targetId, targetParentId, nodeToInsert) };
                        }
                        return node;
                    });
                }
                return nodes;
            };

            // Check if moving within same parent
            if (draggedParentId === targetParentId) {
                // Same parent - just reorder
                return {
                    ...prev,
                    content: reorderWithinParent(prev.content, draggedParentId, draggedId, targetId)
                };
            } else {
                // Different parents - remove and insert
                let newContent = [...prev.content];
                let draggedNode = null;

                // Find and extract the dragged node
                const extractNode = (nodes, id, parentId) => {
                    if (!parentId) {
                        const index = nodes.findIndex(n => n.id === id);
                        if (index !== -1) {
                            draggedNode = nodes[index];
                        }
                    } else {
                        for (const node of nodes) {
                            if (node.id === parentId && node.children) {
                                const index = node.children.findIndex(n => n.id === id);
                                if (index !== -1) {
                                    draggedNode = node.children[index];
                                    return;
                                }
                            }
                            if (node.children) {
                                extractNode(node.children, id, parentId);
                            }
                        }
                    }
                };

                extractNode(newContent, draggedId, draggedParentId);

                if (draggedNode) {
                    newContent = removeNode(newContent, draggedId, draggedParentId);
                    newContent = insertAtTarget(newContent, targetId, targetParentId, draggedNode);
                }

                return {
                    ...prev,
                    content: newContent
                };
            }
        });
    };


    const selectItem = (id, type) => {
        setActiveItemId(id);
        setActiveItemType(type);
    };

    const getActiveData = () => {
        if (activeItemType === 'settings') return course;
        return findNode(course.content, activeItemId);
    };

    return {
        course,
        activeItemId,
        activeItemType,
        updateCourseInfo,
        addNode,
        updateNode,
        deleteNode,
        moveNode,
        selectItem,
        getActiveData
    };
}

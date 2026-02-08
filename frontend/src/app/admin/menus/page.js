'use client';
import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Label, Badge } from '@/components/ui';
import menuService from '@/services/menuService';
import adminService from '@/services/adminService';
import { Plus, Trash2, Edit2, Save, MoveUp, MoveDown, ChevronRight, ChevronDown, CheckCircle, Circle } from 'lucide-react';

export default function MenusAdminPage() {
    const [menus, setMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pages, setPages] = useState([]); // Available pages for selector

    // Edit State
    const [editingPath, setEditingPath] = useState(null);
    const [editForm, setEditForm] = useState({ label: '', href: '', type: 'link' });
    const [activating, setActivating] = useState(false);
    const [renaming, setRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState('');

    // Form State for new item (Restored)
    const [newItem, setNewItem] = useState({ label: '', href: '', type: 'link', items: [] });
    const [activeParentPath, setActiveParentPath] = useState(null);

    useEffect(() => {
        fetchMenus();
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const res = await adminService.getPages({ limit: 100, status: 'all' });
            // Robustly handle both { data: [...] } and [...] response formats
            const pagesData = res?.data || res;
            setPages(Array.isArray(pagesData) ? pagesData : []);
        } catch (error) {
            console.error("Failed to fetch pages", error);
        }
    }

    const fetchMenus = async () => {
        try {
            setLoading(true);
            const data = await menuService.getAll();
            setMenus(data);
            
            // Refresh selected menu logic
            if (selectedMenu) {
                const refreshed = data.find(m => m._id === selectedMenu._id);
                if (refreshed) setSelectedMenu(refreshed);
                else setSelectedMenu(null); // Menu might have been deleted
            } else if (data.length > 0) {
                 const active = data.find(m => m.isActive);
                 setSelectedMenu(active || data[0]);
            } else {
                setSelectedMenu(null);
            }
        } catch (error) {
            console.error('Failed to fetch menus', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMenu = async () => {
        const name = prompt("Enter menu name (e.g., 'primary'):", "primary");
        if (!name) return;
        try {
            const newMenu = await menuService.create({ name, items: [] });
            setMenus([...menus, newMenu]);
            setSelectedMenu(newMenu);
        } catch (error) {
            alert('Failed to create menu: ' + error.message);
        }
    };

    const handleDeleteMenu = async () => {
        if (!selectedMenu) return;
        if (!confirm(`Are you sure you want to delete menu "${selectedMenu.name}"? This cannot be undone.`)) return;
        
        try {
            await menuService.delete(selectedMenu._id);
            alert('Menu deleted.');
            setSelectedMenu(null); // Clear selection first
            await fetchMenus(); // Then refresh
        } catch (error) {
            alert('Failed to delete menu: ' + error.message);
        }
    };

    const handleRenameMenu = async () => {
        if (!renameValue) return;
        try {
            await menuService.update(selectedMenu._id, { name: renameValue });
            setRenaming(false);
            await fetchMenus();
        } catch (error) {
            alert('Failed to rename menu: ' + error.message);
        }
    };

    const handleSaveMenu = async () => {
        if (!selectedMenu) return;
        try {
            setSaving(true);
            await menuService.update(selectedMenu._id, { items: selectedMenu.items });
            alert('Menu saved successfully!');
            await fetchMenus(); 
        } catch (error) {
            alert('Failed to save menu: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleActivateMenu = async (menu) => {
        if (!confirm(`Are you sure you want to set "${menu.name}" as the ACTIVE public menu?`)) return;
        try {
             setActivating(true);
             await menuService.activate(menu._id);
             await fetchMenus(); 
             alert(`Menu "${menu.name}" is now active.`);
        } catch (error) {
            alert('Failed to activate menu: ' + error.message);
        } finally {
            setActivating(false);
        }
    };

    const handleDeactivateMenu = async (menu) => {
         if (!confirm(`Are you sure you want to DEACTIVATE "${menu.name}"? The site will revert to default navigation.`)) return;
         try {
             await menuService.update(menu._id, { isActive: false });
             await fetchMenus();
             alert(`Menu "${menu.name}" deactivated.`);
         } catch (error) {
             alert('Failed to deactivate: ' + error.message);
         }
    };

    const startRename = () => {
        setRenameValue(selectedMenu.name);
        setRenaming(true);
    };

    const handlePageSelection = (e, isEdit = false) => {
        const pageId = e.target.value;
        if (!pageId) return;
        const page = pages.find(p => p._id === pageId);
        if (page) {
            const update = {
                label: page.title,
                href: `/${page.slug}`
            };
            if (isEdit) {
                setEditForm({ ...editForm, ...update });
            } else {
                setNewItem({ ...newItem, ...update });
            }
        }
    };
    
    // ... item handlers (startEdit, cancelEdit, saveEdit, updateItemInPath, addItem...) stay mostly same
    const startEdit = (item, path) => {
        setEditingPath(path);
        setEditForm({ label: item.label, href: item.href, type: item.type });
    };

    const cancelEdit = () => {
        setEditingPath(null);
        setEditForm({ label: '', href: '', type: 'link' });
    };

    const saveEdit = (path) => {
        const updatedMenu = { ...selectedMenu };
        updateItemInPath(updatedMenu.items, path, editForm);
        setSelectedMenu(updatedMenu);
        cancelEdit();
    };

    const updateItemInPath = (items, path, changes) => {
         const [currentIndex, ...rest] = path;
         if (rest.length === 0) {
             items[currentIndex] = { ...items[currentIndex], ...changes };
         } else if (items[currentIndex] && items[currentIndex].items) {
             updateItemInPath(items[currentIndex].items, rest, changes);
         }
    };

    const addItem = () => {
        if (!newItem.label) return alert("Label is required");
        const itemToAdd = { ...newItem, type: newItem.type };
        const updatedMenu = { ...selectedMenu };
        if (!activeParentPath) {
            updatedMenu.items.push(itemToAdd);
        } else {
           addItemToPath(updatedMenu.items, activeParentPath, itemToAdd);
        }
        setSelectedMenu(updatedMenu);
        setNewItem({ label: '', href: '', type: 'link', items: [] });
        setActiveParentPath(null);
    };
    
    // Helper to add item to nested structure
    const addItemToPath = (items, path, item) => {
        const [currentIndex, ...rest] = path;
        if (items[currentIndex]) {
            if (!items[currentIndex].items) items[currentIndex].items = [];
            if (rest.length === 0) {
                 items[currentIndex].items.push(item);
            } else {
                 addItemToPath(items[currentIndex].items, rest, item);
            }
        }
    };

    const deleteItem = (path) => {
         const updatedMenu = { ...selectedMenu };
         deleteItemFromPath(updatedMenu.items, path);
         setSelectedMenu(updatedMenu);
    };

    const deleteItemFromPath = (items, path) => {
         const [currentIndex, ...rest] = path;
         if (rest.length === 0) {
             items.splice(currentIndex, 1);
         } else if (items[currentIndex] && items[currentIndex].items) {
             deleteItemFromPath(items[currentIndex].items, rest);
         }
    };

    const moveItem = (path, direction) => {
        const updatedMenu = { ...selectedMenu };
        moveItemInPath(updatedMenu.items, path, direction);
        setSelectedMenu(updatedMenu);
    };

    const moveItemInPath = (items, path, direction) => {
         const [currentIndex, ...rest] = path;
         if (rest.length === 0) {
             const newIndex = currentIndex + direction;
             if (newIndex >= 0 && newIndex < items.length) {
                 const temp = items[currentIndex];
                 items[currentIndex] = items[newIndex];
                 items[newIndex] = temp;
             }
         } else if (items[currentIndex] && items[currentIndex].items) {
             moveItemInPath(items[currentIndex].items, rest, direction);
         }
    };

    // Recursive Renderer
    const renderItems = (items, path = []) => {
        return (
            <div className="space-y-3 pl-4 border-l-2 border-gray-100/80 ml-2">
                {items.map((item, idx) => {
                    const currentPath = [...path, idx];
                    const isDropdown = item.type === 'dropdown';
                    const isEditing = JSON.stringify(editingPath) === JSON.stringify(currentPath);

                    if (isEditing) {
                        return (
                             <div key={idx} className="bg-primary-50/50 border border-primary-200 rounded-xl p-4 space-y-4 shadow-sm relative">
                                <div className="absolute top-0 right-0 p-2 opacity-10 bg-primary-500 rounded-bl-2xl">
                                    <Edit2 size={32} />
                                </div>
                                <h4 className="font-bold text-primary-800 text-sm uppercase tracking-wide">Editing Item</h4>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div className="col-span-2">
                                        <Label>Quick Fill</Label>
                                         <select 
                                            className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                            onChange={(e) => handlePageSelection(e, true)}
                                            defaultValue=""
                                        >
                                            <option value="">
                                                 {pages.length === 0 ? '-- No pages found --' : '-- Select a Page to Auto-fill --'}
                                            </option>
                                            {pages.map(p => <option key={p._id} value={p._id}>{p.title} (/{p.slug})</option>)}
                                        </select>
                                     </div>
                                     <div>
                                        <Label>Label</Label>
                                        <Input value={editForm.label} onChange={e => setEditForm({...editForm, label: e.target.value})} className="h-10" />
                                     </div>
                                     <div>
                                        <Label>Href</Label>
                                        <Input value={editForm.href} onChange={e => setEditForm({...editForm, href: e.target.value})} className="h-10" />
                                     </div>
                                     <div className="col-span-2 flex justify-end gap-3 pt-2">
                                          <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                                          <Button size="sm" onClick={() => saveEdit(currentPath)}>Update Item</Button>
                                     </div>
                                 </div>
                             </div>
                        );
                    }
                    
                    return (
                        <div key={idx} className="group bg-white border border-gray-100 rounded-xl p-3 hover:shadow-md hover:border-primary-100 transition-all duration-200">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <Badge variant={isDropdown ? 'accent' : 'neutral'} size="sm" className={isDropdown ? "px-2" : "px-2 bg-gray-50 text-gray-500 border-gray-200 font-normal"}>
                                        {isDropdown ? <ChevronDown size={14} className="mr-1"/> : <span className="mr-1 text-xs">🔗</span>}
                                        {item.type}
                                    </Badge>
                                    <span className="font-bold text-gray-800 truncate">{item.label}</span>
                                    {!isDropdown && <span className="text-sm text-gray-400 font-mono truncate hidden sm:inline-block bg-gray-50 px-2 py-0.5 rounded">{item.href}</span>}
                                </div>
                                
                                <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex bg-gray-50 rounded-lg p-1 border border-gray-100">
                                        <button onClick={() => startEdit(item, currentPath)} className="p-1.5 hover:bg-white hover:text-primary-600 rounded-md text-gray-500 transition-all" title="Edit"><Edit2 size={14} /></button>
                                        <div className="w-px bg-gray-200 mx-0.5 my-1"></div>
                                        <button onClick={() => moveItem(currentPath, -1)} className="p-1.5 hover:bg-white hover:text-gray-900 rounded-md text-gray-400 transition-all" title="Move Up"><MoveUp size={14} /></button>
                                        <button onClick={() => moveItem(currentPath, 1)} className="p-1.5 hover:bg-white hover:text-gray-900 rounded-md text-gray-400 transition-all" title="Move Down"><MoveDown size={14} /></button>
                                    </div>
                                    <button onClick={() => deleteItem(currentPath)} className="ml-2 p-2 hover:bg-red-50 text-red-400 hover:text-red-500 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Delete"><Trash2 size={15} /></button>
                                    
                                    {isDropdown && (
                                        <Button 
                                            size="sm" 
                                            variant="secondary" 
                                            onClick={() => {
                                                setNewItem({ label: '', href: '', type: 'link', items: [] });
                                                setActiveParentPath(currentPath);
                                            }}
                                            className="ml-2 py-1.5 h-auto text-xs bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100"
                                        >
                                            <Plus size={14} className="mr-1" /> Child
                                        </Button>
                                    )}
                                </div>
                            </div>

                            
                            {item.items && item.items.length > 0 && (
                                <div className="mt-3">
                                    {renderItems(item.items, currentPath)}
                                </div>
                            )}
                            
                            {activeParentPath && JSON.stringify(activeParentPath) === JSON.stringify(currentPath) && (
                                <div className="mt-3 ml-4 p-4 bg-gray-50/80 rounded-xl border border-dashed border-primary-300 relative animate-in fade-in zoom-in-95 duration-200">
                                    <div className="text-xs font-bold mb-3 text-primary-600 flex items-center gap-2 uppercase tracking-wider">
                                        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                                        Adding Item to: {item.label}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                                         <div className="col-span-12 mb-2">
                                            <Label>Quick Select</Label>
                                            <select 
                                                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500/20 outline-none"
                                                onChange={handlePageSelection}
                                                defaultValue=""
                                            >
                                                <option value="">-- Helper: Select Page --</option>
                                                {pages.map(p => <option key={p._id} value={p._id}>{p.title} (/ {p.slug})</option>)}
                                            </select>
                                        </div>
                                        <div className="md:col-span-5">
                                            <Input 
                                                placeholder="Label" 
                                                value={newItem.label} 
                                                onChange={e => setNewItem({...newItem, label: e.target.value})}
                                                className="h-10"
                                            />
                                        </div>
                                        <div className="md:col-span-4">
                                            <Input 
                                                placeholder="Link" 
                                                value={newItem.href} 
                                                onChange={e => setNewItem({...newItem, href: e.target.value})}
                                                className="h-10"
                                            />
                                        </div>
                                        <div className="md:col-span-3 flex gap-2">
                                            <Button size="sm" onClick={addItem} className="flex-1">Add</Button>
                                            <Button size="sm" variant="ghost" onClick={() => setActiveParentPath(null)}>Cancel</Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Menu Management</h1>
                <Button onClick={handleCreateMenu} icon={<Plus size={18} />}>Create Menu</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar List */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="text-center py-10 text-gray-400">Loading menus...</div>
                    ) : menus.map(menu => (
                        <div 
                            key={menu._id}
                            onClick={() => setSelectedMenu(menu)}
                            className={`
                                group flex flex-col gap-1 p-4 rounded-xl cursor-pointer border transition-all duration-200
                                ${selectedMenu?._id === menu._id 
                                    ? 'bg-primary-50 border-primary-200 shadow-sm ring-1 ring-primary-100' 
                                    : 'bg-white border-gray-100 hover:border-primary-100 hover:shadow-md hover:-translate-y-0.5'
                                }
                            `}
                        >
                             <div className="flex justify-between items-center">
                                <span className={`font-bold ${selectedMenu?._id === menu._id ? 'text-primary-900' : 'text-gray-700'}`}>
                                    {menu.name}
                                </span>
                                {menu.isActive && (
                                    <Badge variant="success" size="sm" className="shadow-none">Active</Badge>
                                )}
                             </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>{menu.items?.length || 0} items</span>
                                <ChevronRight className={`w-4 h-4 transition-transform ${selectedMenu?._id === menu._id ? 'text-primary-400' : 'text-gray-300 group-hover:text-primary-300'}`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Editor Area */}
                <div className="lg:col-span-3">
                    {selectedMenu ? (
                        <Card>
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                                <div className="space-y-1">
                                    {renaming ? (
                                        <div className="flex items-center gap-2">
                                            <Input 
                                                value={renameValue} 
                                                onChange={e => setRenameValue(e.target.value)} 
                                                className="h-9 w-64 font-bold" 
                                                autoFocus
                                            />
                                            <Button size="sm" onClick={handleRenameMenu}>Save</Button>
                                            <Button size="sm" variant="ghost" onClick={() => setRenaming(false)}>Cancel</Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 group">
                                            <h2 className="text-2xl font-bold text-gray-900">{selectedMenu.name}</h2>
                                            <button 
                                                onClick={startRename} 
                                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-primary-600"
                                                title="Rename Menu"
                                            >
                                                <Edit2 size={14}/>
                                            </button>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center gap-3">
                                        {selectedMenu.isActive ? (
                                            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium border border-green-100">
                                                <CheckCircle size={12}/> 
                                                <span>Live on Site</span>
                                                <button 
                                                    onClick={() => handleDeactivateMenu(selectedMenu)}
                                                    className="ml-2 hover:underline text-red-600 font-semibold"
                                                >
                                                    Deactivate
                                                </button>
                                            </div>
                                        ) : (
                                            <Button 
                                                size="sm" 
                                                variant="secondary" 
                                                className="h-7 text-xs bg-gray-100 hover:bg-green-50 hover:text-green-700 hover:border-green-200 border border-transparent"
                                                onClick={() => handleActivateMenu(selectedMenu)}
                                            >
                                                Set as Active
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button 
                                        onClick={handleDeleteMenu} 
                                        variant="ghost" 
                                        className="text-red-500 hover:bg-red-50 hover:text-red-600" 
                                        icon={<Trash2 size={16} />}
                                    >
                                        Delete
                                    </Button>
                                    <Button 
                                        onClick={handleSaveMenu} 
                                        disabled={saving} 
                                        className="shadow-lg shadow-primary-500/20"
                                        icon={<Save size={18} />}
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </div>
                            </div>

                            {/* Root Add Form (active if no specific parent focused) */}
                            {!activeParentPath && (
                                <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 mb-6">
                                    <h3 className="font-bold text-sm mb-3 text-gray-600">Add Top-Level Item</h3>
                                    
                                     {/* Page Selector */}
                                     <div className="mb-4">
                                        <Label>Quick Add from Pages:</Label>
                                         <select 
                                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
                                            onChange={handlePageSelection}
                                            defaultValue=""
                                        >
                                            <option value="">-- Select a Page to Auto-fill --</option>
                                            {pages.map(p => <option key={p._id} value={p._id}>{p.title} (/{p.slug})</option>)}
                                        </select>
                                     </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <div className="md:col-span-4">
                                            <Label className="text-gray-600">Label</Label>
                                            <Input 
                                                value={newItem.label} 
                                                onChange={e => setNewItem({...newItem, label: e.target.value})} 
                                                placeholder="e.g. Home"
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <Label className="text-gray-600">Type</Label>
                                            <div className="relative">
                                                <select 
                                                    className="appearance-none flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-base transition-all hover:border-primary-300 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                                    value={newItem.type}
                                                    onChange={e => setNewItem({...newItem, type: e.target.value})}
                                                >
                                                    <option value="link">Link</option>
                                                    <option value="dropdown">Dropdown</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none w-4 h-4" />
                                            </div>
                                        </div>
                                        <div className="md:col-span-3">
                                            <Label className="text-gray-600">Href</Label>
                                            <Input 
                                                disabled={newItem.type === 'dropdown'}
                                                value={newItem.href} 
                                                onChange={e => setNewItem({...newItem, href: e.target.value})} 
                                                placeholder={newItem.type === 'dropdown' ? '-' : '/path'}
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex items-end">
                                            <Button className="w-full h-12" onClick={addItem} icon={<Plus size={18} />}>Add</Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tree View */}
                            <div className="space-y-4">
                                {selectedMenu.items && selectedMenu.items.length === 0 && (
                                    <div className="text-center py-10 text-gray-400 italic">No items yet. Add one above.</div>
                                )}
                                {renderItems(selectedMenu.items || [])}
                            </div>
                        </Card>
                    ) : (
                        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
                            Select a menu to edit
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

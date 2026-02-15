"use client";
import { useState, useEffect } from 'react';
import { testimonialService } from '@/services/testimonialService';
import { Plus, Edit, Trash2, Star, Save, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function TestimonialAdmin() {

    const [testimonials, setTestimonials] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        rating: 5,
        message: '',
        target_pages: []
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await testimonialService.getByPage('all');

            const actualData = Array.isArray(response)
                ? response
                : (response?.details || [{}]);

            setTestimonials(actualData);
        } catch (error) {
            console.error("Load Error:", error);
            setError(error.message || "Failed to load testimonials");
            toast.error(error.message || "Failed to load testimonials");
            setTestimonials([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading(editingId ? "Updating..." : "Adding...");

        try {
            if (editingId) {
                await testimonialService.update(editingId, formData);
                toast.success("Updated successfully!", { id: toastId });
            } else {
                await testimonialService.create(formData);
                toast.success("Added successfully!", { id: toastId });
            }
            closeModal();
            loadData();
        } catch (error) {
            toast.error(error.message || "Operation failed", { id: toastId });
        }
    };

    // --- Delete Functionality ---
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;

        const toastId = toast.loading("Deleting...");
        try {
            await testimonialService.delete(id);
            toast.success("Deleted", { id: toastId });
            loadData();
        } catch (error) {
            toast.error(error.message, { id: toastId });
        }
    };

    // --- Helper Functions ---
    const openEditModal = (t) => {
        setEditingId(t._id);
        setFormData({
            name: t.name,
            image: t.image || '',
            rating: t.rating,
            message: t.message,
            target_pages: Array.isArray(t.target_pages) ? t.target_pages : []
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', image: '', rating: 5, message: '', target_pages: [] });
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Manage Testimonials</h1>
                    <p className="text-slate-500 text-sm">Update student reviews and page assignments.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#072354] hover:bg-[#0a3175] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg active:scale-95"
                >
                    <Plus size={18} /> Add Testimonial
                </button>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Rating</th>
                            <th className="px-6 py-4">Message</th>
                            <th className="px-6 py-4">Target Pages</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="py-12 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="animate-spin text-slate-400" />
                                        <span className="text-slate-400 text-sm">Loading data...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="5" className="py-12 text-center text-red-500 font-medium bg-red-50">
                                    <div className="flex flex-col items-center gap-2">
                                        <span>Error: {error}</span>
                                        <button onClick={loadData} className="text-sm underline text-red-700">Retry</button>
                                    </div>
                                </td>
                            </tr>
                        ) : testimonials.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-12 text-center text-slate-400 font-medium">
                                    No testimonials found in database.
                                </td>
                            </tr>
                        ) : (
                            testimonials.map((t) => (
                                <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold border border-slate-100 overflow-hidden">
                                            {t.image && t.image.startsWith('http') ? (
                                                <img src={t.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span>{t.name ? t.name.charAt(0) : '?'}</span>
                                            )}
                                        </div>
                                        <span className="font-semibold text-slate-700">{t.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-amber-400">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < t.rating ? "currentColor" : "none"} className={i < t.rating ? "" : "text-slate-200"} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 max-w-xs truncate text-sm">{t.message}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {(t.target_pages || []).map((tag, idx) => (
                                                <span key={`${t._id}-${idx}`} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] rounded-full font-bold uppercase">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openEditModal(t)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(t._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-800">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Student Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Image URL (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="https://example.com/photo.jpg"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Rating</label>
                                <div className="flex gap-2 mt-1">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: num })}
                                            className={`p-1 transition-all hover:scale-110 ${formData.rating >= num ? 'text-amber-400' : 'text-slate-200'}`}
                                        >
                                            <Star size={28} fill={formData.rating >= num ? "currentColor" : "none"} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Message</label>
                                <textarea
                                    required
                                    rows="3"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Target Pages (Comma separated)</label>
                                <input
                                    type="text"
                                    placeholder="Homepage, Course-Details"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={formData.target_pages.join(', ')}
                                    onChange={(e) => setFormData({ ...formData, target_pages: e.target.value.split(',').map(s => s.trim()).filter(s => s !== "") })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shadow-indigo-200">
                                    <Save size={18} /> {editingId ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
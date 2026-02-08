"use client";
import { useState, useEffect } from 'react';
import { testimonialService } from '@/services/testimonialService';
import { Plus, Edit, Trash2, Star, Save, X } from 'lucide-react';

export default function TestimonialAdmin() {
    const [testimonials, setTestimonials] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', image: '', rating: 5, message: '', target_pages: []
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        const data = await testimonialService.getByPage('all'); // Backend should handle 'all'
        setTestimonials(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingId) {
            await testimonialService.update(editingId, formData);
        } else {
            await testimonialService.create(formData);
        }
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ name: '', image: '', rating: 5, message: '', target_pages: [] });
        loadData();
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure? This will also clear the Redis cache.")) {
            await testimonialService.delete(id);
            loadData();
        }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Manage Testimonials</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    variant="primary"
                    className="bg-[#072354] hover:bg-[#072354] shadow-lg shadow-primary-500/20 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md"
                >
                    <Plus size={18} /> Add Testimonial
                </button>
            </div>

            {/* Testimonial Grid/Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-900 text-slate-200 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Rating</th>
                            <th className="px-6 py-4">Message</th>
                            <th className="px-6 py-4">Target Pages</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {testimonials.map((t) => (
                            <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <img src={t.image || '/default-avatar.png'} className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300" />
                                    <span className="font-medium text-slate-700">{t.name}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex text-amber-400">
                                        {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{t.message}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {t.target_pages.map(tag => (
                                            <span key={tag} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] rounded-full font-bold uppercase">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => { setEditingId(t._id); setFormData(t); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(t._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL (Add/Edit) */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Student Name */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Student Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Image URL (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="https://example.com/photo.jpg"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>

                            {/* Star Rating Input */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Rating</label>
                                <div className="flex gap-2 mt-1">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: num })}
                                            className={`p-1 transition-colors ${formData.rating >= num ? 'text-amber-400' : 'text-slate-300'}`}
                                        >
                                            <Star size={24} fill={formData.rating >= num ? "currentColor" : "none"} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Message</label>
                                <textarea
                                    required
                                    rows="3"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            {/* Target Pages */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Target Pages (Comma separated)</label>
                                <input
                                    type="text"
                                    placeholder="Homepage, Sem 4 Comps"
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                                    value={formData.target_pages.join(', ')}
                                    onChange={(e) => setFormData({ ...formData, target_pages: e.target.value.split(',').map(s => s.trim()) })}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold hover:bg-indigo-700 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                                >
                                    <Save size={18} /> Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
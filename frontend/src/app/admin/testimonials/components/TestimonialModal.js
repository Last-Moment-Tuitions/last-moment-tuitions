'use client';
import { useState, useEffect } from 'react';
import { X, Star, Upload } from 'lucide-react';

export default function TestimonialModal({ isOpen, onClose, onSave, initialData }) {
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        tags: [],
        rating: 5,
        message: ''
    });

    // Mock Course List for Multi-select
    const courseOptions = ["Homepage", "Next.js Mastery", "React Basics", "Node.js Advanced", "Figma Design"];

    useEffect(() => {
        if (initialData) setFormData(initialData);
        else setFormData({ name: '', image: '', tags: [], rating: 5, message: '' });
    }, [initialData, isOpen]);

    const toggleTag = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold">{initialData ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Image Upload Placeholder */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Student Image (URL or Upload)</label>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                                <Upload size={16} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Paste image URL"
                                className="flex-1 px-3 py-2 border rounded-lg text-sm"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Multi-Select Dropdown (Simplified as Pill Selection) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Display On (Multiple Selection)</label>
                        <div className="flex flex-wrap gap-2">
                            {courseOptions.map(course => (
                                <button
                                    key={course}
                                    onClick={() => toggleTag(course)}
                                    className={`px-3 py-1 text-xs rounded-full border transition-all ${formData.tags.includes(course)
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-400'
                                        }`}
                                >
                                    {course}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Star Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={24}
                                    className={`cursor-pointer transition-colors ${star <= formData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                            rows="4"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        ></textarea>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-all">Cancel</button>
                    <button
                        onClick={() => onSave(formData)}
                        className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
                    >
                        Save Testimonial
                    </button>
                </div>
            </div>
        </div>
    );
}
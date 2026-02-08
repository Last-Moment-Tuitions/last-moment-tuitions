'use client';
import { Edit, Trash2, Star } from 'lucide-react';

export default function TestimonialTable({ data, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 border-b uppercase text-[11px] font-bold tracking-wider">
                    <tr>
                        <th className="px-6 py-4">Student</th>
                        <th className="px-6 py-4">Message</th>
                        <th className="px-6 py-4">Target Pages</th>
                        <th className="px-6 py-4">Rating</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-200" />
                                    <span className="font-semibold text-gray-800">{item.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <p className="text-sm text-gray-600 line-clamp-1 italic">"{item.message}"</p>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-1">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded uppercase font-bold">{tag}</span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-0.5 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < item.rating ? "fill-current" : "text-gray-200"} />
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => onEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit size={18} /></button>
                                    <button onClick={() => onDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
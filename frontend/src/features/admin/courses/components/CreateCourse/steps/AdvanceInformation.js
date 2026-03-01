import React, { useState } from 'react';
import { Upload, Plus, PlayCircle, Image as ImageIcon, Bold, Italic, Underline, Strikethrough, Link, List, ListOrdered, X, AlertCircle } from 'lucide-react';

// Red dot indicator for mandatory fields
function RequiredDot() {
    return <span className="text-red-500 ml-1">*</span>;
}

function FieldError({ message }) {
    if (!message) return null;
    return (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle size={12} />
            {message}
        </p>
    );
}

export default function AdvanceInformation({ data, updateData, onNext, onPrev, onSave, saving }) {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Handlers for dynamic lists
    const handleListChange = (field, index, value) => {
        const newList = [...(data[field] || [])];
        newList[index] = value;
        updateData(field, newList);
    };

    const addListItem = (field) => {
        const newList = [...(data[field] || []), ''];
        updateData(field, newList);
    };

    const removeListItem = (field, index) => {
        const newList = [...(data[field] || [])];
        newList.splice(index, 1);
        updateData(field, newList);
    };

    const validateAll = () => {
        const newErrors = {};
        if (!data.descriptions?.trim()) newErrors.descriptions = 'Course description is required';
        if (!data.thumbnail?.trim()) newErrors.thumbnail = 'Course thumbnail is required';
        setErrors(newErrors);
        setTouched({ descriptions: true, thumbnail: true });
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateAll()) {
            onNext();
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    return (
        <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 min-h-[600px] relative">

            {/* Header */}
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Advance Information</h2>
                <div className="flex gap-3">
                    <button
                        onClick={onSave}
                        disabled={saving}
                        className="px-6 py-2.5 bg-primary-50 text-primary-600 font-semibold rounded-lg text-sm hover:bg-primary-100 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            <div className="space-y-10 max-w-5xl mx-auto">

                {/* Mandatory fields note */}
                <p className="text-xs text-gray-400">Fields marked with <span className="text-red-500">*</span> are mandatory</p>

                {/* Thumbnail & Trailer Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Thumbnail */}
                    <div className="space-y-4">
                        <label className="block text-lg font-medium text-gray-900">
                            Course Thumbnail<RequiredDot />
                        </label>
                        <div className="flex gap-6 items-center">
                            <div className="w-40 h-32 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200 shrink-0 overflow-hidden relative group">
                                {data.thumbnail ? (
                                    <img src={data.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-10 h-10 text-gray-300" />
                                )}
                            </div>
                            <div className="flex-1 flex flex-col gap-3">
                                <input
                                    type="text"
                                    placeholder="Paste image URL..."
                                    value={data.thumbnail || ''}
                                    onChange={(e) => {
                                        updateData('thumbnail', e.target.value);
                                        if (errors.thumbnail) setErrors(prev => ({ ...prev, thumbnail: '' }));
                                    }}
                                    onBlur={() => handleBlur('thumbnail')}
                                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all font-medium text-gray-700 placeholder:font-normal ${errors.thumbnail && touched.thumbnail
                                            ? 'border-red-300 focus:ring-red-100 focus:border-red-500'
                                            : 'border-gray-200 focus:ring-primary-100 focus:border-primary-500'
                                        }`}
                                />

                                <div className="relative flex items-center py-1">
                                    <div className="flex-grow border-t border-gray-100"></div>
                                    <span className="flex-shrink-0 mx-3 text-gray-400 text-xs">OR</span>
                                    <div className="flex-grow border-t border-gray-100"></div>
                                </div>

                                <button className="flex items-center justify-center gap-2 w-full px-6 py-2.5 bg-primary-50 text-primary-600 font-semibold rounded-lg text-sm hover:bg-primary-100 transition-colors border border-primary-100">
                                    <Upload className="w-4 h-4" />
                                    <span>Upload File</span>
                                </button>

                                <span className="text-xs text-gray-400 font-medium pt-1">
                                    Supported formats: .jpg, .jpeg, .png (1200x800px)
                                </span>
                                <FieldError message={touched.thumbnail && errors.thumbnail} />
                            </div>
                        </div>
                    </div>

                    {/* Trailer */}
                    <div className="space-y-4">
                        <label className="block text-lg font-medium text-gray-900">Course Trailer</label>
                        <div className="flex gap-6 items-center">
                            <div className="w-40 h-32 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200 shrink-0 overflow-hidden relative group">
                                {data.trailer ? (
                                    data.trailer.includes('youtube.com') || data.trailer.includes('youtu.be') ? (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-900">
                                            <PlayCircle className="w-10 h-10 text-white/70" />
                                        </div>
                                    ) : (
                                        <video src={data.trailer} className="w-full h-full object-cover" />
                                    )
                                ) : (
                                    <PlayCircle className="w-10 h-10 text-gray-300" />
                                )}
                            </div>
                            <div className="flex-1 flex flex-col gap-3">
                                <input
                                    type="text"
                                    placeholder="Paste video URL (YouTube, Vimeo, etc.)..."
                                    value={data.trailer || ''}
                                    onChange={(e) => updateData('trailer', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium text-gray-700 placeholder:font-normal"
                                />

                                <div className="relative flex items-center py-1">
                                    <div className="flex-grow border-t border-gray-100"></div>
                                    <span className="flex-shrink-0 mx-3 text-gray-400 text-xs">OR</span>
                                    <div className="flex-grow border-t border-gray-100"></div>
                                </div>

                                <button className="flex items-center justify-center gap-2 w-full px-6 py-2.5 bg-primary-50 text-primary-600 font-semibold rounded-lg text-sm hover:bg-primary-100 transition-colors border border-primary-100">
                                    <Upload className="w-4 h-4" />
                                    <span>Upload File</span>
                                </button>

                                <span className="text-xs text-gray-400 font-medium pt-1">
                                    Supports .mp4, .mov (Max 100MB) or YouTube/Vimeo URL
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description Editor */}
                <div className="space-y-4">
                    <label className="block text-lg font-medium text-gray-900">
                        Course Description<RequiredDot />
                    </label>
                    <div className={`border rounded-xl overflow-hidden focus-within:ring-2 transition-all ${errors.descriptions && touched.descriptions
                            ? 'border-red-300 focus-within:ring-red-100'
                            : 'border-gray-200 focus-within:ring-primary-100'
                        }`}>
                        <textarea
                            className="w-full p-6 min-h-[220px] outline-none text-base text-gray-700 placeholder:text-gray-400 resize-none"
                            placeholder="Enter your course description..."
                            value={data.descriptions}
                            onChange={(e) => {
                                updateData('descriptions', e.target.value);
                                if (errors.descriptions) setErrors(prev => ({ ...prev, descriptions: '' }));
                            }}
                            onBlur={() => handleBlur('descriptions')}
                        />
                        {/* Editor Toolbar */}
                        <div className="bg-white border-t border-gray-100 p-3 flex gap-2">
                            <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Bold size={18} /></button>
                            <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Italic size={18} /></button>
                            <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Underline size={18} /></button>
                            <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Strikethrough size={18} /></button>
                            <div className="w-px h-6 bg-gray-200 mx-1 self-center"></div>
                            <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Link size={18} /></button>
                            <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><List size={18} /></button>
                            <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><ListOrdered size={18} /></button>
                        </div>
                    </div>
                    <FieldError message={touched.descriptions && errors.descriptions} />
                </div>

                <div className="border-t border-gray-100"></div>

                {/* Dynamic Lists (What to Learn, Target Audience, Requirements) */}
                {[
                    { title: "What you will teach in this course", field: 'whatToLearn', placeholder: "What you will teach in this course...", required: true },
                    { title: "Target Audience", field: 'targetAudience', placeholder: "Who this course is for...", required: false },
                    { title: "Course Requirements", field: 'requirements', placeholder: "What is your course requirements...", required: false }
                ].map((section) => (
                    <div key={section.field} className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-gray-900">
                                {section.title}
                                {section.required && <RequiredDot />}
                            </h3>
                            <button
                                onClick={() => addListItem(section.field)}
                                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add new</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {(data[section.field] && data[section.field].length > 0) ? (
                                data[section.field].map((item, index) => (
                                    <div key={index} className="relative flex items-center gap-2">
                                        <input
                                            type="text"
                                            className="flex-1 p-4 pr-16 border border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-50 transition-all shadow-sm"
                                            placeholder={section.placeholder}
                                            value={item}
                                            onChange={(e) => handleListChange(section.field, index, e.target.value)}
                                        />
                                        <span className="absolute right-14 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">
                                            {item.length}/120
                                        </span>
                                        <button
                                            onClick={() => removeListItem(section.field, index)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                            title="Remove item"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
                                    No items added yet. Click &quot;Add new&quot; to start.
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Footer Buttons */}
                <div className="flex justify-between items-center pt-10 mt-6 border-t border-gray-100">
                    <button
                        onClick={onPrev}
                        className="px-10 py-3.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl text-base hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all shadow-sm hover:shadow-md"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-10 py-3.5 bg-primary-600 text-white font-bold rounded-xl text-base hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/20 transition-all transform hover:-translate-y-0.5"
                    >
                        Save & Next
                    </button>
                </div>

            </div>
        </div>
    );
}

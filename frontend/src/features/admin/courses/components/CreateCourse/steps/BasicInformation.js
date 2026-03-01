import React, { useState } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

// Red dot indicator for mandatory fields
function RequiredDot() {
    return <span className="text-red-500 ml-1">*</span>;
}

// Validation error message
function FieldError({ message }) {
    if (!message) return null;
    return (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle size={12} />
            {message}
        </p>
    );
}

export default function BasicInformation({ data, updateData, onNext, onSave, saving }) {
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleChange = (field, value) => {
        updateData(field, value);
        // Clear error when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        validateField(field);
    };

    const validateField = (field) => {
        let error = '';
        switch (field) {
            case 'title':
                if (!data.title?.trim()) error = 'Course title is required';
                break;
            case 'category':
                if (!data.category) error = 'Please select a category';
                break;
            case 'level':
                if (!data.level) error = 'Please select a level';
                break;
        }
        setErrors(prev => ({ ...prev, [field]: error }));
        return error;
    };

    const validateAll = () => {
        const newErrors = {};
        if (!data.title?.trim()) newErrors.title = 'Course title is required';
        if (!data.category) newErrors.category = 'Please select a category';
        if (!data.level) newErrors.level = 'Please select a level';

        setErrors(newErrors);
        setTouched({ title: true, category: true, level: true });
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateAll()) {
            onNext();
        }
    };

    const getInputClass = (field) => {
        const base = 'w-full p-4 border rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 transition-all shadow-sm';
        if (errors[field] && touched[field]) {
            return `${base} border-red-300 focus:border-red-500 focus:ring-red-50`;
        }
        return `${base} border-gray-200 focus:border-primary-600 focus:ring-primary-50`;
    };

    return (
        <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 min-h-[600px] relative">

            {/* Header */}
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Basic Information</h2>
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

            <div className="space-y-8 max-w-5xl mx-auto">

                {/* Mandatory fields note */}
                <p className="text-xs text-gray-400">Fields marked with <span className="text-red-500">*</span> are mandatory</p>

                {/* Title */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                        Title<RequiredDot />
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            className={getInputClass('title')}
                            placeholder="Your course title"
                            value={data.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            onBlur={() => handleBlur('title')}
                            maxLength={80}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">
                            {data.title.length}/80
                        </span>
                    </div>
                    <FieldError message={touched.title && errors.title} />
                </div>

                {/* Subtitle */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">Subtitle</label>
                    <div className="relative">
                        <input
                            type="text"
                            className={getInputClass('subtitle')}
                            placeholder="Your course subtitle"
                            value={data.subtitle}
                            onChange={(e) => handleChange('subtitle', e.target.value)}
                            maxLength={120}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">
                            {(data.subtitle || '').length}/120
                        </span>
                    </div>
                </div>

                {/* Category & Sub-category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">
                            Course Category<RequiredDot />
                        </label>
                        <div className="relative">
                            <select
                                className={`${getInputClass('category')} pr-10 appearance-none bg-white cursor-pointer`}
                                value={data.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                onBlur={() => handleBlur('category')}
                            >
                                <option value="">Select Category...</option>
                                <option value="development">Development</option>
                                <option value="business">Business</option>
                                <option value="design">Design</option>
                                <option value="marketing">Marketing</option>
                                <option value="engineering">Engineering</option>
                                <option value="government">Government Exams</option>
                                <option value="preparation">Preparation Exams</option>
                                <option value="programming">Programming</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                        <FieldError message={touched.category && errors.category} />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">Course Sub-category</label>
                        <div className="relative">
                            <select
                                className={`${getInputClass('subCategory')} pr-10 appearance-none bg-white cursor-pointer`}
                                value={data.subCategory}
                                onChange={(e) => handleChange('subCategory', e.target.value)}
                            >
                                <option value="">Select Sub-category...</option>
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="fullstack">Full Stack</option>
                                <option value="mobile">Mobile Development</option>
                                <option value="data-science">Data Science</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Course Topic */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">Course Topic</label>
                    <input
                        type="text"
                        className={getInputClass('topic')}
                        placeholder="What is primarily taught in your course?"
                        value={data.topic || ''}
                        onChange={(e) => handleChange('topic', e.target.value)}
                    />
                </div>

                {/* Language, Subtitle Lang, Level, Duration */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">Course Language</label>
                        <div className="relative">
                            <select
                                className={`${getInputClass('language')} pr-10 appearance-none bg-white cursor-pointer`}
                                value={data.language || ''}
                                onChange={(e) => handleChange('language', e.target.value)}
                            >
                                <option value="">Select...</option>
                                <option value="english">English</option>
                                <option value="hindi">Hindi</option>
                                <option value="hinglish">Hinglish</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">Subtitle Language</label>
                        <div className="relative">
                            <select
                                className={`${getInputClass('subtitleLanguage')} pr-10 appearance-none bg-white cursor-pointer`}
                                value={data.subtitleLanguage || ''}
                                onChange={(e) => handleChange('subtitleLanguage', e.target.value)}
                            >
                                <option value="">Select...</option>
                                <option value="english">English</option>
                                <option value="hindi">Hindi</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">
                            Course Level<RequiredDot />
                        </label>
                        <div className="relative">
                            <select
                                className={`${getInputClass('level')} pr-10 appearance-none bg-white cursor-pointer`}
                                value={data.level}
                                onChange={(e) => handleChange('level', e.target.value)}
                                onBlur={() => handleBlur('level')}
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                        <FieldError message={touched.level && errors.level} />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">Duration</label>
                        <div className="flex rounded-xl shadow-sm border border-gray-200 overflow-hidden focus-within:ring-4 focus-within:ring-primary-50 focus-within:border-primary-600 transition-all">
                            <input
                                type="number"
                                className="w-full p-4 border-none text-base text-gray-900 focus:ring-0 placeholder:text-gray-400"
                                placeholder="Duration"
                                value={data.duration}
                                onChange={(e) => handleChange('duration', e.target.value)}
                            />
                            <div className="relative bg-gray-50 border-l border-gray-200 w-32 hover:bg-gray-100 transition-colors">
                                <select className="w-full h-full p-4 pr-8 text-base text-gray-700 bg-transparent appearance-none focus:outline-none cursor-pointer font-medium">
                                    <option>Hours</option>
                                    <option>Minutes</option>
                                    <option>Days</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Section */}
                <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Pricing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">
                                Price (₹)<RequiredDot />
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                <input
                                    type="number"
                                    className={`${getInputClass('price')} pl-8`}
                                    placeholder="0"
                                    value={data.price || ''}
                                    onChange={(e) => handleChange('price', Number(e.target.value))}
                                    min={0}
                                />
                            </div>
                            <p className="text-xs text-gray-400">The selling price of the course</p>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-900">Original Price (₹)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                                <input
                                    type="number"
                                    className={`${getInputClass('originalPrice')} pl-8`}
                                    placeholder="0"
                                    value={data.originalPrice || ''}
                                    onChange={(e) => handleChange('originalPrice', Number(e.target.value))}
                                    min={0}
                                />
                            </div>
                            <p className="text-xs text-gray-400">Show as crossed-out MRP (for discount display)</p>
                        </div>
                    </div>
                    {data.originalPrice > 0 && data.price > 0 && data.originalPrice > data.price && (
                        <div className="mt-3 flex items-center gap-2">
                            <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                {Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100)}% discount
                            </span>
                        </div>
                    )}
                </div>

                {/* Tags Section */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">Tags</label>
                    <TagsInput
                        tags={data.tags || []}
                        onChange={(tags) => handleChange('tags', tags)}
                    />
                    <p className="text-xs text-gray-400">Press Enter or comma to add a tag</p>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-10 mt-6 border-t border-gray-100">
                    <button className="px-10 py-3.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl text-base hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all shadow-sm hover:shadow-md">
                        Cancel
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

// Tags input component
function TagsInput({ tags, onChange }) {
    const [input, setInput] = useState('');

    const addTag = (tag) => {
        const trimmed = tag.trim();
        if (trimmed && !tags.includes(trimmed)) {
            onChange([...tags, trimmed]);
        }
        setInput('');
    };

    const removeTag = (index) => {
        onChange(tags.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(input);
        }
        if (e.key === 'Backspace' && !input && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2 p-3 border border-gray-200 rounded-xl focus-within:ring-4 focus-within:ring-primary-50 focus-within:border-primary-600 transition-all min-h-[52px] bg-white">
            {tags.map((tag, i) => (
                <span
                    key={i}
                    className="flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg text-sm font-medium"
                >
                    {tag}
                    <button
                        onClick={() => removeTag(i)}
                        className="ml-1 text-primary-400 hover:text-primary-700 font-bold"
                    >
                        ×
                    </button>
                </span>
            ))}
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => input && addTag(input)}
                placeholder={tags.length === 0 ? "Type a tag and press Enter..." : ""}
                className="flex-1 min-w-[120px] outline-none text-sm text-gray-700 placeholder:text-gray-400 py-1"
            />
        </div>
    );
}

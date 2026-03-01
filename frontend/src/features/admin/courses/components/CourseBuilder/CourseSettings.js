import React, { useState } from 'react';
import { ChevronDown, Plus, X, Search, Image as ImageIcon, PlayCircle } from 'lucide-react';
import MediaPicker from '@/components/ui/MediaPicker';

// Red dot indicator for mandatory fields
function RequiredDot() {
    return <span className="text-red-500 ml-1">*</span>;
}

// Shared input styles
const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-50 transition-all';
const selectClass = `${inputClass} appearance-none bg-white cursor-pointer pr-10`;
const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';

export default function CourseSettings({ course, updateInfo }) {
    const [tagInput, setTagInput] = useState('');
    const [instructorSearch, setInstructorSearch] = useState('');

    // Mock instructor search results (replace with API call later)
    const mockInstructors = [
        { id: '1', name: 'John Doe', role: 'UI/UX Designer', avatar: '' },
        { id: '2', name: 'Jane Smith', role: 'Frontend Developer', avatar: '' },
        { id: '3', name: 'Mike Johnson', role: 'Backend Developer', avatar: '' },
    ];

    const filteredInstructors = instructorSearch
        ? mockInstructors.filter(i =>
            i.name.toLowerCase().includes(instructorSearch.toLowerCase())
        )
        : [];

    const handleSelectInstructor = (instructor) => {
        updateInfo('instructor', {
            name: instructor.name,
            role: instructor.role,
            image: instructor.avatar || '',
            bio: '',
        });
        setInstructorSearch('');
    };

    const addTag = (tag) => {
        const trimmed = tag.trim();
        if (trimmed && !(course.tags || []).includes(trimmed)) {
            updateInfo('tags', [...(course.tags || []), trimmed]);
        }
        setTagInput('');
    };

    const removeTag = (index) => {
        updateInfo('tags', (course.tags || []).filter((_, i) => i !== index));
    };

    const handleTagKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(tagInput);
        }
        if (e.key === 'Backspace' && !tagInput && (course.tags || []).length > 0) {
            removeTag((course.tags || []).length - 1);
        }
    };

    // Dynamic list helpers
    const handleListChange = (field, index, value) => {
        const newList = [...(course[field] || [])];
        newList[index] = value;
        updateInfo(field, newList);
    };

    const addListItem = (field) => {
        updateInfo(field, [...(course[field] || []), '']);
    };

    const removeListItem = (field, index) => {
        const newList = [...(course[field] || [])];
        newList.splice(index, 1);
        updateInfo(field, newList);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Course Settings</h2>
                <p className="text-sm text-gray-500">Global settings for this course.</p>
                <p className="text-xs text-gray-400 mt-2">Fields marked with <span className="text-red-500">*</span> are mandatory</p>
            </div>

            <div className="space-y-6">

                {/* Title */}
                <div>
                    <label className={labelClass}>Course Title<RequiredDot /></label>
                    <input
                        type="text"
                        value={course.title || ''}
                        onChange={(e) => updateInfo('title', e.target.value)}
                        className={inputClass}
                        placeholder="e.g. Full Stack Web Development"
                        maxLength={80}
                    />
                </div>

                {/* Subtitle */}
                <div>
                    <label className={labelClass}>Subtitle</label>
                    <input
                        type="text"
                        value={course.subtitle || ''}
                        onChange={(e) => updateInfo('subtitle', e.target.value)}
                        className={inputClass}
                        placeholder="A brief subtitle for the course"
                        maxLength={120}
                    />
                </div>

                {/* Category & Sub-category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Category<RequiredDot /></label>
                        <div className="relative">
                            <select
                                value={course.category || ''}
                                onChange={(e) => updateInfo('category', e.target.value)}
                                className={selectClass}
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
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Sub-category</label>
                        <div className="relative">
                            <select
                                value={course.subCategory || ''}
                                onChange={(e) => updateInfo('subCategory', e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Select Sub-category...</option>
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                                <option value="fullstack">Full Stack</option>
                                <option value="mobile">Mobile Development</option>
                                <option value="data-science">Data Science</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Topic */}
                <div>
                    <label className={labelClass}>Course Topic</label>
                    <input
                        type="text"
                        value={course.topic || ''}
                        onChange={(e) => updateInfo('topic', e.target.value)}
                        className={inputClass}
                        placeholder="What is primarily taught in your course?"
                    />
                </div>

                {/* Level, Language, Duration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className={labelClass}>Difficulty Level<RequiredDot /></label>
                        <div className="relative">
                            <select
                                value={course.level || 'beginner'}
                                onChange={(e) => updateInfo('level', e.target.value)}
                                className={selectClass}
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Language</label>
                        <div className="relative">
                            <select
                                value={course.language || ''}
                                onChange={(e) => updateInfo('language', e.target.value)}
                                className={selectClass}
                            >
                                <option value="">Select...</option>
                                <option value="english">English</option>
                                <option value="hindi">Hindi</option>
                                <option value="hinglish">Hinglish</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Duration</label>
                        <input
                            type="text"
                            value={course.duration || ''}
                            onChange={(e) => updateInfo('duration', e.target.value)}
                            className={inputClass}
                            placeholder="e.g. 30 hours"
                        />
                    </div>
                </div>

                {/* Pricing */}
                <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Pricing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Price (₹)<RequiredDot /></label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                                <input
                                    type="number"
                                    value={course.price || ''}
                                    onChange={(e) => updateInfo('price', Number(e.target.value))}
                                    className={`${inputClass} pl-8`}
                                    placeholder="0"
                                    min={0}
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Original Price (₹)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">₹</span>
                                <input
                                    type="number"
                                    value={course.originalPrice || ''}
                                    onChange={(e) => updateInfo('originalPrice', Number(e.target.value))}
                                    className={`${inputClass} pl-8`}
                                    placeholder="0"
                                    min={0}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Shows as MRP (strikethrough) for discount display</p>
                        </div>
                    </div>
                    {course.originalPrice > 0 && course.price > 0 && course.originalPrice > course.price && (
                        <div className="mt-3">
                            <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% discount
                            </span>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="border-t border-gray-100 pt-6">
                    <label className={labelClass}>Course Description<RequiredDot /></label>
                    <textarea
                        value={course.descriptions || course.description || ''}
                        onChange={(e) => updateInfo('descriptions', e.target.value)}
                        rows={5}
                        className={`${inputClass} resize-none min-h-[120px]`}
                        placeholder="Describe what students will learn in this course..."
                    />
                </div>

                {/* Thumbnail & Trailer */}
                <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Media</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Thumbnail */}
                        <div>
                            <MediaPicker
                                category="image"
                                label={<span>Course Thumbnail<RequiredDot /></span>}
                                currentUrl={course.thumbnail || ''}
                                onSelect={(result) => updateInfo('thumbnail', result.url)}
                            />
                            <p className="text-xs text-gray-400 mt-2">.jpg, .jpeg, .png (1200×800px)</p>
                        </div>

                        {/* Trailer */}
                        <div>
                            <MediaPicker
                                category="video"
                                label="Course Trailer"
                                currentUrl={course.trailer || ''}
                                onSelect={(result) => updateInfo('trailer', result.url)}
                            />
                            <p className="text-xs text-gray-400 mt-2">.mp4, .mov or YouTube/Vimeo URL</p>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div className="border-t border-gray-100 pt-6">
                    <label className={labelClass}>Tags</label>
                    <div className="flex flex-wrap items-center gap-2 p-3 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-primary-50 focus-within:border-primary-500 transition-all min-h-[48px] bg-white">
                        {(course.tags || []).map((tag, i) => (
                            <span key={i} className="flex items-center gap-1 bg-primary-50 text-primary-700 px-3 py-1 rounded-lg text-sm font-medium">
                                {tag}
                                <button onClick={() => removeTag(i)} className="ml-1 text-primary-400 hover:text-primary-700 font-bold">×</button>
                            </span>
                        ))}
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyDown}
                            onBlur={() => tagInput && addTag(tagInput)}
                            placeholder={(course.tags || []).length === 0 ? "Type a tag and press Enter..." : ""}
                            className="flex-1 min-w-[120px] outline-none text-sm text-gray-700 placeholder:text-gray-400 py-1"
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Press Enter or comma to add a tag</p>
                </div>

                {/* Dynamic Lists: What to Learn, Target Audience, Requirements */}
                {[
                    { title: 'What you will teach', field: 'whatToLearn', placeholder: 'Add a learning objective...' },
                    { title: 'Target Audience', field: 'targetAudience', placeholder: 'Who is this course for...' },
                    { title: 'Requirements', field: 'requirements', placeholder: 'What do students need...' },
                ].map((section) => (
                    <div key={section.field} className="border-t border-gray-100 pt-6">
                        <div className="flex items-center justify-between mb-3">
                            <label className={labelClass}>{section.title}</label>
                            <button
                                onClick={() => addListItem(section.field)}
                                className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                            >
                                <Plus size={14} /> Add
                            </button>
                        </div>
                        <div className="space-y-2">
                            {(course[section.field] || []).length > 0 ? (
                                (course[section.field] || []).map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => handleListChange(section.field, index, e.target.value)}
                                            className={`${inputClass} flex-1`}
                                            placeholder={section.placeholder}
                                        />
                                        <button
                                            onClick={() => removeListItem(section.field, index)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 py-3 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    No items added yet. Click "Add" to start.
                                </p>
                            )}
                        </div>
                    </div>
                ))}

                {/* Instructor */}
                <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-base font-bold text-gray-900 mb-4">
                        Add Instructor ({course.instructor?.name ? '01' : '00'})
                    </h3>

                    {/* Search */}
                    <div className="relative mb-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={instructorSearch}
                                onChange={(e) => setInstructorSearch(e.target.value)}
                                placeholder="Search by username"
                                className={`${inputClass} pl-12`}
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        {filteredInstructors.length > 0 && (
                            <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                                {filteredInstructors.map(instructor => (
                                    <button
                                        key={instructor.id}
                                        onClick={() => handleSelectInstructor(instructor)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                            <span className="text-primary-600 font-semibold">{instructor.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{instructor.name}</p>
                                            <p className="text-sm text-gray-500">{instructor.role}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Selected Instructor Card */}
                    {course.instructor?.name && (
                        <div className="flex items-center gap-3 bg-gray-50 pl-4 pr-3 py-3 rounded-xl border border-gray-100 mb-4">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                                {course.instructor.image ? (
                                    <img src={course.instructor.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-primary-600 font-semibold">{course.instructor.name.charAt(0)}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-gray-900 text-sm">{course.instructor.name}</p>
                                {course.instructor.role && <p className="text-xs text-gray-500">{course.instructor.role}</p>}
                            </div>
                            <button
                                onClick={() => updateInfo('instructor', null)}
                                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    )}

                    {/* Manual Instructor Details */}
                    <div className="space-y-4 mt-4">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Or enter manually</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Name<RequiredDot /></label>
                                <input
                                    type="text"
                                    value={course.instructor?.name || ''}
                                    onChange={(e) => updateInfo('instructor', { ...(course.instructor || {}), name: e.target.value })}
                                    className={inputClass}
                                    placeholder="Instructor name"
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Role / Title</label>
                                <input
                                    type="text"
                                    value={course.instructor?.role || ''}
                                    onChange={(e) => updateInfo('instructor', { ...(course.instructor || {}), role: e.target.value })}
                                    className={inputClass}
                                    placeholder="e.g. Senior Developer"
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Avatar URL</label>
                            <input
                                type="text"
                                value={course.instructor?.image || ''}
                                onChange={(e) => updateInfo('instructor', { ...(course.instructor || {}), image: e.target.value })}
                                className={inputClass}
                                placeholder="Paste avatar image URL..."
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Bio</label>
                            <textarea
                                value={course.instructor?.bio || ''}
                                onChange={(e) => updateInfo('instructor', { ...(course.instructor || {}), bio: e.target.value })}
                                rows={3}
                                className={`${inputClass} resize-none`}
                                placeholder="Brief bio about the instructor..."
                            />
                        </div>
                    </div>
                </div>

                {/* Welcome & Congratulations Messages */}
                <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-base font-bold text-gray-900 mb-4">Messages</h3>
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Welcome Message</label>
                            <textarea
                                value={course.welcomeMessage || ''}
                                onChange={(e) => updateInfo('welcomeMessage', e.target.value)}
                                rows={2}
                                className={`${inputClass} resize-none`}
                                placeholder="Message students see when they enroll..."
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Congratulations Message</label>
                            <textarea
                                value={course.congratulationsMessage || ''}
                                onChange={(e) => updateInfo('congratulationsMessage', e.target.value)}
                                rows={2}
                                className={`${inputClass} resize-none`}
                                placeholder="Message students see when they complete the course..."
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function BasicInformation({ data, updateData, onNext }) {

    const handleChange = (field, value) => {
        updateData(field, value);
    };

    return (
        <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100 min-h-[600px] relative">

            {/* Header Area inside the form */}
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Basic Information</h2>
                <div className="flex gap-3">
                    <button className="px-6 py-2.5 bg-primary-50 text-primary-600 font-semibold rounded-lg text-sm hover:bg-primary-100 transition-all shadow-sm hover:shadow-md">
                        Save
                    </button>
                    <button className="px-6 py-2.5 text-primary-600 font-semibold text-sm hover:bg-gray-50 rounded-lg transition-colors">
                        Save & Preview
                    </button>
                </div>
            </div>

            <div className="space-y-8 max-w-5xl mx-auto">

                {/* Title */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">Title</label>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full p-4 border border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-50 transition-all shadow-sm"
                            placeholder="Your course title"
                            value={data.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            maxLength={80}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">
                            {data.title.length}/80
                        </span>
                    </div>
                </div>

                {/* Subtitle */}
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">Subtitle</label>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full p-4 border border-gray-200 rounded-xl text-base text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-50 transition-all shadow-sm"
                            placeholder="Your course subtitle"
                            value={data.subtitle}
                            onChange={(e) => handleChange('subtitle', e.target.value)}
                            maxLength={120}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500">
                            {data.subtitle.length}/120
                        </span>
                    </div>
                </div>

                {/* Category & Sub-category Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">Course Category</label>
                        <div className="relative">
                            <select
                                className="w-full p-4 pr-10 border border-gray-200 rounded-xl text-base text-gray-900 appearance-none focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-50 bg-white transition-all shadow-sm cursor-pointer"
                                value={data.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                            >
                                <option value="">Select Category...</option>
                                <option value="development">Development</option>
                                <option value="business">Business</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">Course Sub-category</label>
                        <div className="relative">
                            <select
                                className="w-full p-4 pr-10 border border-gray-200 rounded-xl text-base text-gray-900 appearance-none focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-50 bg-white transition-all shadow-sm cursor-pointer"
                                value={data.subCategory}
                                onChange={(e) => handleChange('subCategory', e.target.value)}
                            >
                                <option value="">Select Sub-category...</option>
                                <option value="frontend">Frontend</option>
                                <option value="backend">Backend</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Dropdowns Row (Level, Duration) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-900">Course Level</label>
                        <div className="relative">
                            <select
                                className="w-full p-4 pr-10 border border-gray-200 rounded-xl text-base text-gray-900 appearance-none focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-50 bg-white transition-all shadow-sm cursor-pointer"
                                value={data.level}
                                onChange={(e) => handleChange('level', e.target.value)}
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
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
                                    <option>Minutes</option>
                                    <option>Hours</option>
                                    <option>Days</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-between items-center pt-10 mt-6 border-t border-gray-100">
                    <button className="px-10 py-3.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl text-base hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all shadow-sm hover:shadow-md">
                        Cancel
                    </button>
                    <button
                        onClick={onNext}
                        className="px-10 py-3.5 bg-primary-600 text-white font-bold rounded-xl text-base hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/20 transition-all transform hover:-translate-y-0.5"
                    >
                        Save & Next
                    </button>
                </div>
            </div>
        </div>
    );
}

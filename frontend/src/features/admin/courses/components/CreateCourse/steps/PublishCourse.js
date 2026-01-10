import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function PublishCourse({ data, updateData, onNext, onPrev, onSave, onPublish, saving }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedInstructors, setSelectedInstructors] = useState(data.instructors || []);

    // Mock instructor search results
    const mockInstructors = [
        { id: '1', name: 'John Doe', role: 'UI/UX Designer', avatar: '' },
        { id: '2', name: 'Jane Smith', role: 'Frontend Developer', avatar: '' },
        { id: '3', name: 'Mike Johnson', role: 'Backend Developer', avatar: '' },
    ];

    const handleAddInstructor = (instructor) => {
        if (!selectedInstructors.find(i => i.id === instructor.id)) {
            const updated = [...selectedInstructors, instructor];
            setSelectedInstructors(updated);
            updateData('instructors', updated);
        }
        setSearchQuery('');
    };

    const handleRemoveInstructor = (instructorId) => {
        const updated = selectedInstructors.filter(i => i.id !== instructorId);
        setSelectedInstructors(updated);
        updateData('instructors', updated);
    };

    const filteredInstructors = searchQuery
        ? mockInstructors.filter(i =>
            i.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !selectedInstructors.find(si => si.id === i.id)
        )
        : [];

    return (
        <div className="bg-white rounded-2xl min-h-[600px] relative">

            {/* Header */}
            <div className="flex justify-between items-center px-10 py-6 border-b border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Publish Course</h2>
                <div className="flex gap-3">
                    <button
                        onClick={onSave}
                        disabled={saving}
                        className="px-6 py-3 bg-primary-50 text-primary-600 font-semibold rounded-lg text-sm hover:bg-primary-100 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        onClick={onSave}
                        disabled={saving}
                        className="px-6 py-3 text-primary-600 font-semibold text-sm hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save & Preview
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="px-10 py-8 space-y-8">

                {/* Message Section */}
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Message</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-gray-100">
                        {/* Welcome Message */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Welcome Message
                            </label>
                            <textarea
                                value={data.welcomeMessage || ''}
                                onChange={(e) => updateData('welcomeMessage', e.target.value)}
                                rows={6}
                                placeholder="Enter your welcome message here..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none text-gray-700"
                            />
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <span className="text-xl">😊</span>
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <span className="text-xl">©</span>
                                </button>
                            </div>
                        </div>

                        {/* Congratulations Message */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Congratulations Message
                            </label>
                            <textarea
                                value={data.congratulationsMessage || ''}
                                onChange={(e) => updateData('congratulationsMessage', e.target.value)}
                                rows={6}
                                placeholder="Enter your congratulations message here..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none text-gray-700"
                            />
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <span className="text-xl">😊</span>
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <span className="text-xl">©</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Instructor Section */}
                <div className="space-y-4 pb-8">
                    <h3 className="text-xl font-semibold text-gray-900">
                        Add Instructor ({selectedInstructors.length > 0 ? `0${selectedInstructors.length}` : '01'})
                    </h3>

                    {/* Search */}
                    <div className="relative">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by username"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Search Results Dropdown */}
                        {filteredInstructors.length > 0 && (
                            <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto">
                                {filteredInstructors.map(instructor => (
                                    <button
                                        key={instructor.id}
                                        onClick={() => handleAddInstructor(instructor)}
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

                    {/* Selected Instructors */}
                    {selectedInstructors.length > 0 && (
                        <div className="flex flex-wrap gap-3 mt-4">
                            {selectedInstructors.map(instructor => (
                                <div
                                    key={instructor.id}
                                    className="flex items-center gap-3 bg-gray-50 pl-4 pr-3 py-2 rounded-xl border border-gray-100"
                                >
                                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                        <span className="text-primary-600 font-semibold text-sm">{instructor.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 text-sm">{instructor.name}</p>
                                        <p className="text-xs text-gray-500">{instructor.role}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveInstructor(instructor.id)}
                                        className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                                    >
                                        <X className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-10 py-6 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
                <button
                    onClick={onPrev}
                    disabled={saving}
                    className="px-6 py-3 text-gray-700 font-semibold text-sm hover:bg-white rounded-lg transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Prev Step
                </button>
                <button
                    onClick={onPublish}
                    disabled={saving}
                    className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg text-sm hover:bg-primary-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? 'Publishing...' : 'Submit For Review'}
                </button>
            </div>

        </div>
    );
}

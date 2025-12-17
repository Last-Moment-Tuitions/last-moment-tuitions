import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '@/components/Layout';
import { Button, Badge } from '@/components/ui';
import {
    Clock,
    Monitor,
    Database,
    Network,
    Cpu,
    BookOpen,
    Server,
    Shield,
    FileText,
    CheckCircle
} from 'lucide-react';

export default function IBPSSOPage() {
    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Government Exams', href: '/government' },
        { label: 'IBPS SO IT' }
    ];

    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['overview', 'highlights', 'dates', 'pattern', 'syllabus', 'vacancy', 'salary', 'eligibility'];
            const scrollPosition = window.scrollY + 150;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
                    setActiveSection(section);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80,
                behavior: 'smooth'
            });
            setActiveSection(id);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-8">
                    <Breadcrumb items={breadcrumbItems} />
                    <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant="accent" size="sm" className="bg-blue-50 text-blue-700 border-blue-200">
                                    Recruitment 2025
                                </Badge>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> Updated: Dec 2025
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                                IBPS SO IT Officer 2025
                            </h1>
                            <p className="text-lg text-gray-600 mt-2 max-w-3xl">
                                Complete preparation guide for Specialist Officer (IT) in Public Sector Banks.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-500/20">
                                View Course
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Content Column */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-12">

                            {/* Overview */}
                            <section id="overview" className="scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                                    About IBPS SO IT Officer
                                </h2>
                                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                                    The Institute of Banking Personnel Selection (IBPS) Specialist Officer (SO) exam is conducted annually to recruit candidates for various technical and specialized posts in Public Sector Banks. The <strong>IT Officer (Scale I)</strong> post is dedicated to managing banking technology, servers, databases, and cybersecurity.
                                </p>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Highlights */}
                            <section id="highlights" className="scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                                    Exam Highlights
                                </h2>
                                <div className="overflow-hidden border border-gray-200 rounded-xl">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            <HighlightRow label="Exam Name" value="IBPS Specialist Officer (SO) - CRP SPL" />
                                            <HighlightRow label="Post Name" value="IT Officer (Scale I)" />
                                            <HighlightRow label="Participating Banks" value="PNB, BOB, Canara Bank, Union Bank, etc." />
                                            <HighlightRow label="Selection Stages" value="Prelims, Mains, Interview" />
                                            <HighlightRow label="Mode of Exam" value="Online (CBT)" />
                                            <HighlightRow label="Official Website" value="www.ibps.in" />
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Important Dates */}
                            <section id="dates" className="scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                                    Important Dates (Tentative)
                                </h2>
                                <div className="space-y-4">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr>
                                                    <th className="p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">Event</th>
                                                    <th className="p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">Month / Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b border-gray-100">
                                                    <td className="p-4 text-gray-800">Notification Release</td>
                                                    <td className="p-4 text-gray-600">October / November 2025</td>
                                                </tr>
                                                <tr className="border-b border-gray-100">
                                                    <td className="p-4 font-semibold text-gray-900">Prelims Examination</td>
                                                    <td className="p-4 font-bold text-blue-700">December 2025</td>
                                                </tr>
                                                <tr className="border-b border-gray-100">
                                                    <td className="p-4 font-semibold text-gray-900">Mains Examination</td>
                                                    <td className="p-4 font-bold text-blue-700">January 2026</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-4 text-gray-800">Interview</td>
                                                    <td className="p-4 text-gray-600">February / March 2026</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Exam Pattern */}
                            <section id="pattern" className="scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                                    Exam Pattern
                                </h2>

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">1. Prelims (Qualifying)</h3>
                                        <p className="text-sm text-gray-600 mb-3">Marks obtained in Prelims are NOT added to the final merit list. You just need to clear the cut-off.</p>
                                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Section</th>
                                                        <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Qs</th>
                                                        <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Marks</th>
                                                        <th className="p-3 border-b border-gray-200 text-sm font-semibold text-gray-700">Duration</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm">
                                                    <tr className="border-b border-gray-100">
                                                        <td className="p-3 border-r border-gray-100">English Language</td>
                                                        <td className="p-3 border-r border-gray-100">50</td>
                                                        <td className="p-3 border-r border-gray-100">25</td>
                                                        <td className="p-3">40 Min</td>
                                                    </tr>
                                                    <tr className="border-b border-gray-100">
                                                        <td className="p-3 border-r border-gray-100">Reasoning</td>
                                                        <td className="p-3 border-r border-gray-100">50</td>
                                                        <td className="p-3 border-r border-gray-100">50</td>
                                                        <td className="p-3">40 Min</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-3 border-r border-gray-100">General Awareness</td>
                                                        <td className="p-3 border-r border-gray-100">50</td>
                                                        <td className="p-3 border-r border-gray-100">50</td>
                                                        <td className="p-3">40 Min</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">2. Mains (Professional Knowledge)</h3>
                                        <p className="text-sm text-gray-600 mb-3">Questions will be from IT subjects only. These marks count for shortlisting for Interview.</p>
                                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Subjet</th>
                                                        <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Qs</th>
                                                        <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Marks</th>
                                                        <th className="p-3 border-b border-gray-200 text-sm font-semibold text-gray-700">Duration</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm">
                                                    <tr>
                                                        <td className="p-3 border-r border-gray-100">Professional Knowledge (IT)</td>
                                                        <td className="p-3 border-r border-gray-100">60</td>
                                                        <td className="p-3 border-r border-gray-100">60</td>
                                                        <td className="p-3">45 Min</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Syllabus */}
                            <section id="syllabus" className="scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                                    IT Syllabus (Mains)
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SyllabusCard title="Database Management" icon={<Database className="w-5 h-5" />}>
                                        RDBMS, Normalization, Overview of SQL, Transaction Management, E-R Diagrams.
                                    </SyllabusCard>
                                    <SyllabusCard title="Data Comm. & Networking" icon={<Network className="w-5 h-5" />}>
                                        OSI Model, TCP/IP, IPv4/IPv6, Network Security, OSI Layers functions.
                                    </SyllabusCard>
                                    <SyllabusCard title="Operating Systems" icon={<Monitor className="w-5 h-5" />}>
                                        Memory Management, Process Scheduling, Threading, Deadlocks, Basic Linux Commands.
                                    </SyllabusCard>
                                    <SyllabusCard title="Software Engineering" icon={<FileText className="w-5 h-5" />}>
                                        SDLC Models (Waterfall, Agile), Black Box/White Box Testing, CMMI Levels.
                                    </SyllabusCard>
                                    <SyllabusCard title="Computer Org. & Arch." icon={<Cpu className="w-5 h-5" />}>
                                        Bus Structure, Memory Organization, 8085 Microprocessor basics.
                                    </SyllabusCard>
                                    <SyllabusCard title="Programming & DSA" icon={<BookOpen className="w-5 h-5" />}>
                                        C/C++, OOPs Concepts, Data Structures (Stacks, Queues, Linked Lists, Trees).
                                    </SyllabusCard>
                                </div>
                            </section>

                            {/* Eligibility */}
                            <section id="eligibility" className="scroll-mt-24 mt-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                                    Eligibility Criteria
                                </h2>
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                        <h4 className="font-bold text-gray-800 mb-2">Educational Qualification</h4>
                                        <ul className="list-disc list-inside text-gray-700 text-sm space-y-2">
                                            <li>4-year Engineering Degree in Computer Science/ IT/ ECE/ Electronics.</li>
                                            <li>OR Post Graduate Degree in Electronics/ IT/ Computer Science.</li>
                                            <li>OR Graduate having passed DOEACC 'B' level.</li>
                                        </ul>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                        <h4 className="font-bold text-gray-800 mb-2">Age Limit</h4>
                                        <p className="text-gray-700 text-sm">Minimum: 20 years | Maximum: 30 years.</p>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">

                            {/* Table of Contents */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hidden lg:block">
                                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Quick Navigate</h3>
                                <div className="space-y-1 relative">
                                    <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                                    {[
                                        { id: 'overview', label: 'Overview' },
                                        { id: 'highlights', label: 'Highlights' },
                                        { id: 'dates', label: 'Important Dates' },
                                        { id: 'pattern', label: 'Exam Pattern' },
                                        { id: 'syllabus', label: 'Syllabus' },
                                        { id: 'eligibility', label: 'Eligibility' },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            className={`
                                                relative w-full text-left pl-6 py-2 text-sm transition-colors duration-200 border-l-2
                                                ${activeSection === item.id
                                                    ? 'border-blue-600 text-blue-800 font-bold bg-blue-50/50'
                                                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                                                }
                                            `}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Card */}
                            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
                                <div className="text-center mb-4">
                                    <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold mb-2">Best Seller</div>
                                    <div className="text-3xl font-bold text-gray-900">₹6,999</div>
                                    <div className="text-gray-500 text-xs">Lifetime Validity</div>
                                </div>
                                <ul className="space-y-2 mb-6">
                                    <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500" /> 200+ Video Lessons</li>
                                    <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500" /> 10 Full Mock Tests</li>
                                    <li className="flex items-center gap-2 text-sm text-gray-700"><CheckCircle className="w-4 h-4 text-green-500" /> Syllabus Coverage</li>
                                </ul>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold mb-3">
                                    Enroll Now
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helpers
function HighlightRow({ label, value }) {
    return (
        <tr className="hover:bg-gray-50/50 transition-colors">
            <td className="w-1/3 px-4 py-3 text-sm font-medium text-gray-500 border-r border-gray-100 align-top">
                {label}
            </td>
            <td className="px-4 py-3 text-sm text-gray-900 font-semibold align-top">
                {value}
            </td>
        </tr>
    );
}

function SyllabusCard({ title, icon, children }) {
    return (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-white rounded-lg border border-gray-200 text-gray-500">
                    {icon}
                </div>
                <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed text-xs">
                {children}
            </p>
        </div>
    );
}

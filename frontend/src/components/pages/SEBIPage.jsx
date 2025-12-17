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
    FileText,
    DollarSign,
    Briefcase,
    Calendar,
    CheckCircle
} from 'lucide-react';

export default function SEBIPage() {
    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Government Exams', href: '/government' },
        { label: 'SEBI Grade A IT' }
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
                                <Badge variant="accent" size="sm" className="bg-accent-50 text-accent-700 border-accent-200">
                                    Notification 2025 Out
                                </Badge>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> Exam Date: Jan 10, 2026
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                                SEBI Grade A IT Officer 2025
                            </h1>
                            <p className="text-lg text-gray-600 mt-2 max-w-3xl">
                                Complete preparation guide for SEBI Assistant Manager (IT Stream).
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button size="lg" className="bg-primary-500 hover:bg-primary-600 text-white font-bold shadow-lg shadow-primary-500/20">
                                Enroll Now
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
                                    <div className="w-1.5 h-8 bg-primary-500 rounded-full"></div>
                                    Overview
                                </h2>
                                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                                    The Securities and Exchange Board of India (SEBI) has released the notification for the Grade A exam for the year 2025. This recruitment drive aims to fill <strong>132 vacancies</strong> across various streams, including <strong>22 dedicated vacancies for Information Technology (IT)</strong>.
                                </p>
                                <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl">
                                    <h4 className="font-semibold text-blue-800 mb-2">Why SEBI IT?</h4>
                                    <p className="text-sm text-blue-700">
                                        It is one of the most prestigious jobs for IT professionals in the government sector, offering a blend of technical challenges in the financial domain and an excellent salary package of approx. ₹1,84,000 per month.
                                    </p>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Highlights */}
                            <section id="highlights" className="scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-primary-500 rounded-full"></div>
                                    Exam Highlights
                                </h2>
                                <div className="overflow-hidden border border-gray-200 rounded-xl">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            <HighlightRow label="Exam Name" value="SEBI Grade A (Assistant Manager) 2025" />
                                            <HighlightRow label="Conducting Body" value="Securities and Exchange Board of India (SEBI)" />
                                            <HighlightRow label="Post Name" value="Assistant Manager (IT Stream)" />
                                            <HighlightRow label="Vacancies (IT)" value="22" />
                                            <HighlightRow label="Online Application" value="Oct 30, 2025 - Nov 28, 2025" />
                                            <HighlightRow label="Selection Process" value="Phase 1 (Online), Phase 2 (Online), Interview" />
                                            <HighlightRow label="Salary" value="₹1,84,000 per month (Approx.)" />
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Important Dates */}
                            <section id="dates" className="scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-primary-500 rounded-full"></div>
                                    Important Dates
                                </h2>
                                <div className="space-y-4">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr>
                                                    <th className="p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">Event</th>
                                                    <th className="p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b border-gray-100">
                                                    <td className="p-4 text-gray-800">Notification Release</td>
                                                    <td className="p-4 text-gray-600">October 2025</td>
                                                </tr>
                                                <tr className="border-b border-gray-100">
                                                    <td className="p-4 text-gray-800">Application Window</td>
                                                    <td className="p-4 text-gray-600">Oct 30 - Nov 28, 2025</td>
                                                </tr>
                                                <tr className="border-b border-gray-100 bg-accent-50/30">
                                                    <td className="p-4 font-semibold text-gray-900">Phase 1 Online Exam</td>
                                                    <td className="p-4 font-bold text-primary-700">January 10, 2026</td>
                                                </tr>
                                                <tr className="border-b border-gray-100 bg-accent-50/30">
                                                    <td className="p-4 font-semibold text-gray-900">Phase 2 Online Exam</td>
                                                    <td className="p-4 font-bold text-primary-700">February 21, 2026</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-4 text-gray-800">Phase 3 Interview</td>
                                                    <td className="p-4 text-gray-600">To be notified</td>
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
                                    <div className="w-1.5 h-8 bg-primary-500 rounded-full"></div>
                                    Exam Pattern
                                </h2>

                                <div className="space-y-8">
                                    {/* Phase 1 */}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">Phase 1: Online Examination (Screening)</h3>
                                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Paper</th>
                                                        <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Subject</th>
                                                        <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Marks</th>
                                                        <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Duration</th>
                                                        <th className="p-3 border-b border-gray-200 text-sm font-semibold text-gray-700">Cut-off</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm">
                                                    <tr className="border-b border-gray-100">
                                                        <td className="p-3 border-r border-gray-100">Paper 1</td>
                                                        <td className="p-3 border-r border-gray-100">
                                                            GA, Reasoning, English, Quant
                                                        </td>
                                                        <td className="p-3 border-r border-gray-100">100</td>
                                                        <td className="p-3 border-r border-gray-100">60 Min</td>
                                                        <td className="p-3">30%</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-3 border-r border-gray-100">Paper 2</td>
                                                        <td className="p-3 border-r border-gray-100 font-semibold">Information Technology Stream</td>
                                                        <td className="p-3 border-r border-gray-100">100</td>
                                                        <td className="p-3 border-r border-gray-100">40 Min</td>
                                                        <td className="p-3">40%</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600">
                                            <span className="font-semibold text-red-500">Note:</span> Negative marking of 1/4th marks. Aggregate cut-off of 40% is also required.
                                        </div>
                                    </div>

                                    {/* Phase 2 */}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">Phase 2: Online Examination (Merit)</h3>
                                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Paper</th>
                                                        <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Subject</th>
                                                        <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Marks</th>
                                                        <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Duration</th>
                                                        <th className="p-3 border-b border-gray-200 text-sm font-semibold text-gray-700">Weightage</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm">
                                                    <tr className="border-b border-gray-100">
                                                        <td className="p-3 border-r border-gray-100">Paper 1</td>
                                                        <td className="p-3 border-r border-gray-100">English (Descriptive)</td>
                                                        <td className="p-3 border-r border-gray-100">100</td>
                                                        <td className="p-3 border-r border-gray-100">60 Min</td>
                                                        <td className="p-3">1/3rd</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-3 border-r border-gray-100">Paper 2</td>
                                                        <td className="p-3 border-r border-gray-100 font-semibold">
                                                            Info. Tech (Coding + Objective)
                                                        </td>
                                                        <td className="p-3 border-r border-gray-100">100</td>
                                                        <td className="p-3 border-r border-gray-100">
                                                            210 Min
                                                            <div className="text-xs text-gray-500 mt-1">(30m Objective + 180m Coding)</div>
                                                        </td>
                                                        <td className="p-3">2/3rd</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Paper 2 involves Logic flow, Debugging, Syntax understanding, Program dry run, Data analysis, etc.
                                        </p>
                                    </div>

                                    {/* Phase 3 */}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">Phase 3: Interview</h3>
                                        <p className="text-gray-700">
                                            Candidates clearing Phase 2 will be called for the Interview. The final selection is based on <strong>Phase 2 Marks (85%)</strong> and <strong>Interview Marks (15%)</strong>.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Salary */}
                            <section id="salary" className="scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-primary-500 rounded-full"></div>
                                    Salary & Benefits
                                </h2>
                                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                        <div>
                                            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Gross Monthly Salary</div>
                                            <div className="text-3xl font-bold text-green-600">₹1,84,000</div>
                                            <div className="text-sm text-gray-400 font-medium">(Approximate)</div>
                                        </div>
                                        <div className="text-right hidden md:block">
                                            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pay Scale</div>
                                            <div className="text-sm text-gray-700 font-mono mt-1">₹62,500 - ₹1,26,100</div>
                                        </div>
                                    </div>

                                    <h4 className="font-bold text-gray-800 mb-3">Allowances & Perks:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        <PerkItem label="Dearness Allowance" />
                                        <PerkItem label="Family Allowance" />
                                        <PerkItem label="Local Allowance" />
                                        <PerkItem label="Special Pay" />
                                        <PerkItem label="Grade Allowance" />
                                        <PerkItem label="Learning Allowance" />
                                        <PerkItem label="Medical Expenses" />
                                        <PerkItem label="Eye Refraction" />
                                        <PerkItem label="Financial Dailies" />
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Syllabus */}
                            <section id="syllabus" className="scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-primary-500 rounded-full"></div>
                                    Syllabus
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SyllabusCard title="Database Concepts" icon={<Database className="w-5 h-5" />}>
                                        ER-model, Relational model, Normalization, SQL Queries, Transaction Management, Database Recovery.
                                    </SyllabusCard>
                                    <SyllabusCard title="Programming Concepts" icon={<Monitor className="w-5 h-5" />}>
                                        C++, Java, Python: Variables, Looping, OOPs, Functions, Arrays, Strings.
                                    </SyllabusCard>
                                    <SyllabusCard title="Data Structures & Algorithms" icon={<Cpu className="w-5 h-5" />}>
                                        Arrays, Linked Lists, Stacks, Queues, Trees (BST, AVL), Graphs, Sorting & Searching.
                                    </SyllabusCard>
                                    <SyllabusCard title="Networking" icon={<Network className="w-5 h-5" />}>
                                        OSI Model, TCP/IP, IP Addressing, Subnetting, Routing, Network Security.
                                    </SyllabusCard>
                                    <SyllabusCard title="Operating Systems" icon={<Monitor className="w-5 h-5" />}>
                                        Process Management, CPU Scheduling, Deadlocks, Memory Management, File Systems.
                                    </SyllabusCard>
                                    <SyllabusCard title="Software Engineering" icon={<FileText className="w-5 h-5" />}>
                                        SDLC, Waterfall, Agile, Testing, Software Metrics.
                                    </SyllabusCard>
                                </div>
                            </section>

                            {/* Eligibility */}
                            <section id="eligibility" className="scroll-mt-24 mt-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-primary-500 rounded-full"></div>
                                    Eligibility Criteria
                                </h2>
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <Briefcase className="w-5 h-5 text-gray-500" />
                                            Educational Qualification
                                        </h4>
                                        <ul className="space-y-3 text-gray-700">
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2"></div>
                                                <span>Bachelor’s Degree in Engineering (Any Discipline).</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2"></div>
                                                <span>Bachelor’s Degree in any discipline with Post Graduate Qualification (Minimum 2 years duration) in Computer Application / Information Technology.</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-gray-500" />
                                            Age Limit
                                        </h4>
                                        <p className="text-gray-700">
                                            A candidate must not have exceeded the age of <strong>30 years</strong> as on the cut-off date.
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            (Age relaxation applies for OBC/SC/ST/PwBD candidates as per government rules).
                                        </p>
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
                                        { id: 'salary', label: 'Salary' },
                                        { id: 'syllabus', label: 'Syllabus' },
                                        { id: 'eligibility', label: 'Eligibility' },
                                    ].map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => scrollToSection(item.id)}
                                            className={`
                                                relative w-full text-left pl-6 py-2 text-sm transition-colors duration-200 border-l-2
                                                ${activeSection === item.id
                                                    ? 'border-primary-500 text-primary-700 font-bold bg-primary-50/50'
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
                            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white shadow-lg">
                                <div className="text-center mb-6">
                                    <h3 className="font-bold text-xl mb-1">SEBI 2025 Course</h3>
                                    <p className="text-gray-400 text-xs">Specific IT Stream Batch</p>
                                </div>
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3 text-sm">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <span>Video Lessons & Notes</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <span>Coding Test Practice</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <span>Mock Tests with Analysis</span>
                                    </div>
                                </div>

                                <div className="text-center mb-6">
                                    <div className="text-3xl font-bold">₹8,999</div>
                                    <div className="text-sm text-gray-400 line-through">₹12,000</div>
                                </div>

                                <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-6">
                                    Get Started
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
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors">
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

function PerkItem({ label }) {
    return (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100 text-sm text-gray-700">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            {label}
        </div>
    );
}

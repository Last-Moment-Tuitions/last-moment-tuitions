import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../components/Layout';
import { Button, Badge, Card } from '../components/ui';
import {
    Download,
    ExternalLink,
    Calendar,
    Users,
    Award,
    BookOpen,
    TrendingUp,
    Briefcase,
    GraduationCap,
    Target,
    CheckCircle,
    ChevronRight,
    PlayCircle,
    FileText,
    Monitor
} from 'lucide-react';

export default function UPSCPage() {
    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Government Exams', href: '/government' },
        { label: 'UPSC Civil Services' }
    ];

    const [activeSection, setActiveSection] = useState('overview');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['overview', 'highlights', 'dates', 'pattern', 'syllabus', 'vacancy', 'salary', 'eligibility'];
            const scrollPosition = window.scrollY + 100;

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
                                <Badge variant="accent" size="sm" className="bg-primary-50 text-primary-700 border-primary-100">
                                    Notification Out
                                </Badge>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <Clock className="w-4 h-4" /> Updated: Dec 2025
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                                UPSC Civil Services Examination 2025
                            </h1>
                            <p className="text-lg text-gray-600 mt-2 max-w-3xl">
                                Complete guide for IAS, IPS, IFS aspirants. Syllabus, Exam Pattern, Dates, and Preparation Strategy.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-lg shadow-primary-500/30">
                                Download Syllabus
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
                                    The Union Public Service Commission (UPSC) Civil Services Examination (CSE) is widely considered one of the most prestigious and toughest competitive exams in India. It serves as a gateway to the country's premier civil services including the Indian Administrative Service (IAS), Indian Police Service (IPS), and Indian Foreign Service (IFS).
                                </p>
                                <div className="p-5 bg-primary-50 border border-primary-100 rounded-xl">
                                    <h4 className="font-semibold text-primary-800 mb-2">Why this exam?</h4>
                                    <p className="text-sm text-primary-700">
                                        Unlike other jobs, civil services offer a unique opportunity to participate directly in the governance of the country and policy implementation, impacting millions of lives.
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
                                            <HighlightRow label="Exam Name" value="Civil Services Examination (CSE)" />
                                            <HighlightRow label="Conducting Body" value="Union Public Service Commission (UPSC)" />
                                            <HighlightRow label="Exam Level" value="National" />
                                            <HighlightRow label="Frequency" value="Once a year" />
                                            <HighlightRow label="Mode of Exam" value="Offline (Pen & Paper)" />
                                            <HighlightRow label="Stages" value="Prelims, Mains, Interview" />
                                            <HighlightRow label="Language" value="Hindi & English" />
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Important Dates */}
                            <section id="dates" className="scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-primary-500 rounded-full"></div>
                                    Important Dates 2025
                                </h2>
                                <div className="space-y-4">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr>
                                                    <th className="p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">Event</th>
                                                    <th className="p-4 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">Date (Tentative)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="border-b border-gray-100">
                                                    <td className="p-4 text-gray-800">Notification Release</td>
                                                    <td className="p-4 font-medium text-primary-600">February 14, 2025</td>
                                                </tr>
                                                <tr className="border-b border-gray-100">
                                                    <td className="p-4 text-gray-800">Application Start Date</td>
                                                    <td className="p-4 text-gray-600">February 14, 2025</td>
                                                </tr>
                                                <tr className="border-b border-gray-100">
                                                    <td className="p-4 text-gray-800">Last Date to Apply</td>
                                                    <td className="p-4 text-gray-600">March 5, 2025</td>
                                                </tr>
                                                <tr className="border-b border-gray-100">
                                                    <td className="p-4 text-gray-800">Prelims Admit Card</td>
                                                    <td className="p-4 text-gray-600">May 2025</td>
                                                </tr>
                                                <tr className="bg-primary-50/30 border-b border-gray-100">
                                                    <td className="p-4 font-semibold text-gray-900">UPSC CSE Prelims Exam Date</td>
                                                    <td className="p-4 font-bold text-primary-700">May 26, 2025</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-4 text-gray-800">UPSC CSE Mains Exam Date</td>
                                                    <td className="p-4 text-gray-600">September 20, 2025</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="text-sm text-gray-500 italic mt-2">* Dates are subject to change as per official notification.</p>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Exam Pattern */}
                            <section id="pattern" className="scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-primary-500 rounded-full"></div>
                                    Exam Pattern
                                </h2>
                                <p className="text-gray-700 mb-6">
                                    The examination consists of three successive stages:
                                </p>

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">1. Preliminary Examination (Objective Type)</h3>
                                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Paper</th>
                                                        <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Subject</th>
                                                        <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Questions</th>
                                                        <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Marks</th>
                                                        <th className="p-3 border-b border-gray-200 text-sm font-semibold text-gray-700">Duration</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm">
                                                    <tr className="border-b border-gray-100">
                                                        <td className="p-3 border-r border-gray-100">Paper I</td>
                                                        <td className="p-3 border-r border-gray-100">General Studies</td>
                                                        <td className="p-3 border-r border-gray-100">100</td>
                                                        <td className="p-3 border-r border-gray-100">200</td>
                                                        <td className="p-3">2 Hours</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="p-3 border-r border-gray-100">Paper II</td>
                                                        <td className="p-3 border-r border-gray-100">CSAT (Aptitude)</td>
                                                        <td className="p-3 border-r border-gray-100">80</td>
                                                        <td className="p-3 border-r border-gray-100">200</td>
                                                        <td className="p-3">2 Hours</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-600">
                                            <span className="font-semibold text-red-500">Note:</span> Paper II is qualifying in nature (33% marks required). Negative marking of 1/3rd is applicable in both papers.
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">2. Mains Examination (Descriptive Type)</h3>
                                        <p className="text-sm text-gray-700 mb-3">Consists of 9 papers. Paper A and Paper B are qualifying. The merit is counted from Paper I to Paper VII.</p>
                                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
                                            <li><strong>Qualifying Papers:</strong> Indian Language (300 Marks), English (300 Marks)</li>
                                            <li><strong>Paper I:</strong> Essay (250 Marks)</li>
                                            <li><strong>Paper II - V:</strong> General Studies I, II, III, IV (250 Marks each)</li>
                                            <li><strong>Paper VI - VII:</strong> Optional Subjects (250 Marks each)</li>
                                        </ul>
                                        <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200 inline-block font-semibold">
                                            Total Written Marks: 1750
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3">3. Personality Test (Interview)</h3>
                                        <p className="text-gray-700">
                                            Candidates who qualify the Mains are called for the Interview. It carries <strong>275 Marks</strong>. The final rank is based on the total of 2025 Marks (Mains + Interview).
                                        </p>
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
                                <div className="space-y-6">
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                        <h4 className="font-bold text-lg text-primary-800 mb-3">Prelims: General Studies (Paper I)</h4>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                                            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5"></div>Current events of national and international importance.</li>
                                            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5"></div>History of India and Indian National Movement.</li>
                                            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5"></div>Indian and World Geography.</li>
                                            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5"></div>Indian Polity and Governance.</li>
                                            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5"></div>Economic and Social Development.</li>
                                            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5"></div>General issues on Environmental Ecology, Bio-diversity and Climate Change.</li>
                                            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5"></div>General Science.</li>
                                        </ul>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                        <h4 className="font-bold text-lg text-primary-800 mb-3">Prelims: CSAT (Paper II)</h4>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                                            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5"></div>Comprehension.</li>
                                            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5"></div>Interpersonal skills including communication skills.</li>
                                            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5"></div>Logical reasoning and analytical ability.</li>
                                            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5"></div>Decision making and problem solving.</li>
                                            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5"></div>General mental ability.</li>
                                            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5"></div>Basic numeracy (Class X level).</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Vacancy */}
                            <section id="vacancy" className="scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-primary-500 rounded-full"></div>
                                    Vacancy
                                </h2>
                                <p className="text-gray-700 mb-4">
                                    The number of vacancies varies every year. Approximately 800-1100 vacancies are announced annually.
                                </p>
                                <div className="bg-primary-50 p-4 rounded-lg flex items-center justify-between border border-primary-100">
                                    <span className="font-semibold text-primary-900">Total Vacancies (2024 Reference):</span>
                                    <span className="text-2xl font-bold text-primary-700">1056</span>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Salary */}
                            <section id="salary" className="scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-primary-500 rounded-full"></div>
                                    Salary Structure
                                </h2>
                                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="p-3 border-b border-r border-gray-200 text-sm font-semibold text-gray-700">Detail</th>
                                                <th className="p-3 border-b border-gray-200 text-sm font-semibold text-gray-700">Amount (Approx.)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            <tr className="border-b border-gray-100">
                                                <td className="p-3 border-r border-gray-100 font-medium">Basic Pay</td>
                                                <td className="p-3 text-gray-600">₹56,100</td>
                                            </tr>
                                            <tr className="border-b border-gray-100">
                                                <td className="p-3 border-r border-gray-100 font-medium">DA (Dearness Allowance)</td>
                                                <td className="p-3 text-gray-600">~50% of Basic</td>
                                            </tr>
                                            <tr className="border-b border-gray-100">
                                                <td className="p-3 border-r border-gray-100 font-medium">HRA (House Rent Allowance)</td>
                                                <td className="p-3 text-gray-600">8% - 24% (Based on City)</td>
                                            </tr>
                                            <tr className="bg-primary-50/20">
                                                <td className="p-3 border-r border-gray-100 font-bold text-gray-900">Gross Salary (Entry Level)</td>
                                                <td className="p-3 font-bold text-primary-700">₹85,000 - ₹1,00,000 / Month</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <hr className="border-gray-100" />

                            {/* Eligibility */}
                            <section id="eligibility" className="scroll-mt-24">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <div className="w-1.5 h-8 bg-primary-500 rounded-full"></div>
                                    Eligibility Criteria
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-2">1. Educational Qualification</h4>
                                        <p className="text-gray-700">Candidate must hold a Graduate Degree from a recognized University in any discipline. Final year students can also apply for Prelims.</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-2">2. Age Limit (as on 1st August 2025)</h4>
                                        <ul className="list-disc list-inside text-gray-700 ml-2 space-y-1">
                                            <li><span className="font-semibold">General:</span> 21 - 32 Years</li>
                                            <li><span className="font-semibold">OBC:</span> 21 - 35 Years (3 Years Relaxation)</li>
                                            <li><span className="font-semibold">SC/ST:</span> 21 - 37 Years (5 Years Relaxation)</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-2">3. Number of Attempts</h4>
                                        <ul className="list-disc list-inside text-gray-700 ml-2 space-y-1">
                                            <li><span className="font-semibold">General:</span> 6 Attempts</li>
                                            <li><span className="font-semibold">OBC:</span> 9 Attempts</li>
                                            <li><span className="font-semibold">SC/ST:</span> Unlimited (Up to Age Limit)</li>
                                        </ul>
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
                                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Table of Contents</h3>
                                <div className="space-y-1 relative">
                                    {/* Vertical Line */}
                                    <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-100"></div>

                                    {[
                                        { id: 'overview', label: 'Overview' },
                                        { id: 'highlights', label: 'Highlights' },
                                        { id: 'dates', label: 'Important Dates' },
                                        { id: 'pattern', label: 'Exam Pattern' },
                                        { id: 'syllabus', label: 'Syllabus' },
                                        { id: 'vacancy', label: 'Vacancy' },
                                        { id: 'salary', label: 'Salary' },
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
                                <h3 className="font-bold text-xl mb-2">Crack UPSC 2025</h3>
                                <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                                    Join our comprehensive coaching program. Live classes, Mock Tests, and Personalized Mentorship.
                                </p>
                                <div className="space-y-3">
                                    <Button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold">
                                        Start Free Trial
                                    </Button>
                                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                                        Download Brochure
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">Need Help?</div>
                                        <div className="text-xs text-gray-500">Talk to our counselor</div>
                                    </div>
                                </div>
                                <Button variant="ghost" className="w-full text-primary-600 hover:bg-primary-50 mt-2 text-sm font-semibold">
                                    Request Call Back
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Row
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

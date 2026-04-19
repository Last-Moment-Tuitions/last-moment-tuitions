"use client";
import React, { useState, useEffect } from 'react';
import {
    Search,
    ShoppingBag,
    Heart,
    Star,
    ArrowRight,
    CheckCircle,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Youtube,
    Menu,
    X,
    Code,
    PenTool,
    BarChart,
    Cpu,
    Camera,
    Music,
    Database,
    Globe
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Badge, Card, CategoryCard, CourseCard, FeatureCourseCard, InstructorCard, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from '@/components/Animations';
import { HeroBackground } from '@/components/HeroAnimation';
import { HeroMerged } from '@/components/HeroMerged';
import { FaqSection } from '@/components/FaqSection';
// import TestimonialSection from '@/components/TestimonialSection';
import { testimonialService } from '@/services/testimonialService';
import AnimatedTestimonials from '@/components/AnimatedTestimonials';
import { StickyScroll } from '@/components/StickyScrollLayout';


export default function HomePage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [testimonials, setTestimonials] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                // This call hits NestJS -> Redis (Fast) -> MongoDB (Fallback)
                const data = await testimonialService.getByPage('Homepage');
                setTestimonials(data);
            } catch (error) {
                console.error("Failed to fetch testimonials:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    // Mock Data
    const categories = [
        { icon: <Code className="w-6 h-6 text-blue-600" />, label: 'Label', count: '63,476', color: 'bg-blue-50' },
        { icon: <BarChart className="w-6 h-6 text-green-600" />, label: 'Business', count: '52,822', color: 'bg-green-50' },
        { icon: <Cpu className="w-6 h-6 text-purple-600" />, label: 'Finance & Accounting', count: '33,841', color: 'bg-purple-50' },
        { icon: <Database className="w-6 h-6 text-pink-600" />, label: 'IT & Software', count: '62,640', color: 'bg-pink-50' },
        { icon: <PenTool className="w-6 h-6 text-primary-600" />, label: 'Personal Development', count: '20,126', color: 'bg-primary-50' },
        { icon: <Camera className="w-6 h-6 text-gray-600" />, label: 'Office Productivity', count: '13,932', color: 'bg-gray-50' },
        { icon: <Globe className="w-6 h-6 text-teal-600" />, label: 'Marketing', count: '12,068', color: 'bg-teal-50' },
        { icon: <Music className="w-6 h-6 text-red-600" />, label: 'Photography & Video', count: '6,196', color: 'bg-red-50' },
        { icon: <Heart className="w-6 h-6 text-rose-600" />, label: 'Lifestyle', count: '2,736', color: 'bg-rose-50' },
        { icon: <PenTool className="w-6 h-6 text-indigo-600" />, label: 'Design', count: '2,600', color: 'bg-indigo-50' },
        { icon: <Heart className="w-6 h-6 text-accent-600" />, label: 'Health & Fitness', count: '1,678', color: 'bg-accent-50' },
        { icon: <Music className="w-6 h- cyan-600" />, label: 'Music', count: '959', color: 'bg-cyan-50' },
    ];

    const bestSellingCourses = [
        {
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "DEVELOPMENT",
            title: "The Complete 2026 Web Development Boot Camp Course",
            rating: "4.9",
            students: "5.3k",
            price: "57.00",
            instructor: "Kevin Gilbert",
            href: "/course-checkout/web-development-bootcamp-2026"
        },
        {
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "FINANCE",
            title: "Python for Finance: Investment Fundamentals & Data Analytics",
            rating: "4.7",
            students: "8.2k",
            price: "45.00",
            instructor: "Sarah Johnson",
            href: "/course-checkout/python-finance-data-analytics"
        },
        {
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "DATA SCIENCE",
            title: "Machine Learning A-Z™: Hands-On Python & R In Data Science",
            rating: "4.8",
            students: "12k",
            price: "62.00",
            instructor: "David Brown",
            href: "/course-checkout/machine-learning-python-r"
        },
        {
            image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "MARKETING",
            title: "The Complete Digital Marketing Course - 12 Courses in 1",
            rating: "4.6",
            students: "9.1k",
            price: "39.00",
            instructor: "Emily Davis",
            href: "/course-checkout/digital-marketing-complete"
        }
    ];

    const featureCourses = [
        {
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "HEALTH & FITNESS",
            title: "Investing In Stocks The Complete Course! (13 Hours)",
            rating: "5.0",
            students: "2.4k",
            price: "14.00",
            instructor: "Kevin Gilbert"
        },
        {
            image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "PERSONAL DEVELOPMENT",
            title: "Google Analytics Certification - Learn How To Pass The Exam",
            rating: "4.8",
            students: "3.1k",
            price: "22.00",
            instructor: "Kevin Gilbert"
        },
        {
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "DEVELOPMENT",
            title: "Adobe JS: The Complete Guide to JavaScript for Adobe",
            rating: "4.9",
            students: "1.8k",
            price: "18.00",
            instructor: "Kevin Gilbert"
        },
        {
            image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "MARKETING",
            title: "The Business Intelligence Analyst Course 2024",
            rating: "4.7",
            students: "4.5k",
            price: "25.00",
            instructor: "Kevin Gilbert"
        }
    ];

    const recentlyAddedCourses = [
        {
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "DESIGN",
            title: "User Experience Design Essentials - Adobe XD UI UX Design",
            rating: "4.6",
            students: "1.2k",
            price: "35.00",
            oldPrice: "70.00",
            instructor: "John Doe",
            href: "/course-checkout/ux-design-essentials"
        },
        {
            image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "DEVELOPMENT",
            title: "React - The Complete Guide (incl Hooks, React Router, Redux)",
            rating: "4.9",
            students: "8.5k",
            price: "49.00",
            oldPrice: "99.00",
            instructor: "Jane Smith",
            href: "/course-checkout/react-complete-guide"
        },
        {
            image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "BUSINESS",
            title: "The Complete Financial Analyst Course 2026",
            rating: "4.7",
            students: "3.3k",
            price: "42.00",
            oldPrice: "84.00",
            instructor: "Mike Wilson",
            href: "/course-checkout/financial-analyst-2026"
        },
        {
            image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "MARKETING",
            title: "Social Media Marketing MASTERY | Learn Ads on 10+ Platforms",
            rating: "4.8",
            students: "6.7k",
            price: "38.00",
            oldPrice: "76.00",
            instructor: "Sarah Lee",
            href: "/course-checkout/social-media-marketing"
        }
    ];



    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">

            {/* 
            ================================================================================
            PREVIOUS HERO SECTION (FROM MAIN BRANCH) - COMMENTED FOR FUTURE REFERENCE
            ================================================================================
            
            <HeroMerged>
                <FadeIn delay={0}>
                    <div className="inline-flex items-center gap-2 bg-white border border-accent-100 rounded-full px-4 py-1.5 shadow-sm mb-8 z-20 relative">
                        <span className="flex h-2 w-2 rounded-full bg-accent-500"></span>
                        <span className="text-sm font-semibold text-gray-700">🚀 Trending Now</span>
                    </div>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight relative z-20">
                        Master Your Future. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">Learn From The Best</span>
                    </h1>
                </FadeIn>

                <FadeIn delay={0.2}>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed relative z-20">
                        Access top-tier courses, expert-led live classes, and comprehensive study materials for GATE, JEE, and more.
                    </p>
                </FadeIn>

                <FadeIn delay={0.3}>
                    <div className="bg-white p-2 rounded-full shadow-2xl shadow-primary-500/10 max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-2 border border-gray-100 relative z-20">
                        <div className="flex-1 flex items-center px-4 w-full">
                            <Search className="w-5 h-5 text-gray-400 mr-3" />
                            <input
                                type="text"
                                placeholder="What do you want to learn?"
                                className="w-full py-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                            />
                        </div>
                        <div className="hidden md:block w-px h-8 bg-gray-200"></div>
                        <div className="flex-1 flex items-center px-4 w-full">
                            <div className="w-5 h-5 text-gray-400 mr-3 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor" fillOpacity="0.5" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Select Category"
                                className="w-full py-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
                            />
                        </div>
                        <Button size="lg" className="w-full md:w-auto rounded-full px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-lg shadow-primary-500/30">
                            Search
                        </Button>
                    </div>
                </FadeIn>
            </HeroMerged>
            */}

            {/* Hero Section */}
            <HeroMerged>
                <HeroBackground />
                <div className="w-full max-w-[1440px] px-6 sm:px-10 mx-auto relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center text-left">
                        {/* Left Column */}
                        <div className="flex flex-col items-start w-full relative z-20">
                            <FadeIn delay={0}>
                                <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100/50 rounded-full px-4 py-2 mb-8 shadow-sm">
                                    <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                                    <span className="text-xs font-bold text-primary-700 tracking-wider uppercase">🚀 Trusted by 100K+ Students</span>
                                </div>
                            </FadeIn>

                            <FadeIn delay={0.1}>
                                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
                                    Master Your <span className="text-primary-600">Future.</span>
                                    <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">Learn From The Best</span>
                                </h1>
                            </FadeIn>

                            <FadeIn delay={0.2}>
                                <p className="mt-6 text-base sm:text-lg text-gray-500 leading-relaxed max-w-md">
                                    Unlock your potential with expert-led courses and comprehensive study materials designed for the modern learner.
                                </p>
                            </FadeIn>

                            <FadeIn delay={0.3} className="w-full mt-10">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button 
                                        onClick={() => {
                                            document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="py-4 px-10 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold shadow-lg shadow-primary-500/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
                                    >
                                        Explore Courses
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                    <a 
                                        href="https://whatsapp.com/channel/0029Va9HyrxFHWq60QPVaM3j" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center py-4 px-10 rounded-2xl border-2 border-green-500/20 bg-green-50/30 hover:bg-green-500 hover:text-white text-green-700 font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95 gap-3 shadow-sm hover:shadow-green-500/20"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.886-9.885 9.886m8.415-18.297A11.715 11.715 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.63 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.721 11.721 0 00-3.484-8.412z" />
                                        </svg>
                                        Join WhatsApp
                                    </a>
                                </div>
                            </FadeIn>
                            
                            {/* Reviews */}
                            <FadeIn delay={0.4}>
                                <div className="flex items-center gap-4 mt-12 py-6 border-t border-gray-100 w-full">
                                    <div className="flex -space-x-3">
                                       <img className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm" src="https://i.pravatar.cc/100?img=1" alt="Student" />
                                       <img className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm" src="https://i.pravatar.cc/100?img=2" alt="Student" />
                                       <img className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm" src="https://i.pravatar.cc/100?img=3" alt="Student" />
                                       <img className="w-10 h-10 rounded-full ring-2 ring-white shadow-sm" src="https://i.pravatar.cc/100?img=4" alt="Student" />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1 text-amber-400">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                            <span className="text-sm font-bold text-gray-900 ml-1">4.9/5</span>
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-[0.05em]">Trusted by thousands</p>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>

                        {/* Right Column content */}
                        <div className="relative hidden lg:flex items-center justify-center w-full min-h-[500px] -mt-16 xl:-mt-24">
                             {/* Subtle decorative glow */}
                             <div className="absolute inset-0 -z-10">
                                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-br from-primary-100/40 via-accent-100/20 to-transparent rounded-full blur-[80px]"></div>
                             </div>
                             
                             <div className="relative w-full flex items-center justify-center">
                                 {/* Main hero illustration */}
                                 <motion.div 
                                    className="relative z-10 w-full max-w-[850px] xl:max-w-[1000px] 2xl:max-w-[1100px]"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ 
                                        y: [0, -15, 0],
                                        opacity: 1
                                    }}
                                    transition={{ 
                                        y: {
                                            duration: 6,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        },
                                        opacity: {
                                            duration: 0.8,
                                            delay: 0.5
                                        }
                                    }}
                                 >
                                    <img 
                                        src="/assets/hero_illustration.png" 
                                        alt="LMT Learning Illustration"
                                        className="w-full h-auto scale-y-105 object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.15)] filter drop-shadow-primary-500/10"
                                    />
                                    
                                    {/* Decorative subtle pulse behind image */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary-500/5 rounded-full blur-[100px] animate-pulse -z-10"></div>
                                 </motion.div>
                                 
                                 {/* Floating Testimonial Cards */}
                                 <FadeIn delay={0.5} className="absolute -top-6 -right-4 xl:-right-8 z-20">
                                     <div className="bg-white/95 backdrop-blur-xl p-4 md:p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/50 flex items-center gap-4 transform hover:-translate-y-1 transition-transform max-w-[280px]">
                                         <div className="relative shrink-0">
                                            <img className="w-12 h-12 rounded-full ring-2 ring-primary-500/20" src="https://i.pravatar.cc/100?img=12" alt="Student" />
                                            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full ring-2 ring-white">
                                                <CheckCircle className="w-3 h-3" />
                                            </div>
                                         </div>
                                         <div className="flex flex-col">
                                             <div className="flex items-center gap-1 mb-1">
                                                 {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                                             </div>
                                             <p className="text-sm font-bold text-gray-900 leading-tight">"Best curated content!"</p>
                                             <p className="text-[11px] text-gray-500 font-medium">Rahul Sharma</p>
                                         </div>
                                     </div>
                                 </FadeIn>

                                 <FadeIn delay={0.7} className="absolute -bottom-10 -left-6 xl:-left-12 z-20">
                                     <div className="bg-white/95 backdrop-blur-xl p-4 md:p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/50 flex items-center gap-4 transform hover:-translate-y-1 transition-transform max-w-[280px]">
                                         <div className="relative shrink-0">
                                            <img className="w-12 h-12 rounded-full ring-2 ring-amber-500/20" src="https://i.pravatar.cc/100?img=25" alt="Student" />
                                            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full ring-2 ring-white">
                                                <Star className="w-3 h-3 fill-current" />
                                            </div>
                                         </div>
                                         <div className="flex flex-col">
                                             <div className="flex items-center gap-1 mb-1">
                                                 {[...Array(5)].map((_, i) => (
                                                     <Star 
                                                        key={i} 
                                                        className={`w-3 h-3 ${i < 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} 
                                                     />
                                                 ))}
                                             </div>
                                             <p className="text-sm font-bold text-gray-900 leading-tight">"Saved my exams!"</p>
                                             <p className="text-[11px] text-gray-500 font-medium">Anjali Mishra</p>
                                         </div>
                                     </div>
                                 </FadeIn>
                             </div>
                        </div>
                    </div>
                </div>
            </HeroMerged>


            {/* Browse Top Category */}
            {/* <section className="py-12">
                <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10">
                    <div className="text-center mb-10">
                        <FadeIn>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Browse top category</h2>
                            <p className="text-gray-600 text-lg">Explore our most popular course categories</p>
                        </FadeIn>
                    </div>

                    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {categories.map((cat, index) => (
                            <StaggerItem key={index}>
                                <CategoryCard
                                    icon={cat.icon}
                                    label={cat.label}
                                    count={cat.count}
                                    color={cat.color}
                                />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>

                    <div className="text-center mt-12">
                        <p className="text-gray-600">
                            We have more category & subcategory. <a href="#" className="text-primary-600 font-bold hover:underline">Browse All</a>
                        </p>
                    </div>
                </div>
            </section> */}


            {/* Best Selling Courses */}
            <section className="py-12 bg-gray-50">
                <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10">
                    <div className="text-center mb-10">
                        <FadeIn>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Best selling courses</h2>
                            <p className="text-gray-600 text-lg">Top-rated courses chosen by thousands of students</p>
                        </FadeIn>
                    </div>

                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {bestSellingCourses.map((course, index) => (
                            <StaggerItem key={index}>
                                <CourseCard {...course} />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </section>

            {/* Feature Courses */}
            {/* <section className="py-12">
                <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10">
                    <div className="text-center mb-10">
                        <FadeIn>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Our feature courses</h2>
                            <p className="text-gray-600 text-lg">Hand-picked premium courses for serious learners</p>
                        </FadeIn>
                    </div>

                    <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {featureCourses.map((course, index) => (
                            <StaggerItem key={index}>
                                <FeatureCourseCard {...course} />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </section> */}

            {/* Recently Added Courses */}
            <section className="py-12 bg-gray-50">
                <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10">
                    <div className="text-center mb-10">
                        <FadeIn>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Recently added courses</h2>
                            <p className="text-gray-600 text-lg">Discover the latest additions to our course catalog</p>
                        </FadeIn>
                    </div>

                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {recentlyAddedCourses.map((course, index) => (
                            <StaggerItem key={index}>
                                <CourseCard {...course} />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>

                    <div className="text-center mt-12">
                        <Button variant="primary" className="rounded-full px-8 py-3 shadow-lg shadow-primary-500/20">
                            Browse All Courses
                        </Button>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-12 bg-gray-50">
                <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10">
                    <div className="text-center mb-10">
                        <FadeIn>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Loved by our students</h2>
                            <p className="text-gray-600 text-lg">Hear what our successful students have to say</p>
                        </FadeIn>
                    </div>

                    {/* Only render if we have data to prevent errors */}
                    {!loading && testimonials.length > 0 ? (
                        <AnimatedTestimonials
                            testimonials={testimonials.map(t => ({
                                src: t.image,
                                name: t.name,
                                designation: `Verified Student of Last Moment Tuitions`,
                                quote: t.message,
                                rating: t.rating
                            }))}
                            autoplay={true}
                        />
                    ) : null}
                </div>
            </section>

            {/* Become an Instructor */}
            <section className="py-20">
                <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10">
                    <ScaleIn>
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                            <div className="md:w-1/2 bg-gradient-to-br from-primary-500 to-accent-500 p-12 text-white flex flex-col justify-center">
                                <h2 className="text-4xl font-bold mb-6">Become an instructor</h2>
                                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                                    Instructors from around the world teach millions of students on LMT. We provide the tools and skills to teach what you love.
                                </p>
                                <Button className="bg-white text-primary-600 hover:bg-gray-50 w-fit rounded-full px-8 py-3 font-bold shadow-lg">
                                    Start Teaching Today
                                </Button>
                            </div>
                            <div className="md:w-1/2 p-12 bg-gray-50 flex flex-col justify-center">
                                <h3 className="text-2xl font-bold text-gray-900 mb-8">Your teaching & earning steps</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xl">1</div>
                                        <p className="text-gray-700 font-medium">Apply to become instructor</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center font-bold text-xl">2</div>
                                        <p className="text-gray-700 font-medium">Build & edit your course</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xl">3</div>
                                        <p className="text-gray-700 font-medium">Get paid for every new student</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl">4</div>
                                        <p className="text-gray-700 font-medium">Start teaching & earning</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScaleIn>
                </div>
            </section>

            {/* FAQ Section */}
            <FadeIn>
                <FaqSection />
            </FadeIn>
        </div>
    );
}


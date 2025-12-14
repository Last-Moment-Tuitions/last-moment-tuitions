import React from 'react';
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
import { Button, Badge, Card, CategoryCard, CourseCard, FeatureCourseCard, InstructorCard, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from '@/components/Animations';
import { HeroBackground } from '@/components/HeroAnimation';
import { HeroMerged } from '@/components/HeroMerged';
import { FaqSection } from '@/components/FaqSection';
import { AnimatedTestimonials } from '@/components/AnimatedTestimonials';
import { StickyScroll } from '@/components/StickyScrollLayout';

export default function HomePage() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

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
        { icon: <Music className="w-6 h-6 text-cyan-600" />, label: 'Music', count: '959', color: 'bg-cyan-50' },
    ];

    const bestSellingCourses = [
        {
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "DESIGN",
            title: "The Complete 2024 Web Development Boot Camp",
            rating: "4.9",
            students: "5.3k",
            price: "57.00",
            instructor: "Kevin Gilbert"
        },
        {
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "DEVELOPMENT",
            title: "Python for Finance: Investment Fundamentals & Data Analytics",
            rating: "4.7",
            students: "8.2k",
            price: "45.00",
            instructor: "Sarah Johnson"
        },
        {
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "BUSINESS",
            title: "Machine Learning A-Z™: Hands-On Python & R In Data Science",
            rating: "4.8",
            students: "12k",
            price: "62.00",
            instructor: "David Brown"
        },
        {
            image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "MARKETING",
            title: "The Complete Digital Marketing Course - 12 Courses in 1",
            rating: "4.6",
            students: "9.1k",
            price: "39.00",
            instructor: "Emily Davis"
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
            instructor: "John Doe"
        },
        {
            image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "DEVELOPMENT",
            title: "React - The Complete Guide (incl Hooks, React Router, Redux)",
            rating: "4.9",
            students: "8.5k",
            price: "49.00",
            oldPrice: "99.00",
            instructor: "Jane Smith"
        },
        {
            image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "BUSINESS",
            title: "The Complete Financial Analyst Course 2024",
            rating: "4.7",
            students: "3.3k",
            price: "42.00",
            oldPrice: "84.00",
            instructor: "Mike Wilson"
        },
        {
            image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            category: "MARKETING",
            title: "Social Media Marketing MASTERY | Learn Ads on 10+ Platforms",
            rating: "4.8",
            students: "6.7k",
            price: "38.00",
            oldPrice: "76.00",
            instructor: "Sarah Lee"
        }
    ];



    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">

            {/* Hero Section */}
            <HeroMerged>
                {/* Pill Badge */}
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

                {/* Subtext */}
                <FadeIn delay={0.2}>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed relative z-20">
                        Access top-tier courses, expert-led live classes, and comprehensive study materials for GATE, JEE, and more.
                    </p>
                </FadeIn>

                {/* Search Bar */}
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

            {/* Browse Top Category */}
            <section className="py-12">
                <div className="container mx-auto px-4">
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
            </section>


            {/* Best Selling Courses */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
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
            <section className="py-12">
                <div className="container mx-auto px-4">
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
            </section>

            {/* Recently Added Courses */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
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

            {/* Testimonials */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <FadeIn>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Loved by our students</h2>
                            <p className="text-gray-600 text-lg">Hear what our successful students have to say</p>
                        </FadeIn>
                    </div>
                    <AnimatedTestimonials
                        autoplay={true}
                        testimonials={[
                            {
                                quote: "The structured content and expert instructors helped me crack GATE with a top rank. The practice tests were very close to the actual exam pattern.",
                                name: "Riya Sharma",
                                designation: "AIR 45, GATE CS 2024",
                                src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3387&auto=format&fit=crop"
                            },
                            {
                                quote: "I switched careers from non-tech to Full Stack Development thanks to the bootcamp course. The hands-on projects gave me the confidence to ace my interviews.",
                                name: "Arjun Mehta",
                                designation: "Software Engineer at Google",
                                src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop"
                            },
                            {
                                quote: "The UPSC pre-recorded lectures were a lifesaver. I could study at my own pace and the doubt clearing sessions were extremely helpful.",
                                name: "Priya Patel",
                                designation: "UPSC Aspirant",
                                src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3461&auto=format&fit=crop"
                            },
                            {
                                quote: "Excellent content for banking exams. The math tricks and reasoning shortcuts taught by the instructors saved me so much time in the actual exam.",
                                name: "Vikram Singh",
                                designation: "PO at SBI",
                                src: "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=3560&auto=format&fit=crop"
                            },
                            {
                                quote: "The best investment I made for my career. The instructors are clearly industry veterans and the community support is unmatched.",
                                name: "Ananya Das",
                                designation: "Product Designer",
                                src: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=3560&auto=format&fit=crop"
                            },
                        ]}
                    />
                </div>
            </section>

            {/* Become an Instructor */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <ScaleIn>
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                            <div className="md:w-1/2 bg-gradient-to-br from-primary-500 to-accent-500 p-12 text-white flex flex-col justify-center">
                                <h2 className="text-4xl font-bold mb-6">Become an instructor</h2>
                                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                                    Instructors from around the world teach millions of students on E-tutor. We provide the tools and skills to teach what you love.
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


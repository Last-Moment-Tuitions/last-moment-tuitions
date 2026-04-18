import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui';

export function FaqSection() {
    const faqs = [
        {
            question: "How do I create an account on the job board?",
            answer: "Click on the 'Sign Up' button in the top right corner. Fill in your details including name, email, and password. You can also sign up using your Google or LinkedIn account for faster access."
        },
        {
            question: "How do I apply for a job through the platform?",
            answer: "Once you've found a job you're interested in, click the 'Apply Now' button. You'll be prompted to upload your resume and cover letter. Some employers may ask additional screening questions."
        },
        {
            question: "How can I track the status of my job applications?",
            answer: "Go to your dashboard and look for the 'My Applications' section. Here you can see the status of all your applications (e.g., Applied, Viewed, Interview Shortlist, Rejected)."
        },
        {
            question: "Is there a cost to use the job board, and what features are free?",
            answer: "Job seekers can create a profile, search for jobs, and apply for free. We also offer a premium subscription that includes features like resume review, application insights, and priority listing."
        },
        {
            question: "How do I set up job alerts?",
            answer: "After performing a search, click the 'Create Job Alert' button. You can specify criteria like job title, location, and salary range. We'll email you daily or weekly when matching jobs are posted."
        }
    ];

    return (
        <section className="py-24 bg-white overflow-hidden" id="faq">
            {/* <div className="container mx-auto px-4"> */}
            <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left side: Illustration */}
                    <div className="relative order-2 lg:order-1">
                        <div className="absolute -inset-10 bg-gradient-to-br from-primary-100/40 to-accent-100/20 rounded-full blur-[80px] -z-10 animate-pulse"></div>
                        <div className="relative z-10 p-4 rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100 shadow-2xl transform hover:rotate-1 transition-transform duration-700">
                            <img 
                                src="/assets/final_faq_illustration.png" 
                                alt="Final Support Illustration" 
                                className="w-full h-auto rounded-2xl"
                            />
                        </div>
                        
                        {/* Floating elements for extra premium feel */}
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-accent-50 rounded-full flex items-center justify-center shadow-lg animate-bounce duration-[3000ms] lg:flex hidden">
                            <div className="w-10 h-10 rounded-full bg-accent-500/20 flex items-center justify-center">
                                <span className="text-accent-600 font-bold">?</span>
                            </div>
                        </div>
                    </div>

                    {/* Right side: FAQs */}
                    <div className="order-1 lg:order-2">
                        <div className="mb-12">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider mb-4">Support Center</span>
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                Frequently asked <span className="text-primary-600">Questions</span>
                            </h2>
                            <p className="text-gray-600 text-lg max-w-xl">
                                Have questions? We're here to help. Find answers to the most common questions about our platform.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Accordion type="single" collapsible className="w-full">
                                {faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`item-${index}`} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white mb-4">
                                        <AccordionTrigger className="px-6 py-5 text-lg font-semibold hover:no-underline group transition-colors">
                                            <span className="flex items-center gap-4">
                                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-500 font-bold text-sm group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                    {String(index + 1).padStart(2, '0')}
                                                </span>
                                                <span className="text-left text-gray-800 group-hover:text-primary-600 transition-colors">{faq.question}</span>
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6 pb-6 pt-0 text-gray-600 leading-relaxed text-base pl-16">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                        
                        <div className="mt-10 p-6 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-4">
                            <div>
                                <p className="font-bold text-gray-900">Still have questions?</p>
                                <p className="text-sm text-gray-600">We're always here to help you succeed.</p>
                            </div>
                            <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-primary-500/20">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

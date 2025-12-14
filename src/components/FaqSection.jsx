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
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Frequently asked Questions</h2>
                </div>

                <div className="max-w-4xl mx-auto">
                    <Accordion type="single" collapsible className="space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <AccordionTrigger className="px-8 py-6 text-lg hover:bg-transparent hover:text-primary-600 transition-colors">
                                    <span className="flex items-center gap-6">
                                        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-500 font-bold text-sm group-data-[state=open]:bg-primary-600 group-data-[state=open]:text-white transition-colors">
                                            {String(index + 1).padStart(2, '0')}
                                        </span>
                                        <span className="text-left">{faq.question}</span>
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="px-8 pb-8 pt-0 text-gray-600 leading-relaxed text-base pl-24">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}

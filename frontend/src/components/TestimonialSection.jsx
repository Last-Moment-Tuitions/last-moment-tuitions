"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle } from 'lucide-react';

const TestimonialSection = ({ testimonials }) => {
    if (!testimonials || testimonials.length === 0) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <section className="py-8 bg-[#f8fafc] relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-3xl -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -ml-64 -mb-64" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 mb-4 text-sm font-bold tracking-wider text[#072354] uppercase bg-indigo-50 rounded-full"
                    >
                        Student Success
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-5xl font-black text-gray-900 leading-tight"
                    >
                        Don't just take our word for it, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
                            Hear from our achievers
                        </span>
                    </motion.h2>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
                >
                    {testimonials.map((item) => (
                        <motion.div
                            key={item._id}
                            variants={cardVariants}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                            className="relative break-inside-avoid bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group"
                        >
                            <div className="absolute top-6 right-8 opacity-30 ">
                                <Quote size={40} className="text-indigo-600" />
                            </div>

                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className={i < item.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                                    />
                                ))}
                            </div>

                            <p className="text-lg text-slate-700 leading-relaxed mb-8 relative z-10">
                                "{item.message}"
                            </p>

                            <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-100 p-0.5">
                                        <img
                                            src={item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=4f46e5&color=fff&bold=true`}
                                            alt={item.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                        <CheckCircle className="text-green-500 fill-white" size={18} />
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-slate-900 font-bold text-lg leading-tight">{item.name}</h4>
                                    <p className="text-indigo-600 text-sm font-semibold flex items-center gap-1">
                                        Verified LMT Student
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TestimonialSection;
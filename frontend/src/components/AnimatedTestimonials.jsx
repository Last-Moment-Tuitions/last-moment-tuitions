"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";


const isValidUrl = (url) => {
    try {
        return Boolean(new URL(url));
    } catch (e) {
        return false;
    }
};
const AnimatedTestimonials = ({ testimonials = [], autoplay = false }) => {
    const [active, setActive] = useState(0);

    const fallbackImage = "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&h=200&fit=crop";
    const handleNext = () => {
        setActive((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const isActive = (index) => index === active;

    useEffect(() => {
        if (autoplay && testimonials.length > 0) {
            const interval = setInterval(handleNext, 5000);
            return () => clearInterval(interval);
        }
    }, [autoplay, testimonials.length]);

    if (!testimonials.length) return null;

    const getQuote = (item) => item.quote || item.message || "";

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    };

    return (
        <div className="max-w-sm md:max-w-4xl mx-auto antialiased font-sans px-4 md:px-8 lg:px-12 py-20">
            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-20">
                {/* Image Stack Section */}
                <div>
                    <div className="relative h-80 w-full">
                        <AnimatePresence>
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial._id || index}
                                    initial={{
                                        opacity: 0,
                                        scale: 0.9,
                                        z: -100,
                                        rotate: (index % 21) - 10,
                                    }}
                                    animate={{
                                        opacity: isActive(index) ? 1 : 0.7,
                                        scale: isActive(index) ? 1 : 0.9,
                                        z: isActive(index) ? 0 : -100,
                                        rotate: isActive(index) ? 0 : (index % 21) - 10,
                                        zIndex: isActive(index) ? 30 : testimonials.length + 2 - index,
                                        y: isActive(index) ? [0, -80, 0] : 0,
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.9,
                                        z: 100,
                                        rotate: (index % 21) - 10,
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute inset-0 origin-bottom"
                                >
                                    <img
                                        src={
                                            [testimonial.imageUrl, testimonial.src, testimonial.image]
                                                .find(img => img && typeof img === 'string' && isValidUrl(img))
                                            || fallbackImage
                                        }
                                        alt={testimonial.name || "Testimonial"}
                                        draggable={false}
                                        className="h-full w-full rounded-3xl object-cover object-center shadow-xl"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/150";
                                        }}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex justify-between flex-col py-4">
                    <motion.div
                        key={active}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >

                        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {testimonials[active].name}
                        </h3>
                        <p className="text-sm text-gray-500">{testimonials[active].designation}</p>
                        {/* Improved Rating Style */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => {
                                    const isFull = i < Math.floor(testimonials[active].rating || 5);
                                    return (
                                        <motion.svg
                                            key={`${active}-${i}`}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.1 + i * 0.05 }}
                                            className={`h-5 w-5 ${isFull
                                                ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                                                : "text-gray-200 fill-gray-200"
                                                }`}
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </motion.svg>
                                    );
                                })}
                            </div>
                            <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-100">
                                {Number(testimonials[active].rating || 5).toFixed(1)}
                            </span>
                        </div>

                        {/* Word-by-word Quote Animation */}
                        <div className="text-lg text-gray-600 mt-8 leading-relaxed">
                            {getQuote(testimonials[active]).split(" ").map((word, index) => (
                                <motion.span
                                    key={`${active}-${index}`}
                                    initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                                    animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.2,
                                        ease: "easeInOut",
                                        delay: 0.02 * index,
                                    }}
                                    className="inline-block"
                                >
                                    {word}&nbsp;
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 pt-12">
                        <button
                            onClick={handlePrev}
                            className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center group/button hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-900 group-hover/button:-translate-x-1 transition-transform duration-300" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center group/button hover:bg-gray-200 transition-colors"
                        >
                            <ArrowRight className="h-5 w-5 text-gray-900 group-hover/button:translate-x-1 transition-transform duration-300" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnimatedTestimonials;
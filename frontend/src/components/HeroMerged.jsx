import React, { useEffect, useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

/**
 * Container Cover Component
 */
export const Cover = ({
    children,
    className,
}) => {
    const [hovered, setHovered] = useState(false);

    return (
        <span
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={cn(
                "relative group/cover inline-block rounded-sm transition-all duration-200 ease-in-out px-2 py-1 mx-1",
                className
            )}
        >
            <AnimatePresence>
                {hovered && (
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ opacity: { duration: 0.2 } }}
                        className="absolute inset-0 w-full h-full bg-primary-50 dark:bg-primary-900 opacity-30 group-hover/cover:opacity-100 rounded-sm overflow-hidden pointer-events-none block"
                    >
                        <motion.span
                            animate={{
                                translateX: ["-100%", "100%"],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="w-full h-full flex flex-row opacity-20 block"
                        >
                            {[...Array(20)].map((_, i) => (
                                <span
                                    key={i}
                                    style={{
                                        width: '2px',
                                    }}
                                    className="h-full bg-gradient-to-b from-transparent via-primary-300 to-transparent dark:via-primary-600 mx-1 inline-block"
                                />
                            ))}
                        </motion.span>
                    </motion.span>
                )}
            </AnimatePresence>
            <span className="relative z-20 group-hover/cover:text-black dark:group-hover/cover:text-white transition-colors duration-200 inline-block">
                {children}
            </span>
            <CircleIcon className="absolute -right-[2px] -top-[2px]" />
            <CircleIcon className="absolute -bottom-[2px] -right-[2px]" delay={0.4} />
            <CircleIcon className="absolute -left-[2px] -top-[2px]" delay={0.2} />
            <CircleIcon className="absolute -bottom-[2px] -left-[2px]" delay={0.4} />
        </span>
    );
};

export const CircleIcon = ({ className, delay }) => {
    return (
        <div
            className={cn(
                "pointer-events-none animate-pulse group-hover/cover:hidden group-hover/cover:opacity-100 h-2 w-2 rounded-full bg-primary-500 dark:bg-accent-400 opacity-40",
                className
            )}
        ></div>
    );
};


/**
 * Main HeroMerged Component
 */
export const HeroMerged = ({ children }) => {
    return (
        <div className="relative min-h-[40rem] flex flex-col justify-center items-center w-full bg-white pt-20 pb-32">
            <div className="container mx-auto px-4 text-center">
                {children}
            </div>
        </div>
    )
}

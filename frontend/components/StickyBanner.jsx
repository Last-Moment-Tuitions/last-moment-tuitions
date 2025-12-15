'use client';

import React, { useState, useRef } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "../lib/utils";
import { X } from "lucide-react";

export const StickyBanner = ({
    children,
    className,
    sticky = true,
}) => {
    const { scrollY } = useScroll();
    const [visible, setVisible] = useState(true);
    const [dismissed, setDismissed] = useState(false);
    const lastScrollY = useRef(0);
    const scrollThreshold = useRef(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (!sticky) return;

        // Add threshold to prevent rapid toggling
        const diff = Math.abs(latest - lastScrollY.current);
        if (diff < 5) return; // Only update if scrolled at least 5px

        const direction = latest > lastScrollY.current ? "down" : "up";

        // Show if near top or scrolling up
        if (latest < 100) {
            setVisible(true);
        } else {
            if (direction === "down" && latest > scrollThreshold.current) {
                setVisible(false);
                scrollThreshold.current = latest;
            } else if (direction === "up") {
                setVisible(true);
            }
        }
        lastScrollY.current = latest;
    });

    if (dismissed) return null;

    return (
        <motion.div
            initial={{ y: 0 }}
            animate={{
                y: visible ? 0 : -100,
            }}
            transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1] // Custom easing for smoother motion
            }}
            className={cn(
                "sticky top-0 z-[60] w-full",
                className
            )}
        >
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 shadow-md">
                <div className="container mx-auto flex items-center justify-center h-8 relative">
                    <div className="text-center text-sm font-bold md:text-base">
                        {children}
                    </div>
                    <button
                        onClick={() => setDismissed(true)}
                        className="absolute right-0 p-1 hover:bg-white/20 rounded-full transition-colors flex-shrink-0 flex items-center justify-center h-6 w-6"
                    >
                        <X className="w-4 h-4" />
                        <span className="sr-only">Dismiss</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};


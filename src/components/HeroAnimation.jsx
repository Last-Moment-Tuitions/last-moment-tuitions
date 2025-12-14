import React from 'react';
import { motion } from 'framer-motion';

export const HeroBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Blob 1 - Yellow/Gold */}
            <motion.div
                className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary-300/50 rounded-full blur-[100px] mix-blend-multiply"
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Blob 2 - Orange/Accent */}
            <motion.div
                className="absolute top-[20%] right-[0%] w-[40%] h-[60%] bg-accent-300/50 rounded-full blur-[120px] mix-blend-multiply"
                animate={{
                    x: [0, -50, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
            />

            {/* Blob 3 - Primary/Yellow darker */}
            <motion.div
                className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] bg-primary-200/40 rounded-full blur-[100px] mix-blend-multiply"
                animate={{
                    x: [0, 50, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5
                }}
            />
        </div>
    );
};

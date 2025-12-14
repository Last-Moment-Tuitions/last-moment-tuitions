import React from "react";
import { cn } from "../lib/utils";

export const Meteors = ({ number = 20, className }) => {
    const meteors = new Array(number).fill(true);
    return (
        <>
            {meteors.map((_, idx) => (
                <span
                    key={"meteor" + idx}
                    className={cn(
                        "animate-meteor-effect absolute h-0.5 w-0.5 rounded-[9999px] bg-orange-400 opacity-60 shadow-[0_0_0_1px_#fb923c40] rotate-[135deg]",
                        "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[80px] before:h-[1px] before:bg-gradient-to-r before:from-orange-300/60 before:to-transparent",
                        className
                    )}
                    style={{
                        top: Math.floor(Math.random() * 100) + "%",
                        left: Math.floor(Math.random() * 100) + "%",
                        animationDelay: Math.random() * 3 + "s",
                        animationDuration: Math.floor(Math.random() * 10) + 10 + "s",
                    }}
                ></span>
            ))}
        </>
    );
};

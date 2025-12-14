import React from 'react';
import { cn } from '../lib/utils';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { ChevronDown } from 'lucide-react';

// Enhanced Accordion Component
export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef(({ className, ...props }, ref) => (
    <AccordionPrimitive.Item
        ref={ref}
        className={cn("border-b border-gray-200", className)}
        {...props}
    />
));
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                "flex flex-1 items-center justify-between py-5 px-6 text-base font-semibold transition-all hover:bg-gray-50/50",
                "[&[data-state=open]]:bg-gradient-to-r [&[data-state=open]]:from-primary-50/50 [&[data-state=open]]:to-accent-50/30",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown className="h-5 w-5 shrink-0 text-primary-600 transition-transform duration-300 [&[data-state=open]>*]:rotate-180" />
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
        {...props}
    >
        <div className={cn("px-6 pb-6 pt-2", className)}>{children}</div>
    </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

// Enhanced Tabs Component
export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.List
        ref={ref}
        className={cn(
            "inline-flex h-12 items-center justify-start rounded-xl bg-gray-100/70 p-1.5 text-gray-600 gap-1.5",
            className
        )}
        {...props}
    />
));
TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-6 py-2.5 text-sm font-semibold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            "data-[state=active]:bg-white data-[state=active]:text-primary-700 data-[state=active]:shadow-md",
            "hover:text-gray-900",
            className
        )}
        {...props}
    />
));
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
    <TabsPrimitive.Content
        ref={ref}
        className={cn(
            "mt-6 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
            className
        )}
        {...props}
    />
));
TabsContent.displayName = "TabsContent";

// Premium Card Component  
export function Card({ children, className, gradient = false, ...props }) {
    return (
        <div
            className={cn(
                "rounded-2xl border border-gray-200/60 bg-white p-6 shadow-md transition-all duration-300",
                "hover:shadow-2xl hover:shadow-primary-600/10 hover:border-primary-300/70 hover:-translate-y-1",
                gradient && "bg-gradient-to-br from-white via-white to-primary-50/30",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

// Premium Button Component
export function Button({ children, variant = 'primary', size = 'md', className, icon, ...props }) {
    const baseStyles = "inline-flex items-center justify-center gap-2.5 font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";

    const variants = {
        primary: "bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-lg shadow-primary-600/40 hover:shadow-2xl hover:shadow-primary-600/50 hover:-translate-y-1 focus:ring-primary-500",
        accent: "bg-gradient-to-r from-accent-600 to-accent-700 text-white hover:from-accent-700 hover:to-accent-800 shadow-lg shadow-accent-600/40 hover:shadow-2xl hover:shadow-accent-600/50 hover:-translate-y-1 focus:ring-accent-500",
        outline: "border-2 border-primary-600 text-primary-700 hover:bg-primary-50 hover:-translate-y-0.5 focus:ring-primary-500 shadow-sm hover:shadow-md",
        ghost: "text-primary-700 hover:bg-primary-50/80 focus:ring-primary-500",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 shadow-sm hover:shadow-md",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
}

// Premium Badge Component
export function Badge({ children, variant = 'primary', size = 'md', className, ...props }) {
    const variants = {
        primary: "bg-primary-100 text-primary-700 ring-1 ring-primary-600/20",
        accent: "bg-accent-100 text-accent-700 ring-1 ring-accent-600/20",
        success: "bg-green-100 text-green-700 ring-1 ring-green-600/20",
        warning: "bg-amber-100 text-amber-700 ring-1 ring-amber-600/20",
        danger: "bg-red-100 text-red-700 ring-1 ring-red-600/20",
        neutral: "bg-gray-100 text-gray-700 ring-1 ring-gray-600/20",
    };

    const sizes = {
        sm: "px-2.5 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 font-semibold rounded-full",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}

// Premium Table Component
export function Table({ headers, data, className }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200/60 my-6 shadow-lg">
            <div className="overflow-x-auto">
                <table className={cn("w-full border-collapse", className)}>
                    <thead className="bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 text-white shadow-inner">
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-4 text-left font-bold text-sm tracking-wide uppercase"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-gradient-to-r hover:from-primary-50/40 hover:to-accent-50/30 transition-all duration-200 hover:shadow-sm"
                            >
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="px-6 py-4 text-gray-700 font-medium">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Glassmorphism Card
export function GlassCard({ children, className, ...props }) {
    return (
        <div
            className={cn(
                "relative rounded-2xl backdrop-blur-lg bg-white/40 border border-white/60 shadow-xl shadow-gray-900/5",
                "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/60 before:to-white/30 before:-z-10",
                className
            )}
            {...props}
        >
            <div className="relative z-10 p-6">{children}</div>
        </div>
    );
}

// Stat Card Component
export function StatCard({ value, label, icon, trend, className }) {
    return (
        <Card className={cn("text-center hover:scale-105 transition-transform", className)} gradient>
            {icon && <div className="mx-auto mb-3 text-primary-600">{icon}</div>}
            <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-2">
                {value}
            </div>
            <div className="text-sm font-medium text-gray-600 tracking-wide">{label}</div>
            {trend && <div className="mt-2 text-xs text-green-600 font-semibold">{trend}</div>}
        </Card>
    );
}

// Info Box Component
export function InfoBox({ title, children, variant = 'info', icon, className }) {
    const variants = {
        info: "bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200 text-primary-900",
        success: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 text-green-900",
        warning: "bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200 text-primary-900",
        danger: "bg-gradient-to-br from-red-50 to-rose-50 border-red-200 text-red-900",
    };

    return (
        <div className={cn("rounded-xl border-2 p-5", variants[variant], className)}>
            {title && (
                <div className="flex items-center gap-2 mb-3">
                    {icon && <span className="text-xl">{icon}</span>}
                    <h4 className="font-bold text-base">{title}</h4>
                </div>
            )}
            <div className="text-sm leading-relaxed">{children}</div>
        </div>
    );
}

// --- New Components for Homepage Redesign ---

export function CategoryCard({ icon, label, count, color, className }) {
    return (
        <div className={cn("flex items-center gap-4 p-4 rounded-lg transition-all duration-300 hover:shadow-md cursor-pointer", color, className)}>
            <div className="p-3 bg-white rounded-lg shadow-sm">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-gray-900 text-base">{label}</h3>
                <p className="text-sm text-gray-600">{count} Courses</p>
            </div>
        </div>
    );
}

export function CourseCard({ image, category, title, rating, students, price, oldPrice, instructor, className }) {
    return (
        <div className={cn("bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group", className)}>
            <div className="relative h-48 overflow-hidden">
                <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-primary-700 uppercase tracking-wide">
                    {category}
                </div>
            </div>
            <div className="p-5">
                <div className="flex items-center justify-between mb-2 text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                        {category}
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                        <span>★</span>
                        <span className="text-gray-700">{rating}</span>
                    </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {title}
                </h3>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                            {/* Placeholder for instructor image */}
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${instructor}`} alt={instructor} />
                        </div>
                        <span className="text-sm font-medium text-gray-600">{instructor}</span>
                    </div>
                    <div className="text-right">
                        <span className="block text-lg font-bold text-primary-600">${price}</span>
                        {oldPrice && <span className="block text-xs text-gray-400 line-through">${oldPrice}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function FeatureCourseCard({ image, category, title, rating, students, price, instructor, className }) {
    return (
        <div className={cn("bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row", className)}>
            <div className="md:w-2/5 relative overflow-hidden">
                <img src={image} alt={title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-primary-500 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide">
                    {category}
                </div>
            </div>
            <div className="p-6 md:w-3/5 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-amber-500 text-sm font-bold">★ {rating}</span>
                    <span className="text-gray-400 text-sm">({students} students)</span>
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-3 hover:text-primary-600 transition-colors">
                    {title}
                </h3>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${instructor}`} alt={instructor} />
                    </div>
                    <span className="text-sm font-medium text-gray-600">By {instructor}</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-bold text-primary-600">${price}</span>
                    <Button size="sm" variant="outline" className="rounded-full">View Details</Button>
                </div>
            </div>
        </div>
    );
}

export function InstructorCard({ name, role, students, image, className }) {
    return (
        <div className={cn("text-center group", className)}>
            <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg group-hover:border-primary-100 transition-all duration-300">
                <img src={image} alt={name} className="w-full h-full object-cover" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">{name}</h3>
            <p className="text-sm text-gray-500 mb-2">{role}</p>
            <div className="flex items-center justify-center gap-1 text-xs font-medium text-primary-600 bg-primary-50 py-1 px-3 rounded-full mx-auto w-fit">
                <span>★</span>
                <span>{students} Students</span>
            </div>
        </div>
    );
}

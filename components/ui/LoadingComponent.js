"use client";
import { Loader, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoadingComponent({
    message = "Loading...",
    fullScreen = false,
    size = "default",
    showLogo = false
}) {
    const sizeClasses = {
        small: "w-4 h-4",
        default: "w-8 h-8",
        large: "w-12 h-12"
    };

    const textSizeClasses = {
        small: "text-sm",
        default: "text-base",
        large: "text-lg"
    };

    const LoadingContent = () => (
        <div className="flex flex-col items-center justify-center space-y-4">
            {showLogo && (
                <motion.div
                    className="flex items-center gap-2 mb-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Sparkles className="text-blue-400 w-8 h-8" />
                    <span className="text-2xl font-bold font-space text-white">Hey Humanz</span>
                </motion.div>
            )}

            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
                <Loader className={`${sizeClasses[size]} text-blue-400`} />
            </motion.div>

            <motion.p
                className={`text-gray-400 ${textSizeClasses[size]} font-inter`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {message}
            </motion.p>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
                <LoadingContent />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center p-8">
            <LoadingContent />
        </div>
    );
}

// Skeleton loading components
export function SkeletonCard() {
    return (
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-700 rounded w-2/3"></div>
        </div>
    );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
    return (
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="flex p-4 border-b border-gray-800">
                {Array.from({ length: cols }).map((_, i) => (
                    <div key={i} className="flex-1 h-4 bg-gray-700 rounded mr-4 animate-pulse"></div>
                ))}
            </div>

            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex p-4 border-b border-gray-800/50">
                    {Array.from({ length: cols }).map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className="flex-1 h-3 bg-gray-700 rounded mr-4 animate-pulse"
                            style={{ animationDelay: `${(rowIndex + colIndex) * 0.1}s` }}
                        ></div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export function SkeletonGrid({ items = 6, cols = 3 }) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-6`}>
            {Array.from({ length: items }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}

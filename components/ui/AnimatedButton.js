"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader } from 'lucide-react';

const AnimatedButton = ({
    children,
    variant = "primary",
    size = "default",
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    className = "",
    onClick,
    href,
    ...props
}) => {
    const variants = {
        primary: {
            bg: "bg-gradient-to-r from-blue-600 to-purple-600",
            hover: "hover:from-blue-700 hover:to-purple-700",
            text: "text-white",
            shadow: "shadow-lg shadow-blue-500/25"
        },
        secondary: {
            bg: "bg-gray-800 border border-gray-700",
            hover: "hover:bg-gray-700",
            text: "text-white",
            shadow: "shadow-lg shadow-gray-900/25"
        },
        outline: {
            bg: "border-2 border-blue-600 bg-transparent",
            hover: "hover:bg-blue-600",
            text: "text-blue-600 hover:text-white",
            shadow: "shadow-lg shadow-blue-500/10"
        },
        ghost: {
            bg: "bg-transparent hover:bg-white/10",
            hover: "",
            text: "text-gray-300 hover:text-white",
            shadow: ""
        },
        danger: {
            bg: "bg-gradient-to-r from-red-600 to-red-700",
            hover: "hover:from-red-700 hover:to-red-800",
            text: "text-white",
            shadow: "shadow-lg shadow-red-500/25"
        },
        success: {
            bg: "bg-gradient-to-r from-green-600 to-green-700",
            hover: "hover:from-green-700 hover:to-green-800",
            text: "text-white",
            shadow: "shadow-lg shadow-green-500/25"
        }
    };

    const sizes = {
        small: "px-3 py-1.5 text-sm",
        default: "px-6 py-3 text-base",
        large: "px-8 py-4 text-lg",
        xl: "px-10 py-5 text-xl"
    };

    const currentVariant = variants[variant];
    const currentSize = sizes[size];

    const buttonContent = (
        <motion.button
            className={`
                relative inline-flex items-center justify-center font-medium rounded-xl
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
                disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden
                ${currentVariant.bg} ${currentVariant.hover} ${currentVariant.text} ${currentVariant.shadow}
                ${currentSize} ${className}
            `}
            disabled={disabled || loading}
            onClick={onClick}
            whileHover={{
                scale: disabled ? 1 : 1.02,
                boxShadow: disabled ? undefined : "0 20px 40px -12px rgba(0, 0, 0, 0.25)"
            }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            {...props}
        >
            {/* Background Animation */}
            <motion.div
                className="absolute inset-0 bg-white/10 opacity-0"
                whileHover={{ opacity: disabled ? 0 : 1 }}
                transition={{ duration: 0.3 }}
            />

            {/* Ripple Effect */}
            <motion.div
                className="absolute inset-0 rounded-xl"
                initial={{ scale: 0, opacity: 0.6 }}
                whileTap={{ scale: 1, opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    background: "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)"
                }}
            />

            {/* Content */}
            <div className="relative flex items-center space-x-2">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center space-x-2"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Loader size={16} />
                            </motion.div>
                            <span>Loading...</span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center space-x-2"
                        >
                            {leftIcon && (
                                <motion.div
                                    whileHover={{ x: -2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {leftIcon}
                                </motion.div>
                            )}
                            <span className="font-inter font-medium">{children}</span>
                            {rightIcon && (
                                <motion.div
                                    whileHover={{ x: 2 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {rightIcon}
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Gradient Border Animation */}
            {variant === 'outline' && (
                <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{
                        background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
                        opacity: 0,
                        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        maskComposite: "subtract"
                    }}
                    whileHover={{ opacity: 0.3 }}
                    transition={{ duration: 0.3 }}
                />
            )}
        </motion.button>
    );

    if (href) {
        return (
            <a href={href} className="inline-block">
                {buttonContent}
            </a>
        );
    }

    return buttonContent;
};

// Specialized button variants
export const PrimaryButton = (props) => <AnimatedButton variant="primary" {...props} />;
export const SecondaryButton = (props) => <AnimatedButton variant="secondary" {...props} />;
export const OutlineButton = (props) => <AnimatedButton variant="outline" {...props} />;
export const GhostButton = (props) => <AnimatedButton variant="ghost" {...props} />;
export const DangerButton = (props) => <AnimatedButton variant="danger" {...props} />;
export const SuccessButton = (props) => <AnimatedButton variant="success" {...props} />;

export default AnimatedButton;

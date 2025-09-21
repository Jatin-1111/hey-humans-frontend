"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ExternalLink } from 'lucide-react';

const InteractiveCard = ({
    title,
    subtitle,
    value,
    icon: Icon,
    color = "blue",
    trend,
    onClick,
    href,
    className = "",
    size = "default",
    variant = "default"
}) => {
    const colorSchemes = {
        blue: {
            bg: "from-blue-500/10 to-blue-600/5",
            border: "border-blue-500/20",
            text: "text-blue-400",
            accent: "text-blue-300",
            glow: "shadow-blue-500/20"
        },
        green: {
            bg: "from-green-500/10 to-green-600/5",
            border: "border-green-500/20",
            text: "text-green-400",
            accent: "text-green-300",
            glow: "shadow-green-500/20"
        },
        purple: {
            bg: "from-purple-500/10 to-purple-600/5",
            border: "border-purple-500/20",
            text: "text-purple-400",
            accent: "text-purple-300",
            glow: "shadow-purple-500/20"
        },
        yellow: {
            bg: "from-yellow-500/10 to-yellow-600/5",
            border: "border-yellow-500/20",
            text: "text-yellow-400",
            accent: "text-yellow-300",
            glow: "shadow-yellow-500/20"
        },
        red: {
            bg: "from-red-500/10 to-red-600/5",
            border: "border-red-500/20",
            text: "text-red-400",
            accent: "text-red-300",
            glow: "shadow-red-500/20"
        }
    };

    const sizes = {
        small: "p-4",
        default: "p-6",
        large: "p-8"
    };

    const scheme = colorSchemes[color];
    const isClickable = onClick || href;

    const cardContent = (
        <motion.div
            className={`
                relative overflow-hidden rounded-xl bg-gradient-to-br ${scheme.bg} 
                border ${scheme.border} backdrop-blur-sm ${sizes[size]} ${className}
                ${isClickable ? 'cursor-pointer group' : ''}
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={isClickable ? {
                scale: 1.02,
                borderColor: scheme.text.replace('text-', 'border-'),
                boxShadow: `0 20px 40px -12px ${scheme.glow.replace('shadow-', '').replace('/20', '')}`
            } : {}}
            whileTap={isClickable ? { scale: 0.98 } : {}}
            transition={{ duration: 0.2 }}
            onClick={onClick}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, ${scheme.text.replace('text-', '').replace('-400', '')} 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        {Icon && (
                            <motion.div
                                className={`p-2 rounded-lg bg-white/5 ${scheme.text}`}
                                whileHover={{ rotate: 5, scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Icon size={size === 'large' ? 28 : size === 'small' ? 20 : 24} />
                            </motion.div>
                        )}

                        <div>
                            <h3 className={`font-semibold ${scheme.text} font-outfit text-lg`}>
                                {title}
                            </h3>
                            {subtitle && (
                                <p className="text-gray-400 text-sm font-inter">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    {isClickable && (
                        <motion.div
                            className={`${scheme.text} opacity-0 group-hover:opacity-100 transition-opacity`}
                            whileHover={{ x: 5 }}
                        >
                            {href ? <ExternalLink size={16} /> : <ChevronRight size={16} />}
                        </motion.div>
                    )}
                </div>

                {/* Value */}
                {value && (
                    <motion.div
                        className="mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className={`text-3xl font-bold ${scheme.accent} font-geist`}>
                            {value}
                        </span>
                    </motion.div>
                )}

                {/* Trend */}
                {trend && (
                    <motion.div
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className={`flex items-center text-sm ${trend.direction === 'up' ? 'text-green-400' :
                                trend.direction === 'down' ? 'text-red-400' :
                                    'text-gray-400'
                            }`}>
                            <span className="font-medium font-inter">{trend.value}</span>
                            <span className="ml-1 text-xs">{trend.label}</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Hover Effect Overlay */}
            {isClickable && (
                <motion.div
                    className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                />
            )}

            {/* Animated Border */}
            <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                    background: `linear-gradient(90deg, transparent, ${scheme.text.replace('text-', '').replace('-400', '')}, transparent)`,
                    opacity: 0
                }}
                whileHover={{ opacity: 0.3 }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );

    if (href) {
        return (
            <a href={href} className="block">
                {cardContent}
            </a>
        );
    }

    return cardContent;
};

export default InteractiveCard;

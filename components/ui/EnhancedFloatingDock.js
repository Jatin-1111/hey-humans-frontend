"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import Tooltip from './Tooltip';

const EnhancedFloatingDock = ({
    items = [],
    className = "",
    direction = "middle",
    size = "default"
}) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [isDockExpanded, setIsDockExpanded] = useState(false);
    const mouseX = useMotionValue(Infinity);
    const dockRef = useRef(null);

    const sizeConfig = {
        small: {
            itemSize: 40,
            expandedSize: 60,
            iconSize: 20,
            gap: 8
        },
        default: {
            itemSize: 50,
            expandedSize: 70,
            iconSize: 24,
            gap: 12
        },
        large: {
            itemSize: 60,
            expandedSize: 80,
            iconSize: 28,
            gap: 16
        }
    };

    const config = sizeConfig[size];

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (dockRef.current) {
                const rect = dockRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                mouseX.set(e.clientX - centerX);
            }
        };

        const handleMouseLeave = () => {
            mouseX.set(Infinity);
            setIsDockExpanded(false);
        };

        const dockElement = dockRef.current;
        if (dockElement) {
            dockElement.addEventListener('mousemove', handleMouseMove);
            dockElement.addEventListener('mouseleave', handleMouseLeave);
            dockElement.addEventListener('mouseenter', () => setIsDockExpanded(true));

            return () => {
                dockElement.removeEventListener('mousemove', handleMouseMove);
                dockElement.removeEventListener('mouseleave', handleMouseLeave);
                dockElement.removeEventListener('mouseenter', () => setIsDockExpanded(true));
            };
        }
    }, [mouseX]);

    return (
        <motion.div
            ref={dockRef}
            className={`relative flex items-end justify-center ${className}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {/* Background */}
            <motion.div
                className="absolute inset-0 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
                animate={{
                    scale: isDockExpanded ? 1.05 : 1,
                    borderColor: isDockExpanded ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)"
                }}
                transition={{ duration: 0.3 }}
            />

            {/* Dock Items */}
            <div
                className={`relative flex items-end px-4 py-3`}
                style={{ gap: `${config.gap}px` }}
            >
                {items.map((item, index) => (
                    <DockItem
                        key={item.title}
                        item={item}
                        index={index}
                        mouseX={mouseX}
                        hoveredIndex={hoveredIndex}
                        setHoveredIndex={setHoveredIndex}
                        config={config}
                    />
                ))}
            </div>
        </motion.div>
    );
};

const DockItem = ({ item, index, mouseX, hoveredIndex, setHoveredIndex, config }) => {
    const itemRef = useRef(null);
    const distance = useTransform(mouseX, (val) => {
        const bounds = itemRef.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [config.itemSize, config.expandedSize, config.itemSize]);
    const heightSync = useTransform(distance, [-150, 0, 150], [config.itemSize, config.expandedSize, config.itemSize]);

    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });
    const height = useSpring(heightSync, { mass: 0.1, stiffness: 150, damping: 12 });

    const IconComponent = item.icon;

    return (
        <Tooltip content={item.title} side="top">
            <motion.div
                ref={itemRef}
                className="relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
            >
                <Link href={item.href || '#'}>
                    <motion.div
                        style={{ width, height }}
                        className="relative flex items-center justify-center rounded-xl bg-gradient-to-t from-gray-800 to-gray-700 border border-gray-600 cursor-pointer overflow-hidden group"
                        whileHover={{
                            scale: 1.1,
                            rotateY: 5,
                            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        {/* Gradient Overlay */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100"
                            transition={{ duration: 0.3 }}
                        />

                        {/* Icon */}
                        <motion.div
                            animate={{
                                scale: hoveredIndex === index ? 1.2 : 1,
                                rotate: hoveredIndex === index ? [0, -10, 10, 0] : 0
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            {typeof IconComponent === 'function' ? (
                                <IconComponent size={config.iconSize} className="text-white group-hover:text-blue-300 transition-colors" />
                            ) : (
                                React.cloneElement(IconComponent, {
                                    size: config.iconSize,
                                    className: "text-white group-hover:text-blue-300 transition-colors"
                                })
                            )}
                        </motion.div>

                        {/* Ripple Effect */}
                        <AnimatePresence>
                            {hoveredIndex === index && (
                                <motion.div
                                    className="absolute inset-0 rounded-xl"
                                    initial={{ scale: 0, opacity: 0.6 }}
                                    animate={{ scale: 1, opacity: 0 }}
                                    exit={{ scale: 1.2, opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                    style={{
                                        background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)"
                                    }}
                                />
                            )}
                        </AnimatePresence>

                        {/* Notification Badge */}
                        {item.badge && (
                            <motion.div
                                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.2 }}
                            >
                                {typeof item.badge === 'number' ? item.badge : '!'}
                            </motion.div>
                        )}

                        {/* Active Indicator */}
                        {item.active && (
                            <motion.div
                                className="absolute bottom-0 left-1/2 w-1 h-1 bg-blue-400 rounded-full"
                                initial={{ scale: 0, x: "-50%" }}
                                animate={{ scale: 1, x: "-50%" }}
                                style={{ originX: 0.5 }}
                            />
                        )}
                    </motion.div>
                </Link>

                {/* Reflection Effect */}
                <motion.div
                    className="absolute top-full left-0 right-0 h-8 opacity-20 pointer-events-none"
                    style={{
                        background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 0%, transparent 100%)",
                        transform: "scaleY(-1)",
                        borderRadius: "0 0 12px 12px"
                    }}
                />
            </motion.div>
        </Tooltip>
    );
};

export default EnhancedFloatingDock;

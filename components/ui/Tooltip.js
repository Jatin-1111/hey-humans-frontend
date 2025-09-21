"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

export const Tooltip = ({
    children,
    content,
    side = "top",
    align = "center",
    delay = 300,
    className = ""
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const triggerRef = useRef(null);
    const timeoutRef = useRef(null);

    const calculatePosition = () => {
        if (!triggerRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipOffset = 10;

        let x = triggerRect.left + triggerRect.width / 2;
        let y = triggerRect.top;

        switch (side) {
            case 'top':
                y = triggerRect.top - tooltipOffset;
                break;
            case 'bottom':
                y = triggerRect.bottom + tooltipOffset;
                break;
            case 'left':
                x = triggerRect.left - tooltipOffset;
                y = triggerRect.top + triggerRect.height / 2;
                break;
            case 'right':
                x = triggerRect.right + tooltipOffset;
                y = triggerRect.top + triggerRect.height / 2;
                break;
        }

        setPosition({ x, y });
    };

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => {
            calculatePosition();
            setIsVisible(true);
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const getTransformOrigin = () => {
        switch (side) {
            case 'top':
                return 'bottom center';
            case 'bottom':
                return 'top center';
            case 'left':
                return 'right center';
            case 'right':
                return 'left center';
            default:
                return 'center';
        }
    };

    const getInitialPosition = () => {
        switch (side) {
            case 'top':
                return { y: 10, opacity: 0 };
            case 'bottom':
                return { y: -10, opacity: 0 };
            case 'left':
                return { x: 10, opacity: 0 };
            case 'right':
                return { x: -10, opacity: 0 };
            default:
                return { opacity: 0 };
        }
    };

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={showTooltip}
                onMouseLeave={hideTooltip}
                onFocus={showTooltip}
                onBlur={hideTooltip}
            >
                {children}
            </div>

            {typeof window !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isVisible && content && (
                        <motion.div
                            className={`fixed z-[9999] pointer-events-none ${className}`}
                            style={{
                                left: side === 'left' ? position.x - 8 : side === 'right' ? position.x + 8 : position.x,
                                top: side === 'top' ? position.y - 8 : side === 'bottom' ? position.y + 8 : position.y,
                                transform: side === 'top' || side === 'bottom'
                                    ? 'translateX(-50%)'
                                    : side === 'left' || side === 'right'
                                        ? 'translateY(-50%)'
                                        : 'translate(-50%, -50%)',
                                transformOrigin: getTransformOrigin()
                            }}
                            initial={getInitialPosition()}
                            animate={{
                                x: 0,
                                y: 0,
                                opacity: 1,
                                scale: 1
                            }}
                            exit={getInitialPosition()}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                                duration: 0.15
                            }}
                        >
                            <div className="relative">
                                {/* Tooltip Content */}
                                <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-xl border border-gray-700 backdrop-blur-sm bg-opacity-95 font-inter font-medium whitespace-nowrap">
                                    {content}
                                </div>

                                {/* Arrow */}
                                <div
                                    className="absolute w-2 h-2 bg-gray-900 border border-gray-700 transform rotate-45"
                                    style={{
                                        left: side === 'top' || side === 'bottom' ? '50%' : side === 'left' ? '100%' : '-4px',
                                        top: side === 'left' || side === 'right' ? '50%' : side === 'top' ? '100%' : '-4px',
                                        transform: `translate(-50%, -50%) rotate(45deg)`,
                                        borderColor: side === 'top' ? 'transparent transparent #374151 #374151' :
                                            side === 'bottom' ? '#374151 #374151 transparent transparent' :
                                                side === 'left' ? 'transparent #374151 #374151 transparent' :
                                                    '#374151 transparent transparent #374151'
                                    }}
                                />

                                {/* Glow Effect */}
                                <div
                                    className="absolute inset-0 bg-blue-500 opacity-20 blur-md rounded-lg -z-10"
                                    style={{
                                        transform: 'scale(1.1)'
                                    }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default Tooltip;

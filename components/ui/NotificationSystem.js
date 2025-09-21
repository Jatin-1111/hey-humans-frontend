"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((notification) => {
        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            type: 'info',
            duration: 5000,
            ...notification
        };

        setNotifications(prev => [...prev, newNotification]);

        // Auto remove notification after duration
        if (newNotification.duration > 0) {
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, newNotification.duration);
        }

        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const value = {
        notifications,
        addNotification,
        removeNotification,
        clearAll,
        // Helper methods
        success: (message, options) => addNotification({ type: 'success', message, ...options }),
        error: (message, options) => addNotification({ type: 'error', message, duration: 0, ...options }),
        warning: (message, options) => addNotification({ type: 'warning', message, ...options }),
        info: (message, options) => addNotification({ type: 'info', message, ...options }),
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationContainer />
        </NotificationContext.Provider>
    );
};

const NotificationContainer = () => {
    const { notifications, removeNotification } = useNotifications();

    return (
        <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm w-full">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRemove={() => removeNotification(notification.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

const NotificationItem = ({ notification, onRemove }) => {
    const { type, title, message, action } = notification;

    const icons = {
        success: CheckCircle,
        error: AlertCircle,
        warning: AlertTriangle,
        info: Info
    };

    const colors = {
        success: {
            bg: 'from-green-500/10 to-green-600/5',
            border: 'border-green-500/20',
            icon: 'text-green-400',
            title: 'text-green-300'
        },
        error: {
            bg: 'from-red-500/10 to-red-600/5',
            border: 'border-red-500/20',
            icon: 'text-red-400',
            title: 'text-red-300'
        },
        warning: {
            bg: 'from-yellow-500/10 to-yellow-600/5',
            border: 'border-yellow-500/20',
            icon: 'text-yellow-400',
            title: 'text-yellow-300'
        },
        info: {
            bg: 'from-blue-500/10 to-blue-600/5',
            border: 'border-blue-500/20',
            icon: 'text-blue-400',
            title: 'text-blue-300'
        }
    };

    const IconComponent = icons[type];
    const colorScheme = colors[type];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: -50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`
                relative overflow-hidden rounded-xl bg-gradient-to-br ${colorScheme.bg}
                border ${colorScheme.border} backdrop-blur-sm p-4 shadow-xl
                hover:scale-105 transition-transform duration-200
            `}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 50% 50%, ${colorScheme.icon.replace('text-', '').replace('-400', '')} 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                    }}
                />
            </div>

            <div className="relative flex items-start space-x-3">
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                    className={`${colorScheme.icon} flex-shrink-0 mt-0.5`}
                >
                    <IconComponent size={20} />
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {title && (
                        <h4 className={`text-sm font-semibold ${colorScheme.title} font-outfit mb-1`}>
                            {title}
                        </h4>
                    )}
                    <p className="text-sm text-gray-300 font-inter leading-relaxed">
                        {message}
                    </p>

                    {/* Action Button */}
                    {action && (
                        <motion.button
                            className={`mt-2 text-xs ${colorScheme.icon} hover:underline font-medium`}
                            onClick={action.onClick}
                            whileHover={{ x: 2 }}
                            transition={{ duration: 0.2 }}
                        >
                            {action.label}
                        </motion.button>
                    )}
                </div>

                {/* Close Button */}
                <motion.button
                    className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                    onClick={onRemove}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <X size={18} />
                </motion.button>
            </div>

            {/* Progress Bar for timed notifications */}
            {notification.duration > 0 && (
                <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-white/20"
                    initial={{ width: "100%" }}
                    animate={{ width: "0%" }}
                    transition={{ duration: notification.duration / 1000, ease: "linear" }}
                />
            )}
        </motion.div>
    );
};

export default NotificationProvider;

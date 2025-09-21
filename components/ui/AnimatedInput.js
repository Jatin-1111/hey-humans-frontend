"use client";
import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle, Search, Calendar } from 'lucide-react';

const AnimatedInput = forwardRef(({
    label,
    type = "text",
    placeholder,
    error,
    success,
    leftIcon,
    rightIcon,
    className = "",
    required = false,
    disabled = false,
    ...props
}, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleInputChange = (e) => {
        setHasValue(e.target.value.length > 0);
        if (props.onChange) {
            props.onChange(e);
        }
    };

    const inputType = type === 'password' && showPassword ? 'text' : type;

    const getStateColors = () => {
        if (error) return {
            border: 'border-red-500/50 focus:border-red-500',
            text: 'text-red-400',
            bg: 'bg-red-500/5'
        };
        if (success) return {
            border: 'border-green-500/50 focus:border-green-500',
            text: 'text-green-400',
            bg: 'bg-green-500/5'
        };
        return {
            border: 'border-gray-700 focus:border-blue-500',
            text: 'text-blue-400',
            bg: 'bg-gray-800/50'
        };
    };

    const stateColors = getStateColors();

    return (
        <div className={`relative ${className}`}>
            {/* Label */}
            {label && (
                <motion.label
                    className={`block text-sm font-medium mb-2 font-outfit transition-colors ${error ? 'text-red-400' : success ? 'text-green-400' : 'text-gray-300'
                        }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {label}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </motion.label>
            )}

            <div className="relative">
                {/* Input Container */}
                <motion.div
                    className={`
                        relative flex items-center rounded-xl border transition-all duration-200
                        ${stateColors.border} ${stateColors.bg} backdrop-blur-sm
                        ${focused ? 'shadow-lg shadow-blue-500/20' : ''}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* Left Icon */}
                    {leftIcon && (
                        <motion.div
                            className={`absolute left-3 ${stateColors.text} z-10`}
                            animate={{ scale: focused ? 1.1 : 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            {leftIcon}
                        </motion.div>
                    )}

                    {/* Input */}
                    <input
                        ref={ref}
                        type={inputType}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={`
                            w-full px-4 py-3 bg-transparent text-white placeholder-gray-400 
                            focus:outline-none font-inter
                            ${leftIcon ? 'pl-12' : 'pl-4'}
                            ${(rightIcon || type === 'password') ? 'pr-12' : 'pr-4'}
                            ${disabled ? 'cursor-not-allowed' : ''}
                        `}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        onChange={handleInputChange}
                        {...props}
                    />

                    {/* Right Icon / Password Toggle */}
                    <div className="absolute right-3 flex items-center space-x-2">
                        {type === 'password' && (
                            <motion.button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-white transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </motion.button>
                        )}

                        {rightIcon && !type === 'password' && (
                            <motion.div
                                className={stateColors.text}
                                animate={{ scale: focused ? 1.1 : 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                {rightIcon}
                            </motion.div>
                        )}

                        {/* Status Icons */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="text-red-400"
                                >
                                    <AlertCircle size={20} />
                                </motion.div>
                            )}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="text-green-400"
                                >
                                    <CheckCircle size={20} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Focus Ring */}
                    <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-blue-500 opacity-0 pointer-events-none"
                        animate={{ opacity: focused ? 0.3 : 0 }}
                        transition={{ duration: 0.2 }}
                    />
                </motion.div>

                {/* Floating Label Effect */}
                {label && (
                    <AnimatePresence>
                        {(focused || hasValue) && (
                            <motion.div
                                initial={{ opacity: 0, y: 0, scale: 1 }}
                                animate={{ opacity: 1, y: -28, scale: 0.8 }}
                                exit={{ opacity: 0, y: 0, scale: 1 }}
                                className={`
                                    absolute left-3 px-2 bg-gray-900 text-xs font-medium rounded
                                    ${stateColors.text} pointer-events-none
                                `}
                                style={{ zIndex: 10 }}
                            >
                                {label}
                                {required && <span className="text-red-400 ml-1">*</span>}
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>

            {/* Error/Success Message */}
            <AnimatePresence>
                {(error || success) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2"
                    >
                        <p className={`text-sm font-inter ${error ? 'text-red-400' : 'text-green-400'}`}>
                            {error || success}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

AnimatedInput.displayName = 'AnimatedInput';

// Specialized input components
export const SearchInput = (props) => (
    <AnimatedInput leftIcon={<Search size={20} />} placeholder="Search..." {...props} />
);

export const DateInput = (props) => (
    <AnimatedInput type="date" leftIcon={<Calendar size={20} />} {...props} />
);

export const PasswordInput = (props) => (
    <AnimatedInput type="password" {...props} />
);

export default AnimatedInput;

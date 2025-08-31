const FooterSection = () => {
    return (
        <footer className="bg-black text-white border-t border-gray-800" role="contentinfo">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
                {/* Brand / Heading - Space Grotesk for brand consistency */}
                <div className="text-center mb-12 sm:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent text-balance font-space tracking-tight leading-tight">
                        Hey Humanz
                    </h2>

                    {/* CTA - Outfit for section headers */}
                    <div className="mt-4 sm:mt-6">
                        <a
                            href="#"
                            className="inline-block text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-white hover:text-gray-300 transition-colors duration-300 underline underline-offset-4 decoration-gray-700 hover:decoration-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm font-outfit"
                        >
                            Start Your Creative Journey →<span className="sr-only">, navigate to start</span>
                        </a>
                    </div>
                </div>

                {/* Link groups - Mobile Optimized Grid */}
                <div className="mb-12 sm:mb-16 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
                    {/* Product Column */}
                    <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-300 tracking-wide uppercase font-geist">Product</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <li>
                                <a href="#features" className="text-gray-400 hover:text-white transition-colors font-inter text-sm sm:text-base block py-1">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#pricing" className="text-gray-400 hover:text-white transition-colors font-inter text-sm sm:text-base block py-1">
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a href="#showcase" className="text-gray-400 hover:text-white transition-colors font-inter text-sm sm:text-base block py-1">
                                    Showcase
                                </a>
                            </li>
                            <li>
                                <a href="#updates" className="text-gray-400 hover:text-white transition-colors font-inter text-sm sm:text-base block py-1">
                                    Updates
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-300 tracking-wide uppercase font-geist">Company</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <li>
                                <a href="#about" className="text-gray-400 hover:text-white transition-colors font-inter text-sm sm:text-base block py-1">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#careers" className="text-gray-400 hover:text-white transition-colors font-inter text-sm sm:text-base block py-1">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#press" className="text-gray-400 hover:text-white transition-colors font-inter text-sm sm:text-base block py-1">
                                    Press
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className="text-gray-400 hover:text-white transition-colors font-inter text-sm sm:text-base block py-1">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-300 tracking-wide uppercase font-geist">Resources</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <li>
                                <a href="#docs" className="text-gray-400 hover:text-white transition-colors font-inter text-sm sm:text-base block py-1">
                                    Docs
                                </a>
                            </li>
                            <li>
                                <a href="#guides" className="text-gray-400 hover:text-white transition-colors font-inter text-sm sm:text-base block py-1">
                                    Guides
                                </a>
                            </li>
                            <li>
                                <a href="#community" className="text-gray-400 hover:text-white transition-colors font-inter text-sm sm:text-base block py-1">
                                    Community
                                </a>
                            </li>
                            <li>
                                <a href="#support" className="text-gray-400 hover:text-white transition-colors font-inter text-sm sm:text-base block py-1">
                                    Support
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Column */}
                    <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-300 tracking-wide uppercase font-geist">Legal</h3>
                        <ul className="space-y-2 sm:space-y-3">
                            <li>
                                <a href="#privacy" className="text-gray-400 hover:text-white transition-colors font-inter text-sm sm:text-base block py-1">
                                    Privacy
                                </a>
                            </li>
                            <li>
                                <a href="#terms" className="text-gray-400 hover:text-white transition-colors font-inter text-sm sm:text-base block py-1">
                                    Terms
                                </a>
                            </li>
                            <li>
                                <a href="#cookies" className="text-gray-400 hover:text-white transition-colors font-inter text-sm sm:text-base block py-1">
                                    Cookies
                                </a>
                            </li>
                            <li>
                                <a href="#security" className="text-gray-400 hover:text-white transition-colors font-inter text-sm sm:text-base block py-1">
                                    Security
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter Signup - Mobile Optimized */}
                <div className="mb-12 sm:mb-16 bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
                    <div className="text-center max-w-2xl mx-auto">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 sm:mb-3 font-outfit">
                            Stay Updated
                        </h3>
                        <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 font-inter leading-relaxed">
                            Get the latest updates on new features, marketplace opportunities, and industry insights.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/40 font-inter text-sm sm:text-base"
                            />
                            <button className="px-6 py-3 bg-white text-black rounded-full font-geist font-semibold hover:bg-gray-200 transition-colors text-sm sm:text-base whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default FooterSection;
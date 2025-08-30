const FooterSection = () => {
    return (
        <footer className="bg-black text-white border-t border-gray-800" role="contentinfo">
            <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
                {/* Brand / Heading (references main section style) */}
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent text-balance">
                        Hey Humanz
                    </h2>

                    {/* CTA (from the provided snippet, adapted to footer context) */}
                    <div className="mt-6">
                        <a
                            href="#"
                            className="inline-block text-lg md:text-xl font-medium text-white hover:text-gray-300 transition-colors duration-300 underline underline-offset-4 decoration-gray-700 hover:decoration-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm"
                        >
                            Start Your Creative Journey →<span className="sr-only">, navigate to start</span>
                        </a>
                    </div>
                </div>

                {/* Link groups */}
                <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 tracking-wide uppercase">Product</h3>
                        <ul className="mt-3 space-y-2">
                            <li>
                                <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a href="#showcase" className="text-gray-400 hover:text-white transition-colors">
                                    Showcase
                                </a>
                            </li>
                            <li>
                                <a href="#updates" className="text-gray-400 hover:text-white transition-colors">
                                    Updates
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 tracking-wide uppercase">Company</h3>
                        <ul className="mt-3 space-y-2">
                            <li>
                                <a href="#about" className="text-gray-400 hover:text-white transition-colors">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#careers" className="text-gray-400 hover:text-white transition-colors">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#press" className="text-gray-400 hover:text-white transition-colors">
                                    Press
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 tracking-wide uppercase">Resources</h3>
                        <ul className="mt-3 space-y-2">
                            <li>
                                <a href="#docs" className="text-gray-400 hover:text-white transition-colors">
                                    Docs
                                </a>
                            </li>
                            <li>
                                <a href="#guides" className="text-gray-400 hover:text-white transition-colors">
                                    Guides
                                </a>
                            </li>
                            <li>
                                <a href="#community" className="text-gray-400 hover:text-white transition-colors">
                                    Community
                                </a>
                            </li>
                            <li>
                                <a href="#support" className="text-gray-400 hover:text-white transition-colors">
                                    Support
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-300 tracking-wide uppercase">Legal</h3>
                        <ul className="mt-3 space-y-2">
                            <li>
                                <a href="#privacy" className="text-gray-400 hover:text-white transition-colors">
                                    Privacy
                                </a>
                            </li>
                            <li>
                                <a href="#terms" className="text-gray-400 hover:text-white transition-colors">
                                    Terms
                                </a>
                            </li>
                            <li>
                                <a href="#cookies" className="text-gray-400 hover:text-white transition-colors">
                                    Cookies
                                </a>
                            </li>
                            <li>
                                <a href="#security" className="text-gray-400 hover:text-white transition-colors">
                                    Security
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 md:mt-16 border-t border-gray-800 pt-6 md:flex md:items-center md:justify-between">
                    <p className="text-sm text-gray-400">© {new Date().getFullYear()} Hey Humanz. All rights reserved.</p>
                    <nav aria-label="Footer navigation" className="mt-4 md:mt-0">
                        <ul className="flex items-center gap-4">
                            <li>
                                <a href="#status" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Status
                                </a>
                            </li>
                            <li>
                                <a href="#roadmap" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Roadmap
                                </a>
                            </li>
                            <li>
                                <a href="#changelog" className="text-sm text-gray-400 hover:text-white transition-colors">
                                    Changelog
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>
    )
}

export default FooterSection;
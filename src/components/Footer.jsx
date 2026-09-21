import React from "react";
import { Blocks, ArrowRight } from "lucide-react";

const footerLinks = [
  {
    heading: "Product",
    links: ["Platform", "Features", "Use Cases", "Pricing"],
  },
  {
    heading: "Company",
    links: ["About", "Blog", "Careers", "Contact"],
  },
  {
    heading: "Support",
    links: ["Docs", "FAQ", "Community", "Status"],
  },
];

const Footer = () => {
  return (
    <footer className="w-full bg-slate-50 pt-12 sm:pt-16 lg:pt-24 xl:pt-32">
      {/* CTA Section */}
      <div className="cont w-full mb-12 sm:mb-16 lg:mb-20 xl:mb-28">
        <div className="w-full max-w-5xl mx-auto bg-secondary rounded-3xl sm:rounded-[2rem] lg:rounded-[2.5rem] p-6 sm:p-10 lg:p-16 flex flex-col items-center text-center gap-4 sm:gap-6 shadow-2xl shadow-secondary/20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight tracking-tight">
            Ready to plan <span className="text-primary">smarter?</span>
          </h2>
          <p className="text-white/60 text-sm sm:text-base lg:text-lg xl:text-xl max-w-xl leading-relaxed px-2">
            Join forward-thinking teams using Cortex to structure, map, and ship
            their software products with total clarity.
          </p>
          <a
            href="/auth"
            className="mt-4 px-8 py-4 bg-primary text-secondary rounded-full font-bold tracking-wide flex items-center gap-3 hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-xl"
          >
            Start your free project
            <ArrowRight size={20} />
          </a>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="border-t border-slate-100 bg-white">
        <div className="cont w-full py-10 sm:py-12 lg:py-16 xl:py-20">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-8 mb-10 sm:mb-12 lg:mb-16 xl:mb-20">
            <div className="sm:col-span-2 md:col-span-1 flex flex-col items-start">
              <a
                href="/"
                className="flex items-center gap-2 text-slate-900 text-lg font-bold mb-4 lg:mb-6"
              >
                <Blocks size={22} className="text-purple-600" />
                Cortex
              </a>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[250px]">
                Plan your next product with clarity. From idea to launch, Cortex
                keeps your team aligned and focused on what matters.
              </p>
            </div>
            {footerLinks.map((group) => (
              <div key={group.heading} className="flex flex-col">
                <h4 className="text-slate-900 text-sm font-bold mb-5 uppercase tracking-widest">
                  {group.heading}
                </h4>
                <ul className="flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="/"
                        className="text-sm text-slate-500 hover:text-purple-600 transition-colors duration-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs lg:text-sm text-slate-400 text-center md:text-left">
              &copy; {new Date().getFullYear()} Cortex. All rights reserved.
            </p>
            <div className="flex items-center gap-6 lg:gap-8">
              <a
                href="/"
                className="text-xs lg:text-sm text-slate-400 hover:text-slate-700 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/"
                className="text-xs lg:text-sm text-slate-400 hover:text-slate-700 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/"
                className="text-xs lg:text-sm text-slate-400 hover:text-slate-700 transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

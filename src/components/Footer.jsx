import React from "react";
import { Blocks } from "lucide-react";

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
    <footer className="w-full bg-background border-t border-white/5 py-16">
      <div className="cont w-full h-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <a
              href="/"
              className="tracking-wider flex items-center gap-2 font-light text-white mb-4"
            >
              <Blocks size={22} />
              Cortex
            </a>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Plan your next product with clarity. From idea to launch, Cortex
              keeps your team aligned.
            </p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.heading}>
              <h4 className="text-white text-sm font-semibold mb-4">
                {group.heading}
              </h4>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link}>
                    <a
                      href="/"
                      className="text-sm text-white/40 hover:text-white/80 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} Cortex. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Privacy Policy
            </a>
            <a href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

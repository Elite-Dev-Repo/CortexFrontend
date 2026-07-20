import React, { useState } from "react";
import HeroImage from "../assets/cortex-hero-.png";
import { ArrowRight, Blocks, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { ACCESS } from "@/lib/constants";

const Header = () => {
  const token = localStorage.getItem(ACCESS);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navLinks = [
    {
      name: "Platform",
      route: "/",
    },
    {
      name: "Features",
      route: "/",
    },
    {
      name: "Use cases",
      route: "/",
    },
    {
      name: token ? "Dashboard" : "Sign In",
      route: token ? "/dashboard" : "/auth",
    },
  ];

  return (
    <header className="bg-background w-screen min-h-screen lg:h-screen text-white overflow-hidden">
      <div className="w-full h-full cont relative flex flex-col">
        <nav className="w-full p-2 mt-3 lg:mt-6 mx-auto rounded-lg flex items-center justify-between gap-3">
          <div className="bg-foreground text-white px-4 py-2 h-full flex items-center rounded-sm z-10 shrink-0">
            <a
              href="/"
              className="tracking-wider flex items-center gap-2 font-light"
            >
              <Blocks size={22} />
              Cortex
            </a>
          </div>

          <div className="hidden lg:flex w-full h-full bg-foreground rounded-lg overflow-hidden p-1 z-10">
            <ul className="w-full flex items-center justify-between px-4">
              {navLinks.map((link) => {
                return (
                  <a
                    key={link.name}
                    href={link.route}
                    className={`hover:bg-white/5 text-sm px-4 py-2 rounded-sm whitespace-nowrap ${link.name == "Sign In" || link.name == "Dashboard" ? "bg-white text-background font-semibold hover:text-white" : ""}`}
                  >
                    <li>{link.name}</li>
                  </a>
                );
              })}
            </ul>
          </div>

          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-white z-10"
          >
            {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-foreground border border-white/10 rounded-lg p-2 mt-2 z-10"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.route}
                onClick={() => setMobileNavOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm ${link.name == "Sign In" || link.name == "Dashboard" ? "bg-white text-background font-semibold" : "text-white/80 hover:bg-white/5"}`}
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}

        <div className="absolute w-60 h-60 md:w-100 md:h-100 bg-white/10 rounded-full top-0 left-0 blur-3xl pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute -top-25 -right-20 overflow-hidden hidden lg:block"
        >
          <img src={HeroImage} className="w-180 opacity-50" alt="Hero Image" />
        </motion.div>

        <div className="flex-1 flex flex-col items-center gap-4 lg:gap-3 justify-center z-2 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center tracking-tight z-1"
          >
            Organize your project structure <br /> Build with a clear plan.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-white/60 z-1 text-sm sm:text-base max-w-xl"
          >
            Brainstorm, Structure your product ideas in a concise easy to read
            form. Real Time feature implemented for team collaborations.
          </motion.p>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            href="/auth"
            className="z-1"
          >
            <button className="pl-4 pr-2 py-1.5 bg-white text-background rounded-full tracking-wider flex items-center gap-5 text-sm lg:text-base">
              Start Free{" "}
              <span className="h-8 w-8 lg:h-10 lg:w-10 rounded-full flex items-center justify-center bg-primary text-white">
                <ArrowRight size={18} />
              </span>
            </button>
          </motion.a>
        </div>
      </div>
    </header>
  );
};

export default Header;

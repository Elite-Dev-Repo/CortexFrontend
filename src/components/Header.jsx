import React, { useState } from "react";
import HeroImage from "../assets/cortex-hero-.png";
import { ArrowRight, Blocks, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ACCESS } from "@/lib/constants";

const Header = () => {
  const token = localStorage.getItem(ACCESS);
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { name: "Platform", route: "/" },
    { name: "Features", route: "/" },
    { name: "Use cases", route: "/" },
    {
      name: token ? "Dashboard" : "Sign In",
      route: token ? "/dashboard" : "/auth",
    },
  ];

  return (
    <header className="bg-background w-full min-h-screen lg:h-screen text-white overflow-hidden flex flex-col">
      <div className="w-full flex-1 cont relative flex flex-col">
        <nav className="w-full lg:w-[80%] xl:w-[60%] p-2 mt-3 lg:mt-6 mx-auto rounded-lg flex items-center justify-between gap-2 lg:gap-5">
          <div className="bg-foreground text-white px-3 lg:px-4 py-1.5 lg:py-2 flex items-center rounded-sm z-20 shrink-0">
            <a
              href="/"
              className="tracking-wider flex items-center gap-2 font-light text-sm lg:text-base"
            >
              <Blocks size={20} />
              Cortex
            </a>
          </div>

          <div className="hidden lg:flex min-w-0 flex-1 bg-foreground rounded-lg p-1 z-20">
            <ul className="w-full flex items-center justify-between px-4 ">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.route}
                  className={`text-sm px-4 py-2 rounded-sm whitespace-nowrap ${link.name == "Sign In" || link.name == "Dashboard" ? "bg-white text-background font-semibold hover:bg-white/90" : "text-white hover:bg-white/5"}`}
                >
                  <li>{link.name}</li>
                </a>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-white z-20"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="lg:hidden bg-foreground border border-white/10 rounded-lg p-2 mt-2 z-10 relative"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.route}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm ${link.name == "Sign In" || link.name == "Dashboard" ? "bg-white text-background font-semibold" : "text-white/80 hover:bg-white/5"}`}
                >
                  {link.name}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute w-60 h-60 md:w-100 md:h-100 bg-white/10 rounded-full top-0 left-0 blur-3xl pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute -top-25 -right-20 overflow-hidden hidden lg:block"
        >
          <img src={HeroImage} className="w-180 opacity-50" alt="Hero Image" />
        </motion.div>
        <div className="w-full flex-1 flex flex-col items-center gap-3 justify-center z-2">
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
            className="text-center text-white/60 z-1 text-sm sm:text-base"
          >
            Brainstorm, Structure your product ideas in a concise easy to read
            form. <br /> Real Time feature implemented for team collaborations.
          </motion.p>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            href="/auth"
            className="z-1"
          >
            <button className="pl-4 px-2 py-1.5 bg-white text-background rounded-full tracking-wider flex items-center gap-5 text-sm lg:text-base">
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

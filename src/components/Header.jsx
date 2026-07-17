import React from "react";
import HeroImage from "../assets/cortex-hero-.png";
import { ArrowRight, Blocks, MoveRight } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
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
      name: "Sign In",
      route: "/",
    },
  ];

  return (
    <header className="bg-background w-screen h-screen text-white overflow-hidden">
      <div className="w-full h-full cont relative">
        <nav className="max-w-screen w-[60%] p-2 mt-6 mx-auto rounded-lg h-18 flex items-center justify-between gap-5">
          <div className="bg-foreground text-white px-4 py-2 h-full flex items-center rounded-sm z-1">
            <a
              href="/"
              className="tracking-wider flex items-center gap-2 font-light"
            >
              <Blocks size={22} />
              Cortex
            </a>
          </div>

          <div className="w-full flex item-center h-full bg-foreground rounded-lg overflow-hidden p-1 z-1">
            <ul className="w-full flex items-center justify-between px-4">
              {navLinks.map((link) => {
                return (
                  <a
                    href={link.route}
                    className={`hover:bg-white/5 text-sm px-4 py-2 rounded-sm ${link.name == "Sign In" ? "bg-white text-background font-semibold" : ""}`}
                  >
                    <li>{link.name}</li>
                  </a>
                );
              })}
            </ul>
          </div>
        </nav>
        <div className="absolute w-100 h-100 bg-white/10 rounded-full top-0 left-0 blur-3xl"></div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute -top-25 -right-20 overflow-hidden"
        >
          <img src={HeroImage} className="w-180 opacity-50" alt="Hero Image" />
        </motion.div>
        <div className="w-full h-full flex flex-col items-center gap-3 justify-center z-2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl text-center tracking-tight z-1"
          >
            Organize your project structure <br /> Build with a clear plan.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-white/60 z-1"
          >
            Brainstorm, Structure your product ideas in a concise easy to read
            form. <br /> Real Time feature implemented for team collaborations.
          </motion.p>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            href="/"
            className="z-1"
          >
            <button className="pl-4 px-2 py-1.5 bg-white text-background rounded-full tracking-wider flex items-center gap-5">
              Start Free{" "}
              <span className="h-10 w-10 rounded-full flex items-center justify-center bg-primary text-white">
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

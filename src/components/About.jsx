import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Layers, CheckCircle2 } from "lucide-react";

const About = () => {
  const points = [
    {
      title: "Structure Ideation",
      desc: "Break down any product idea into clear, manageable features before writing a single line of code.",
      icon: Sparkles,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Real-time Collaboration",
      desc: "Work with your team in real-time to define, refine, and align on project scope.",
      icon: Layers,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Track Implementation",
      desc: "Monitor progress across every feature and cross-reference planned vs implemented work.",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-24 xl:py-32 relative overflow-hidden">
      {/* Soft background shape */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-gradient-to-bl from-blue-50 via-purple-50 to-transparent rounded-full opacity-60 blur-3xl -z-10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <div className="cont w-full h-full flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 lg:gap-16 xl:gap-24 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="flex-1 w-full max-w-xl mx-auto lg:mx-0 flex flex-col items-start gap-6 justify-center"
        >
          <motion.div variants={itemVariants} className="inline-block">
            <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold tracking-widest uppercase">
              About Us
            </span>
          </motion.div>
          <motion.h2
            variants={itemVariants}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight"
          >
            Smart Solutions Designed to{" "}
            <span className="text-purple-600">Drive Your Success.</span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed mt-2"
          >
            We empower businesses with powerful tools to streamline operations,
            boost productivity, and accelerate growth. From brainstorming to
            tracking, Cortex keeps your team aligned and your builds focused.
          </motion.p>
          <motion.a
            variants={itemVariants}
            href="/"
            className="mt-6 inline-flex items-center gap-2 bg-primary text-secondary px-5 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity duration-300 shadow-sm"
          >
            Explore Platform &rarr;
          </motion.a>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="flex-1 w-full max-w-lg mx-auto lg:max-w-none flex flex-col gap-6"
        >
          {points.map((point, i) => {
            const Icon = point.icon;
            return (
              <motion.div
                variants={itemVariants}
                key={i}
                className="flex items-start gap-6 p-6 rounded-[1.5rem] bg-white border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary/50 transition-all duration-300 group"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${point.bg} ${point.color} flex items-center justify-center shrink-0`}
                >
                  <Icon size={26} />
                </div>
                <div className="space-y-2 mt-1">
                  <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-secondary transition-colors duration-300">
                    {point.title}
                  </h3>
                  <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default About;

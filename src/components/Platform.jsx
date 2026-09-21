import React from "react";
import { Lightbulb, GitFork, Users, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const capabilities = [
  {
    title: "Ideation & Brainstorming",
    desc: "Capture and organize product ideas in a structured format. Turn rough concepts into clear, actionable plans.",
    icon: Lightbulb,
    color: "text-amber-500",
    bg: "bg-amber-100",
  },
  {
    title: "Feature Mapping",
    desc: "Define and visualize every feature of your project — from authentication to real-time messaging and beyond.",
    icon: GitFork,
    color: "text-blue-500",
    bg: "bg-blue-100",
  },
  {
    title: "Team Collaboration",
    desc: "Work together in real-time. Assign ownership, leave feedback, and keep everyone aligned on the same vision.",
    icon: Users,
    color: "text-emerald-500",
    bg: "bg-emerald-100",
  },
  {
    title: "Progress Analytics",
    desc: "Track completion status across features with live metrics. Know exactly where your project stands.",
    icon: BarChart3,
    color: "text-purple-500",
    bg: "bg-purple-100",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const Platform = () => {
  return (
    <section className="w-full bg-slate-50 py-12 sm:py-16 lg:py-24 xl:py-32 relative">
      <div className="cont w-full h-full relative z-10">
        <div className="flex flex-col items-center gap-4 lg:gap-6 mb-10 sm:mb-12 lg:mb-16 xl:mb-24 text-center px-2">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="px-4 py-1.5 rounded-full bg-primary text-secondary text-xs font-bold tracking-widest uppercase"
          >
            Platform
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight"
          >
            Your Managers are Great. <br />
            <span className="bg-primary text-secondary px-3 rounded-xl">
              Cortex Makes Them Even Better.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-base md:text-lg leading-relaxed max-w-xl"
          >
            Enable managers to have more impact on the pipeline by giving them
            the right insights, at the right time, allowing your team to ship
            confidently.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto"
        >
          {capabilities.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                variants={itemVariants}
                key={i}
                className="bg-white rounded-2xl sm:rounded-3xl lg:rounded-[2rem] p-6 sm:p-8 lg:p-10 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)] transition-all duration-500 group flex flex-col gap-4 sm:gap-6"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500 ease-out`}
                >
                  <Icon size={28} className={item.color} />
                </div>
                <div>
                  <h3 className="text-slate-900 text-xl lg:text-2xl font-bold mb-3 tracking-tight group-hover:text-secondary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                    {item.desc}
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

export default Platform;

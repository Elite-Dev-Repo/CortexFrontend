import React from "react";
import { motion } from "framer-motion";
import { MousePointer2, Workflow, Search, CheckCircle } from "lucide-react";
import feature1 from "../assets/cortex-f-1.svg";
import feature2 from "../assets/cortex-f-2.svg";
import feature3 from "../assets/cortex-f-3.svg";
import feature4 from "../assets/cortex-f-4.svg";

const features = [
  {
    title: "Interactive Canvas",
    heading: "Visualize your product intuitively.",
    description:
      "Map out every feature from user authentication to push notifications seamlessly. Drag, drop, and connect features to see how they fit together in the grand scheme of your application.",
    icon: MousePointer2,
    color: "text-blue-500",
    bg: "bg-blue-50",
    illustrationBg: "bg-gradient-to-br from-blue-50 to-indigo-50",
    image: feature1,
  },
  {
    title: "Structural Clarity",
    heading: "Break down monolithic ideas.",
    description:
      "Break down monolithic ideas into actionable, bite-sized components. Give developers precisely what they need to start building immediately, avoiding scope creep.",
    icon: Search,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    illustrationBg: "bg-gradient-to-br from-emerald-50 to-teal-50",
    image: feature2,
  },
  {
    title: "Live Analytics",
    heading: "Track Progress at a Glance.",
    description:
      "Monitor development status across every feature. See which parts are pending, in-progress, or finalized in real-time. Keep stakeholders informed effortlessly.",
    icon: CheckCircle,
    color: "text-purple-500",
    bg: "bg-purple-50",
    illustrationBg: "bg-gradient-to-br from-purple-50 to-pink-50",
    image: feature3,
  },
  {
    title: "Smart Connections",
    heading: "Understand dependencies early.",
    description:
      "Understand dependencies before they become blockers. See exactly how altering one feature impacts the rest of your system and plan contingencies ahead of time.",
    icon: Workflow,
    color: "text-amber-500",
    bg: "bg-amber-50",
    illustrationBg: "bg-gradient-to-br from-amber-50 to-orange-50",
    image: feature4,
  },
];

const Features = () => {
  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-24 xl:py-32 overflow-hidden">
      <div className="cont w-full h-full flex flex-col gap-12 sm:gap-16 lg:gap-24 xl:gap-32">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight tracking-tight"
          >
            Smarter Planning, <br />
            <span className="bg-primary text-secondary px-3 rounded-xl">
              Better Execution.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 text-lg leading-relaxed mt-6"
          >
            Cortex connects all your ideas, tools, and processes seamlessly in a
            centralized workspace to ensure your builds are flawlessly executed.
          </motion.p>
        </div>

        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isEven = index % 2 === 0;

          return (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 w-full ${isEven ? "" : "lg:flex-row-reverse"}`}
            >
              <motion.div
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="flex-1 w-full max-w-xl flex flex-col items-start"
              >
                <div
                  className={`px-4 py-1.5 rounded-full ${feature.bg} ${feature.color} text-sm font-bold tracking-widest uppercase mb-6 flex items-center gap-2`}
                >
                  <Icon size={16} />
                  {feature.title}
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight tracking-tight">
                  {feature.heading}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8">
                  {feature.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                className="flex-1 w-full flex justify-center lg:justify-end"
              >
                <div
                  className={`relative w-full max-w-[400px] sm:max-w-[460px] lg:max-w-[500px] aspect-square sm:aspect-square rounded-3xl sm:rounded-[2.5rem] lg:rounded-[3rem] ${feature.illustrationBg} overflow-hidden shadow-sm flex items-center justify-center p-6 sm:p-8 lg:p-12 hover:-translate-y-1 sm:hover:-translate-y-2 transition-transform duration-500`}
                >
                  {/* Abstract soft blob */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/60 blur-[60px] rounded-full z-0" />

                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-auto object-contain relative z-10 drop-shadow-xl"
                  />
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;

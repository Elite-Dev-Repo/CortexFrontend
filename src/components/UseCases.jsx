import React from "react";
import { MessageSquare, ShoppingCart, Kanban, AtomIcon } from "lucide-react";
import { motion } from "framer-motion";

const useCases = [
  {
    title: "Workflow Automation",
    description:
      "Map out every feature from user authentication to push notifications seamlessly.",
    icon: MessageSquare,
    badge: "01",
    bg: "bg-[#f3eeff]",
    iconColor: "text-[#7624f4]",
  },
  {
    title: "Advanced Analytics",
    description:
      "Define your catalog, order tracking, and dynamic analytics dashboards with clarity.",
    icon: ShoppingCart,
    badge: "02",
    bg: "bg-[#ffeef2]",
    iconColor: "text-[#f43f5e]",
  },
  {
    title: "Team Collaboration",
    description:
      "Structure tasks, team roles, deadlines, and reporting features so your team stays aligned.",
    icon: Kanban,
    badge: "03",
    bg: "bg-[#eef8ff]",
    iconColor: "text-[#0ea5e9]",
  },
];

const UseCases = () => {
  return (
    <section className="w-full bg-slate-50 py-12 sm:py-16 lg:py-24 xl:py-32 relative">
      <div className="cont w-full h-full flex flex-col gap-8 sm:gap-12 lg:gap-16 xl:gap-20">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 w-full">
          <div className="flex flex-col items-start gap-4 max-w-xl w-full">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="px-3 sm:px-4 py-1.5 rounded-full bg-primary text-secondary text-[11px] sm:text-xs font-bold tracking-widest uppercase flex items-center gap-2"
            >
              <AtomIcon size={14} />
              Featured Tools
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight"
            >
              Powerful Tools <br className="hidden md:block" />
              Built for{" "}
              <span className="bg-primary text-secondary px-2 rounded-lg">
                Your Business
              </span>
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-end max-w-sm lg:pb-2"
          >
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
              Explore our suite of powerful tools designed to simplify
              workflows, improve collaboration, and drive better results.
            </p>
            <a
              href="/"
              className="inline-flex max-w-max items-center justify-center px-6 py-2.5 bg-primary text-secondary rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              View All Tools
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
          {useCases.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
                className="group flex flex-col"
              >
                <div
                  className={`w-full aspect-[4/3] rounded-[2rem] ${item.bg} flex items-center justify-center p-8 mb-6 relative overflow-hidden transition-transform duration-500 hover:-translate-y-2`}
                >
                  <div className="w-24 h-24 rounded-full bg-white/40 shadow-sm flex items-center justify-center relative z-10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                    <Icon size={40} className={item.iconColor} />
                  </div>
                  {/* Light blur blob */}
                  <div
                    className={`absolute -bottom-8 -right-8 w-40 h-40 rounded-full blur-3xl opacity-50 bg-white`}
                  />
                </div>

                <div className="flex items-center gap-3 text-slate-900 mb-2">
                  <span className="text-sm font-semibold">{item.badge}</span>
                  <span className="w-8 h-[1px] bg-slate-300"></span>
                  <h3 className="text-lg lg:text-xl font-bold tracking-tight">
                    {item.title}
                  </h3>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed pl-14">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCases;

import React from "react";
import { MessageSquare, ShoppingCart, Kanban, AtomIcon } from "lucide-react";
import { motion } from "framer-motion";

const useCases = [
  {
    title: "Chat Application",
    description:
      "Map out every feature from user authentication and private messaging to push notifications and file sharing before writing a single line of code.",
    icon: MessageSquare,
  },
  {
    title: "E-Commerce Platform",
    description:
      "Define your product catalog, shopping cart, payment gateway, order tracking, and admin dashboard to ensure nothing falls through the cracks.",
    icon: ShoppingCart,
  },
  {
    title: "Project Management Tool",
    description:
      "Structure tasks, team roles, deadlines, and reporting features upfront so your build stays focused and your team stays aligned.",
    icon: Kanban,
  },
  {
    title: "Saas Application",
    description:
      "Map out every feature from user authentication and private messaging to push notifications and file sharing before writing a single line of code.",
    icon: AtomIcon,
  },
];

const UseCases = () => {
  return (
    <section className="w-full min-h-screen bg-background py-24">
      <div className="cont w-full h-full flex items-start justify-between gap-16">
        <div className="sticky top-24 flex flex-col items-start gap-3 flex-1">
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">
            Real world
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-white">
            Use cases
          </h2>
          <p className="text-white/60 text-sm leading-relaxed mt-2 max-w-xs">
            See how Cortex helps you stay organized across different types of
            projects.
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full flex-1">
          {useCases.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -200 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-100px" }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
                className="bg-primary rounded-2xl p-8 flex items-start gap-6 ring-1 ring-white/5 hover:ring-white/10 transition-[ring] duration-300 will-change-transform"
              >
                <span className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-white" />
                </span>
                <div>
                  <h3 className="text-white text-lg font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCases;

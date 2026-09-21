import React, { useState } from "react";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "What is Cortex?",
    a: "Cortex is a project ideation and planning tool that helps you structure product ideas into clear, trackable features before you start building. Think of it as a structured workspace where you can brainstorm, define, organize, and track every aspect of your software project — all in one place.",
  },
  {
    q: "Is Cortex free to use?",
    a: "Yes, Cortex offers a generous free tier that gives you access to core planning and structuring features. For teams that need more advanced capabilities — such as real-time multi-user collaboration, priority support, or in-depth analytics dashboards — we offer affordable premium plans.",
  },
  {
    q: "Can I collaborate with my team in real-time?",
    a: "Absolutely. Cortex is built with real-time collaboration at its core. Your entire team can work on the same project simultaneously — defining features, leaving contextual feedback, assigning ownership, and tracking progress as changes happen instantly.",
  },
  {
    q: "What types of projects can I plan with Cortex?",
    a: "Cortex is designed for any software project — whether you're building a chat application, an e-commerce platform, a project management tool, a SaaS product, or an internal enterprise system.",
  },
  {
    q: "Do I need to write code to use Cortex?",
    a: "Not at all. Cortex is a visual planning and structuring tool — no coding required. You define features, organize them into categories, set priorities, and track progress using a clean, intuitive interface.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-24 xl:py-32 relative overflow-hidden">
      <div className="cont w-full h-full relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-8 sm:gap-12 lg:gap-16 xl:gap-24">
          {/* Left sticky heading */}
          <div className="lg:sticky lg:top-32 flex flex-col items-start gap-5 w-full lg:max-w-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="px-4 py-1.5 rounded-full bg-primary text-secondary flex items-center gap-2"
            >
              <MessageCircleQuestion size={16} />
              <span className="text-xs font-bold tracking-widest uppercase">
                FAQ
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight"
            >
              Frequently <br /> Asked <br />
              <span className="bg-primary text-secondary px-3 rounded-xl">
                Questions.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 text-base leading-relaxed mt-2"
            >
              Everything you need to know about Cortex. Can&apos;t find what
              you&apos;re looking for? Reach out to our team.
            </motion.p>
          </div>

          {/* Right accordion */}
          <div className="flex flex-col w-full flex-1">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="border-b border-slate-100"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between py-6 lg:py-7 text-left cursor-pointer outline-none group"
                >
                  <span
                    className={`text-base lg:text-lg font-semibold pr-4 transition-colors duration-300 ${openIndex === i ? "text-secondary" : "text-slate-900 group-hover:text-secondary"}`}
                  >
                    {faq.q}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${openIndex === i ? "bg-primary text-secondary" : "bg-slate-100 text-slate-500 group-hover:bg-primary/40 group-hover:text-secondary"}`}
                  >
                    <motion.div
                      animate={{ rotate: openIndex === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-slate-500 text-sm lg:text-base leading-relaxed pb-7">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;

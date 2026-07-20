import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What is Cortex?",
    a: "Cortex is a project ideation and planning tool that helps you structure product ideas into clear, trackable features before you start building. Think of it as a structured workspace where you can brainstorm, define, organize, and track every aspect of your software project — all in one place. It bridges the gap between a rough concept and a well-defined execution plan, making it easier for teams to stay aligned from day one.",
  },
  {
    q: "Is Cortex free to use?",
    a: "Yes, Cortex offers a generous free tier that gives you access to core planning and structuring features. For teams that need more advanced capabilities — such as real-time multi-user collaboration, priority support, or in-depth analytics dashboards — we offer affordable premium plans. You can upgrade at any time as your project and team grow.",
  },
  {
    q: "Can I collaborate with my team in real-time?",
    a: "Absolutely. Cortex is built with real-time collaboration at its core. Your entire team can work on the same project simultaneously — defining features, leaving contextual feedback, assigning ownership, and tracking progress as changes happen instantly. Everyone stays on the same page without the back-and-forth of endless meetings or outdated documents.",
  },
  {
    q: "What types of projects can I plan with Cortex?",
    a: "Cortex is designed for any software project — whether you're building a chat application, an e-commerce platform, a project management tool, a SaaS product, or an internal enterprise system. If it involves features, milestones, and a team working together, Cortex provides the structure you need to plan it effectively from concept to launch.",
  },
  {
    q: "Do I need to write code to use Cortex?",
    a: "Not at all. Cortex is a visual planning and structuring tool — no coding required. You define features, organize them into categories, set priorities, and track progress using a clean, intuitive interface. Developers, product managers, designers, and stakeholders can all contribute without writing a single line of code.",
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="w-full min-h-screen bg-background py-16 lg:py-24">
      <div className="cont w-full h-full">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-20">
          <div className="lg:sticky lg:top-24 flex flex-col items-start gap-3 w-full lg:max-w-sm">
            <span className="text-xs uppercase tracking-[0.3em] text-white/40">
              Questions
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white leading-tight">
              Frequently asked <br /> questions
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mt-2">
              Everything you need to know about Cortex. Can&apos;t find what
              you&apos;re looking for? Feel free to reach out to our team.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-2xl">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-foreground rounded-xl ring-1 ring-white/5 overflow-hidden"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between p-4 lg:p-5 text-left text-white font-medium text-sm lg:text-base cursor-pointer"
                >
                  <span className="pr-2">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-white/60 transition-transform duration-300 shrink-0 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === i ? "max-h-96" : "max-h-0"
                  }`}>
                  <p className="px-4 lg:px-5 pb-4 lg:pb-5 text-xs lg:text-sm text-white/60 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;

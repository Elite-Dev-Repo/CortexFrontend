import React from "react";
import { Lightbulb, GitFork, Users, BarChart3 } from "lucide-react";

const capabilities = [
  {
    title: "Ideation & Brainstorming",
    desc: "Capture and organize product ideas in a structured format. Turn rough concepts into clear, actionable plans.",
    icon: Lightbulb,
  },
  {
    title: "Feature Mapping",
    desc: "Define and visualize every feature of your project — from authentication to real-time messaging and beyond.",
    icon: GitFork,
  },
  {
    title: "Team Collaboration",
    desc: "Work together in real-time. Assign ownership, leave feedback, and keep everyone aligned on the same vision.",
    icon: Users,
  },
  {
    title: "Progress Analytics",
    desc: "Track completion status across features with live metrics. Know exactly where your project stands.",
    icon: BarChart3,
  },
];

const Platform = () => {
  return (
    <section className="w-screen min-h-screen bg-background py-24">
      <div className="cont w-full h-full">
        <div className="flex flex-col items-center gap-4 mb-20">
          <span className="text-xs uppercase tracking-[0.3em] text-white/40">
            Platform
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-white text-center">
            Everything you need to <br /> plan with clarity
          </h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-md text-center">
            A unified workspace for turning product ideas into structured,
            trackable projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {capabilities.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-foreground rounded-2xl p-8 ring-1 ring-white/5 hover:ring-white/10 transition-all duration-300 group"
              >
                <span className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-5 group-hover:bg-white/10 transition-colors">
                  <Icon size={22} className="text-white" />
                </span>
                <h3 className="text-white text-lg font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Platform;

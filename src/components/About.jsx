import React from "react";
import neuralVideo from "../assets/cortex-vid.mp4";

const About = () => {
  const points = [
    {
      title: "Structure",
      desc: "Break down any product idea into clear, manageable features before writing a single line of code.",
    },
    {
      title: "Collaborate",
      desc: "Work with your team in real-time to define, refine, and align on project scope.",
    },
    {
      title: "Track",
      desc: "Monitor progress across every feature and cross-reference planned vs implemented work.",
    },
  ];
  return (
    <section className="w-full min-h-screen bg-background py-12 lg:py-0">
      <div className="cont w-full h-full flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-0">
        <div className="flex-1 w-full p-0 lg:p-5 flex flex-col items-start gap-5 justify-center text-white order-2 lg:order-1">
          <h2 className="text-2xl md:text-3xl font-semibold">What is Cortex ?</h2>
          <p className="text-sm md:text-base text-white/80">
            Cortex is a project ideation and planning tool that helps you
            structure your product vision into actionable features. From
            brainstorming to tracking, Cortex keeps your team aligned and your
            builds focused.
          </p>
          <div className="flex flex-col gap-4 w-full">
            {points.map((point, i) => {
              return (
                <div key={i} className="flex items-start justify-start gap-3">
                  <p className="text-2xl md:text-3xl font-semibold shrink-0">{`0${i + 1}`}</p>
                  <div>
                    <p className="text-sm md:text-base font-medium">{point.title}</p>
                    <p className="text-xs md:text-sm text-white/60">{point.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex-1 w-full p-0 lg:p-5 flex items-center justify-center order-1 lg:order-2">
          <video src={neuralVideo} className="w-full max-w-md lg:w-100 rounded-xl" autoPlay loop muted playsInline />
        </div>
      </div>
    </section>
  );
};

export default About;

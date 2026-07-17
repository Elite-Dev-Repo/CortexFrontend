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
    <section className="w-screen h-screen bg-background">
      <div className="cont w-full h-full flex items-center justify-between">
        <div className="flex-1 h-full p-5 flex flex-col  items-start gap-5 justify-center text-white">
          <h2 className="text-3xl font-semibold">What is Cortex ?</h2>
          <p>
            Cortex is a project ideation and planning tool that helps you
            structure your product vision into actionable features. From
            brainstorming to tracking, Cortex keeps your team aligned and your
            builds focused.
          </p>
          <div className="flex flex-col gap-3">
            {points.map((point, i) => {
              return (
                <div className="flex items-start justify-center gap-3">
                  <p className="text-3xl font-semibold">{`0${i + 1}`}</p>
                  <div className="">
                    <p>{point.title}</p>
                    <p className="text-sm text-white/60">{point.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex-1 h-full p-5 flex items-center justify-center">
          <video src={neuralVideo} className="w-100" autoPlay loop muted />
        </div>
      </div>
    </section>
  );
};

export default About;

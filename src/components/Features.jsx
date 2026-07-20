import feature1 from "../assets/cortex-f-1.svg";
import feature2 from "../assets/cortex-f-2.svg";
import feature3 from "../assets/cortex-f-3.svg";
import feature4 from "../assets/cortex-f-4.svg";

const features = [
  {
    title: "Create a Project in Seconds",
    description:
      "Instantly scaffold a new project instance for any application idea.",
    image: feature1,
    bg: "#c6b7f7",
    top: "top-[40px]",
  },
  {
    title: "Define Granular Features",
    description:
      "Break your project into granular, well-defined features — from auth to real-time messaging.",
    image: feature2,
    bg: "#fac8dd",
    top: "top-[60px]",
  },
  {
    title: "Track Progress at a Glance",
    description: "Monitor development status across every feature.",
    image: feature3,
    bg: "#f8e9b7",
    top: "top-[80px]",
  },
  {
    title: "Stay on Course with Confidence",
    description: "Cross-reference planned features against implementation.",
    image: feature4,
    bg: "#d4faae",
    top: "top-[100px]",
  },
];

const Features = () => {
  return (
    <section className="w-full min-h-screen bg-background flex items-center justify-center">
      <div className="cont w-full h-full flex flex-col gap-20">
        {features.map((feature, i) => {
          return (
            <div
              key={i}
              className={`h-120 w-full max-w-full lg:max-w-5xl xl:max-w-[1000px] mx-auto flex flex-col lg:flex-row items-center gap-3 border border-white/40 p-5 rounded-lg sticky ${feature.top} bg-background`}
            >
              <div className="w-full lg:w-1/2 flex justify-center">
                <img
                  src={feature.image}
                  className="w-full max-w-[250px] lg:max-w-none lg:w-110 lg:h-110 bg-white/90 p-5 rounded-xl"
                  alt={feature.title}
                />
              </div>
              <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center p-5 text-center lg:text-left">
                <h3 className="text-white text-2xl md:text-3xl lg:text-5xl font-semibold tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-white/60 text-sm md:text-base lg:text-lg font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;

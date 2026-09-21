import { useState } from "react";
import { ArrowRight, Blocks, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAuth } from "@/hooks/useAuth";
import {
  Background,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import {
  edges as initialEdges,
  nodes as initialNodes,
} from "@/lib/headerFlowNodes";
import HeaderTarget from "./HeaderTarget";
import HeaderSource from "./HeaderSource";
import "@xyflow/react/dist/style.css";
import { LayoutDashboard } from "@hugeicons/core-free-icons/index";

const Header = () => {
  const { isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { name: "Platform", route: "/" },
    { name: "Features", route: "/" },
    { name: "Use cases", route: "/" },
    {
      name: isAuthenticated ? "Dashboard" : "Sign In",
      route: isAuthenticated ? "/dashboard" : "/auth",
    },
  ];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = {
    headerTarget: HeaderTarget,
    headerSource: HeaderSource,
  };

  return (
    <header className="bg-background w-full min-h-screen lg:min-h-screen text-secondary overflow-hidden flex flex-col">
      <div className="w-full gap-9 flex-1 cont relative flex flex-col">
        <nav className=" bg-white shadow-md w-full lg:w-[90%] xl:w-[90%] p-2 mt-3 lg:mt-6 mx-auto rounded-lg flex items-center justify-between gap-2 backdrop-blur-2xl lg:gap-5">
          <div className=" text-secondary px-3 lg:px-4 py-1.5 lg:py-2 flex items-center rounded-sm z-20 shrink-0">
            <a
              href="/"
              className="tracking-wider flex items-center gap-2 font-semibold text-sm lg:text-base"
            >
              <HugeiconsIcon icon={LayoutDashboard} size={28} />
              Cortex
            </a>
          </div>

          <div className="hidden lg:flex min-w-0 flex-1 rounded-lg p-1 z-20 ">
            <ul className="w-full flex items-center justify-end px-4 ">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.route}
                  className={`text-sm px-4 py-2 rounded-sm whitespace-nowrap ${link.name == "Sign In" || link.name == "Dashboard" ? "bg-primary text-secondary font-semibold hover:bg-primary/50" : "text-secondary hover:bg-primary/5"}`}
                >
                  <li>{link.name}</li>
                </a>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 hover:bg-secondary/5 rounded-lg text-secondary z-20"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="lg:hidden bg-foreground border border-white/10 rounded-lg p-2 mt-2 z-10 relative"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.route}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm ${link.name == "Sign In" || link.name == "Dashboard" ? "bg-primary text-secondary font-semibold" : "text-secondary/80 hover:bg-primary/5"}`}
                >
                  {link.name}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute w-60 h-60 md:w-100 md:h-100 bg-[#7624f4]/9 rounded-full top-30 right-10 blur-3xl pointer-events-none" />

        <div className="w-full flex-1 flex flex-col items-center gap-3 justify-center z-2 px-2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-medium leading-tight sm:leading-normal text-center tracking-tight z-1 max-w-3xl"
          >
            <span className="px-1.5 sm:px-2 bg-[#7624f4]/10 text-[#7624f4]">
              Organize
            </span>{" "}
            your project structure, <br className="hidden sm:block" />{" "}
            <span className="px-1.5 sm:px-2 bg-[#7624f4]/10 text-[#7624f4]">
              Build
            </span>{" "}
            with a clear plan.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center text-secondary/60 z-1 text-xs sm:text-sm md:text-base max-w-xl px-2 leading-relaxed"
          >
            Brainstorm, Structure your product ideas in a concise easy to read
            form. <br className="hidden sm:block" /> Real Time feature
            implemented for team collaborations.
          </motion.p>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            href="/auth"
            className="z-1"
          >
            <button className=" px-4 py-2 bg-secondary text-background rounded-xl tracking-wider flex items-center gap-5 text-sm lg:text-base">
              Start Free <ArrowRight size={18} />
            </button>
          </motion.a>
        </div>

        {/* Hero flow – same design system as Project/Feature pages */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="relative w-full h-[260px] xs:h-[300px] sm:h-[320px] lg:h-[340px] xl:h-[360px] overflow-hidden rounded-xl "
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.18 }}
            proOptions={{ hideAttribution: true }}
            nodesDraggable={true}
            nodesConnectable={false}
            elementsSelectable={true}
            panOnDrag={true}
            zoomOnScroll={false}
            zoomOnPinch={false}
            panOnScroll={false}
            defaultEdgeOptions={{
              animated: true,
              style: { stroke: "#2e2e2e", strokeWidth: 1 },
            }}
            className="bg-[#fcfcf9]"
            style={{ width: "100%", height: "100%" }}
          >
            <Background gap={16} size={1} color="#e9e9e7" />
          </ReactFlow>

          {/* bottom caption */}
        </motion.div>
      </div>
    </header>
  );
};

export default Header;

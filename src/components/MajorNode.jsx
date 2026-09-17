import { Handle, Position } from "@xyflow/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Layers01Icon, Rocket01Icon } from "@hugeicons/core-free-icons";

const MajorNode = ({ data }) => {
  return (
    <div className="group relative min-w-[268px] max-w-[300px] bg-secondary text-background border border-primary shadow-[0_8px_32px_rgba(0,0,0,0.35)] cursor-grab active:cursor-grabbing select-none transition-all duration-300">
      {/* accent top bar */}
      {/* <div className="h-[3px] w-full bg-primary" /> */}

      {/* subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#c0ff71_1px,transparent_1px),linear-gradient(to_bottom,#c0ff71_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />

      <div className="relative p-4 flex flex-col gap-3">
        {/* header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-primary text-secondary border border-primary/20 shadow-sm">
            <HugeiconsIcon icon={Layers01Icon} size={18} strokeWidth={2} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] leading-none tracking-[0.14em] font-bold uppercase text-primary/90 bg-primary/10 border border-primary/20 px-2 py-1 rounded-full">
              Project
            </span>
          </div>
        </div>

        {/* title */}
        <div className="space-y-1">
          <h3 className="text-[15px] font-semibold tracking-tight leading-5 text-background line-clamp-2">
            {data?.name || "Untitled Project"}
          </h3>
          {data?.description ? (
            <p className="text-xs leading-4 text-background/60 line-clamp-2">
              {data.description}
            </p>
          ) : (
            <p className="text-xs leading-4 text-background/35 italic">
              Drag to reposition • Connect to features
            </p>
          )}
        </div>
      </div>

      {/* handles - styled to match theme */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-secondary/70 "
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-secondary/70 "
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-secondary/70 "
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3 !h-3 !bg-secondary/70 "
      />
    </div>
  );
};

export default MajorNode;

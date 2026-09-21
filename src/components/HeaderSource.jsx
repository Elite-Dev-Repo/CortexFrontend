import { Handle, Position } from "@xyflow/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Layers01Icon } from "@hugeicons/core-free-icons";

const HeaderSource = ({ data }) => {
  return (
    <div className="group relative min-w-[148px] max-w-[168px] bg-secondary text-background border border-primary/20 shadow-[0_4px_16px_rgba(0,0,0,0.14)] select-none cursor-grab active:cursor-grabbing rounded-sm">
      <div className="absolute inset-0 opacity-[0.035] bg-[linear-gradient(to_right,#c0ff71_1px,transparent_1px),linear-gradient(to_bottom,#c0ff71_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none rounded-sm" />
      <div className="relative p-2.5 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[6px] tracking-[0.12em] font-bold uppercase text-primary/90 bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-full">
            {data?.kind || "Project"}
          </span>
        </div>
        <div className="space-y-0.5">
          <h3 className="text-[11px] font-semibold tracking-tight leading-4 text-background line-clamp-1">
            {data?.name || data?.title || "Untitled"}
          </h3>
          <p className="text-[8px] leading-3.5 text-background/60 line-clamp-2">
            {data?.description || "Central workspace"}
          </p>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-2 !h-2 !bg-secondary !border !border-white/30"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-2 !h-2 !bg-secondary !border !border-white/30 !opacity-0"
      />
    </div>
  );
};

export default HeaderSource;

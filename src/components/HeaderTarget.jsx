import { Handle, Position } from "@xyflow/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tag01Icon } from "@hugeicons/core-free-icons";

const HeaderTarget = ({ data }) => {
  const tags = data?.tags || [];
  const status = data?.status || "pending";
  const statusMap = {
    pending: {
      label: "Pending",
      dot: "bg-amber-400",
      bg: "bg-amber-500/10",
      text: "text-amber-600",
      border: "border-amber-500/20",
    },
    in_progress: {
      label: "In Progress",
      dot: "bg-blue-500",
      bg: "bg-blue-500/10",
      text: "text-blue-600",
      border: "border-blue-500/20",
    },
    completed: {
      label: "Done",
      dot: "bg-emerald-500",
      bg: "bg-emerald-500/10",
      text: "text-emerald-600",
      border: "border-emerald-500/20",
    },
  };
  const st = statusMap[status] || statusMap.pending;

  return (
    <div className="group relative min-w-[138px] max-w-[156px] bg-white text-secondary rounded-sm border border-secondary/10 shadow-[0_2px_10px_rgba(0,0,0,0.06)] select-none cursor-grab active:cursor-grabbing">
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary rounded-l-sm" />
      <div className="pl-[2px]">
        <div className="px-2.5 py-2 space-y-1">
          <div className="flex items-start justify-between gap-1">
            <h4 className="text-[10px] font-semibold tracking-tight leading-3.5 text-secondary line-clamp-1 flex-1">
              {data?.name || data?.title || "Untitled"}
            </h4>
            <span
              className={`shrink-0 inline-flex items-center gap-0.5 px-1 py-0.5 rounded-full border text-[7.5px] font-semibold tracking-wide uppercase ${st.bg} ${st.text} ${st.border}`}
            >
              <span className={`h-1 w-1 rounded-full ${st.dot}`} />
              <p className="text-[6px]">{st.label}</p>
            </span>
          </div>
          <p className="text-[9px] leading-3 text-secondary/55 line-clamp-2">
            {data?.description || "No description"}
          </p>
        </div>
        {tags.length > 0 && (
          <div className="px-2.5 pb-1.5 flex flex-wrap gap-1">
            {tags.slice(0, 2).map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-0.5 text-[6px] font-medium px-1 py-0.5 rounded-full bg-secondary/[0.05] border border-secondary/10 text-secondary/60"
              >
                <HugeiconsIcon icon={Tag01Icon} size={8} />
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-1.5 !h-1.5 !bg-secondary/50 !border !border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-1.5 !h-1.5 !bg-secondary/50 !border !border-white !opacity-0"
      />
    </div>
  );
};

export default HeaderTarget;

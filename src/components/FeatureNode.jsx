import { Handle, Position } from "@xyflow/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FlashIcon,
  ArrowRight01Icon,
  Tag01Icon,
} from "@hugeicons/core-free-icons";

const FeatureNode = ({ data }) => {
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
    <div className="group relative min-w-[180px] max-w-[220px] sm:min-w-[236px] sm:max-w-[260px] bg-white text-secondary rounded-sm border border-primary/15 shadow-[0_4px_20px_rgba(0,0,0,0.08)] cursor-grab active:cursor-grabbing select-none transition-all duration-300 ">
      {/* left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-primary " />

      <div className="pl-[3px]">
        {/* top row */}

        {/* content */}
        <div className="px-3.5 pb-2 space-y-1.5 p-3">
          <div className="w-full flex items-center justify-between">
            <h4 className="text-[13.5px] font-semibold tracking-tight leading-4 text-secondary line-clamp-2">
              {data?.name || "Untitled"}
            </h4>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-semibold tracking-wide uppercase ${st.bg} ${st.text} ${st.border}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${st.dot} animate-pulse`}
              />
              {st.label}
            </span>
          </div>
          {data?.description ? (
            <p className="text-xs leading-[16px] text-secondary/55 line-clamp-2">
              {data.description}
            </p>
          ) : (
            <p className="text-xs leading-[16px] text-secondary/30 italic">
              No description
            </p>
          )}
        </div>

        {/* tags */}
        {tags.length > 0 && (
          <div className="px-3.5 pb-2.5 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary/[0.06] border border-secondary/10 text-secondary/60"
              >
                <HugeiconsIcon icon={Tag01Icon} size={10} />
                {t}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 text-secondary/40">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!w-2 !h-2 !bg-secondary/70 "
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!w-2 !h-2 !bg-secondary/70 "
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-2 !h-2 !bg-secondary/70 "
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-2 !h-2 !bg-secondary/70 "
      />
    </div>
  );
};

export default FeatureNode;

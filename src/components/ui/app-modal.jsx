import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

export const AppModal = ({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  maxWidth = "max-w-[440px]",
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    // lock scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${maxWidth} bg-white border border-secondary/10 rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.16)] overflow-hidden flex flex-col max-h-[90vh]`}
          >
            <div className="px-6 pt-6 pb-4 border-b border-secondary/8 flex items-start gap-3">
              {icon && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary border border-secondary/10">
                  {icon}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h2 className="text-[15px] font-semibold tracking-tight text-secondary leading-5">{title}</h2>
                {description && <p className="text-xs leading-4 text-secondary/55 mt-0.5">{description}</p>}
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 h-8 w-8 -mr-1 flex items-center justify-center rounded-lg text-secondary/40 hover:text-secondary hover:bg-secondary/5 transition-colors"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scroll">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const Field = ({ label, required, hint, children, error }) => (
  <div className="space-y-1.5">
    <label className="flex items-baseline gap-1 text-[12px] font-medium tracking-wide text-secondary/80">
      {label}
      {required && <span className="text-red-500">*</span>}
      {hint && <span className="text-[11px] font-normal text-secondary/35 ml-auto">{hint}</span>}
    </label>
    {children}
    {error && <p className="text-[11px] text-red-500 leading-3">{error}</p>}
  </div>
);

export const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full bg-background border border-secondary/10 rounded-lg py-2.5 px-3.5 text-[13px] leading-5 text-secondary placeholder:text-secondary/30 focus:outline-none focus:border-secondary/20 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all disabled:opacity-50 ${className}`}
  />
);

export const Textarea = ({ className = "", ...props }) => (
  <textarea
    {...props}
    className={`w-full bg-background border border-secondary/10 rounded-lg py-2.5 px-3.5 text-[13px] leading-5 text-secondary placeholder:text-secondary/30 focus:outline-none focus:border-secondary/20 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all resize-none disabled:opacity-50 ${className}`}
  />
);

export const Select = ({ className = "", children, ...props }) => (
  <select
    {...props}
    className={`w-full bg-background border border-secondary/10 rounded-lg py-2.5 px-3.5 text-[13px] leading-5 text-secondary focus:outline-none focus:border-secondary/20 focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all ${className}`}
  >
    {children}
  </select>
);

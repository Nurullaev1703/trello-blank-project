import React from "react";
import { Toast, ToastType } from "@/contexts/ToastContext";
import {
  CheckCircleIcon,
  WarningCircleIcon,
  InfoIcon,
  WarningIcon,
  XIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircleIcon className="text-success h-5 w-5" weight="fill" />,
  error: <WarningCircleIcon className="text-error h-5 w-5" weight="fill" />,
  info: <InfoIcon className="text-primary h-5 w-5" weight="fill" />,
  warning: <WarningIcon className="text-warning h-5 w-5" weight="fill" />,
};

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export const ToastItem: React.FC<ToastProps> = ({ toast, onClose }) => {
  return (
    <div
      className={cn(
        "glass-dark flex items-center gap-3 p-4 rounded-lg shadow-lg border border-white/10 min-w-[300px] animate-in slide-in-from-right-full duration-300",
      )}
    >
      <div className="shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 text-sm font-medium text-white">
        {toast.message}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 text-white/40 hover:text-white transition-colors"
      >
        <XIcon className="h-4 w-4" weight="bold" />
      </button>
    </div>
  );
};

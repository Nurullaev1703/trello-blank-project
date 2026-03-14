import React from "react";
import { useToastContext } from "@/contexts/ToastContext";
import { ToastItem } from "./toast";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastContext();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      <div className="flex flex-col gap-2 pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </div>
  );
};

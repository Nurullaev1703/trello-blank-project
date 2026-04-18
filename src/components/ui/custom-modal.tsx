import React, { useEffect } from "react";
import { XIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}) => {
  // Prevent body scroll when the modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative z-50 w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-card/90 backdrop-blur-xl shadow-2xl duration-200 animate-in fade-in-0 zoom-in-95",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-foreground">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-full opacity-70 transition-opacity hover:opacity-100 focus:outline-none w-8 h-8 flex items-center justify-center hover:bg-white/10"
            >
              <XIcon className="h-5 w-5 text-foreground" weight="bold" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          )}
        </div>

        {/* Content */}
        <div className="p-6 pt-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;

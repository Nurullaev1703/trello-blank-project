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
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-light-gray/80 animate-in fade-in-0 custom-modal-overlay"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-primary-gray bg-white p-0 shadow-lg duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-xl",
          "max-w-[calc(100%-32px)] max-h-screen rounded-xl flex flex-col custom-modal-content",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scrollable Content */}
        <div className="flex flex-col flex-1 h-full max-h-screen overflow-y-auto custom-modal-scrollable p-4">
          {/* Header */}
          <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4 px-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold leading-none tracking-tight text-primary-blue">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="rounded-xl opacity-70 ring-offset-light-gray transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-dark-blue focus:ring-offset-2 w-11 h-11 flex items-center justify-center"
              >
                <XIcon className="h-4 w-4 text-dark-gray" weight="bold" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            {description && (
              <p className="text-sm text-primary-gray">{description}</p>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto custom-modal-scrollable px-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;

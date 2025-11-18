"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

interface DialogContextValue {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within <Dialog>");
  }
  return context;
};

interface DialogProps extends DialogContextValue {
  children: ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return <DialogContext.Provider value={{ open, onOpenChange }}>{open ? children : null}</DialogContext.Provider>;
}

interface DialogContentProps {
  children: ReactNode;
  className?: string;
}

export function DialogContent({ children, className }: DialogContentProps) {
  const { open, onOpenChange } = useDialogContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur"
      role="presentation"
      onClick={() => onOpenChange?.(false)}
    >
      <div
        className={`relative w-full max-w-lg rounded-3xl bg-white shadow-[0_25px_60px_rgba(15,23,42,0.2)] ${className ?? ""}`}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

interface DialogSectionProps {
  children: ReactNode;
  className?: string;
}

export function DialogHeader({ children, className }: DialogSectionProps) {
  return <div className={`text-center ${className ?? ""}`}>{children}</div>;
}

export function DialogFooter({ children, className }: DialogSectionProps) {
  return <div className={`mt-4 flex justify-end ${className ?? ""}`}>{children}</div>;
}

export function DialogTitle({ children, className }: DialogSectionProps) {
  return <h2 className={`text-xl font-semibold text-slate-900 ${className ?? ""}`}>{children}</h2>;
}

export function DialogDescription({ children, className }: DialogSectionProps) {
  return <div className={`text-sm text-slate-600 ${className ?? ""}`}>{children}</div>;
}

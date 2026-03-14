import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ToastProvider } from "@/contexts/ToastContext";
import { ToastContainer } from "@/components/ui/ToastContainer";

export const Route = createRootRoute({
  component: () => (
    <ToastProvider>
      <Outlet />
      <ToastContainer />
    </ToastProvider>
  ),
});

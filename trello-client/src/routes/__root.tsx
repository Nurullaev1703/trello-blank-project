import { createRootRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { ToastProvider } from "@/contexts/ToastContext";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { Header } from "@/components/Header";

const AUTH_ROUTES = ["/auth", "/register"]

const RootComponent = () => {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  
  return (
    <ToastProvider>
      {!isAuthRoute && <Header /> }
      <Outlet />
      <ToastContainer />
    </ToastProvider>
  )
}

export const Route = createRootRoute({
  component: RootComponent
});

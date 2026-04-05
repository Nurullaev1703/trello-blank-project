import {
  createRootRoute,
  Outlet,
  useRouterState,
  redirect,
} from "@tanstack/react-router";
import { ToastProvider } from "@/contexts/ToastContext";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { Header } from "@/components/Header";
import { tokenStorage } from "@/services/storageService";

const AUTH_ROUTES = ["/auth", "/register", "/auth/register"]

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
  component: RootComponent,
  beforeLoad: (options) => {
    if (
      !AUTH_ROUTES.includes(options.location.pathname)
      && !tokenStorage.hasValue()
    ) {
      throw redirect({to:"/auth"})
    }
  }
});

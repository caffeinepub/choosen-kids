import { Toaster } from "@/components/ui/sonner";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Navbar } from "./components/Navbar";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import AuctionPage from "./pages/AuctionPage";
import CheckoutPage from "./pages/CheckoutPage";
import DashboardPage from "./pages/DashboardPage";
import HeritagePage from "./pages/HeritagePage";
import HomePage from "./pages/HomePage";
import KitPage from "./pages/KitPage";
import LearnPage from "./pages/LearnPage";
import LoginPage from "./pages/LoginPage";
import PartnersPage from "./pages/PartnersPage";
import UploadPage from "./pages/UploadPage";

// ── Protected Route Wrapper ─────────────────────────────────────────────────

function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

// ── Routes ──────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster />
    </>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});

const heritageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/heritage",
  component: () => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/" />;
    return <HeritagePage />;
  },
});

const protectedLayout = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  component: ProtectedLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/home",
  component: HomePage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/dashboard",
  component: DashboardPage,
});

const kitRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/kit",
  component: KitPage,
});

const learnRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/learn/$courseId",
  component: LearnPage,
});

const uploadRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/upload",
  component: UploadPage,
});

const partnersRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/partners",
  component: PartnersPage,
});

const auctionRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/auction",
  component: AuctionPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => protectedLayout,
  path: "/checkout",
  component: CheckoutPage,
  validateSearch: (search: Record<string, unknown>) => ({
    type: (search.type as string) ?? "bundle",
    courseId: (search.courseId as string) ?? "",
    title: (search.title as string) ?? "",
    price: (search.price as string) ?? "0",
  }),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  heritageRoute,
  protectedLayout.addChildren([
    homeRoute,
    dashboardRoute,
    kitRoute,
    learnRoute,
    uploadRoute,
    partnersRoute,
    auctionRoute,
    checkoutRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

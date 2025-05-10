import { Loading } from "../components/ui/loading";
import { useAuth } from "../hooks/useAuth";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("../app/home"));
const LoginRegister = lazy(() => import("../app/login-register"));

export const Routes = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <Suspense fallback={<Loading />}>
        <LoginRegister />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <Home />
    </Suspense>
  );
};
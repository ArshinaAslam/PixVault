import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAppSelector((state) => state.auth);

  if (accessToken) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
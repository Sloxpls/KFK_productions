import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Only redirect if the user is on the login page
  if (isAuthenticated && location.pathname === "/login") {
    return <Navigate to="/site/songs" />;
  }

  return children;
};

export default PublicRoute;
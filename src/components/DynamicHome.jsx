import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Home from "../pages/candidate/Home";

const DynamicHome = () => {
  const { value: isAuthenticated, user } = useSelector(
    (state) => state.isAuthenticated
  );

  if (isAuthenticated && user?.role === "recruiter") {
    return <Navigate to="/recruiter" replace />;
  }

  return <Home />;
};

export default DynamicHome;

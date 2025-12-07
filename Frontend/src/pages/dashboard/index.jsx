import { useEffect } from "react";
import { useLoggedInUser } from "../../hooks/auth.hooks";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./admin-dashboard";
import UserDashboard from "./user-dashboard";

const DashboardPage = () => {
  const { data: user, isLoading } = useLoggedInUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      console.log("Please go away"); // Todo: Debug this and make this work!
      navigate("/sign-in");
    }
  }, [isLoading, navigate, user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <>
      {user.role === "admin" && <AdminDashboard />}
      {user.role === "user" && <UserDashboard />}
    </>
  );
};

export default DashboardPage;

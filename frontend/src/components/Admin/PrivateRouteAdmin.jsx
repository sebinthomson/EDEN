import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import SimpleSidebar from "./SimpleSidebar";

const PrivateRouteAdmin = () => {
  const { adminInfo } = useSelector((state) => state.adminAuth);
  return adminInfo ? (
    <SimpleSidebar>
      <Outlet />
    </SimpleSidebar>
  ) : (
    <Navigate to="/admin/adminLogin" replace />
  );
};

export default PrivateRouteAdmin;

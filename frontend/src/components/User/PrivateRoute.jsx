import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const toast = useToast();

  useEffect(() => {
    // Show the toast only if userInfo is falsy
    if (!userInfo) {
      toast({
        title: "Please login for further actions",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [userInfo, toast]);

  return userInfo ? <Outlet /> : <Navigate to="/userLogin" replace />;
};

export default PrivateRoute;

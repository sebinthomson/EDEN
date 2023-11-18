import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import store from "./store.js";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import UserRegister from "./screens/User/UserRegister.jsx";
import UserLogin from "./screens/User/UserLogin.jsx";
import UserHome from "./screens/User/UserHome.jsx";
import SimpleSidebar from "./components/Admin/SimpleSidebar.jsx";
import AdminHome from "./screens/Admin/AdminHome.jsx";
import AdminListUsers from "./screens/Admin/AdminListUsers.jsx";
import AdminLogin from "./screens/Admin/AdminLogin.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/userRegister" element={<UserRegister />} />
      <Route path="/userLogin" element={<UserLogin />} />
      <Route path="/" element={<App user />}>
        <Route path="/" element={<UserHome />} />
        <Route path="/userAuctions" element={<UserHome />} />
        <Route path="/userSellers" element={<UserHome />} />
        <Route path="/userAuctioning" element={<UserHome />} />
        <Route path="/userProfile" element={<UserRegister />} />
      </Route>

      <Route path="/admin/adminLogin" element={<AdminLogin   />} />
      <Route path="/admin" element={<SimpleSidebar />}>
        <Route path="/admin/listUsers" element={<AdminListUsers />} />
        <Route path="/admin/listAuctions" element={<AdminHome />} />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </React.StrictMode>
  </Provider>
);

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
import AdminListUsers from "./screens/Admin/AdminListUsers.jsx";
import AdminLogin from "./screens/Admin/AdminLogin.jsx";
import PrivateRouteAdmin from "./components/Admin/PrivateRouteAdmin.jsx";
import UserAuctioning from "./screens/User/UserAuctioning.jsx";
import EnglishAuctionCreateForm from "./screens/User/EnglishAuctionCreateForm.jsx";
import ReverseAuctionCreateForm from "./screens/User/ReverseAuctionCreateForm.jsx";
import EnglishAuctionDetail from "./screens/User/EnglishAuctionDetail.jsx";
import ReverseAuctionDetail from "./screens/User/ReverseAuctionDetail.jsx";
import PrivateRoute from "./components/User/PrivateRoute.jsx";
import AdminListEnglishAuctions from "./screens/Admin/AdminListEnglishAuctions.jsx";
import AdminListReverseAuctions from "./screens/Admin/AdminListReverseAuctions.jsx";
import AuctioneerProfile from "./screens/User/AuctioneerProfile.jsx";
import AdminListAuctioneers from "./screens/Admin/AdminListAuctioneers.jsx";
import UserAuctions from "./screens/User/UserAuctions.jsx";
import ChatProvider from "./context/ChatProvider.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/userRegister" element={<UserRegister />} />
      <Route path="/userLogin" element={<UserLogin />} />
      <Route path="/" element={<App />}>
        <Route path="/" element={<UserHome />} />
        <Route path="/UserAuctions" element={<UserAuctions />} />
        <Route
          path="/userEnglishAuctions/details"
          element={<EnglishAuctionDetail />}
        />
        <Route
          path="/userReverseAuctions/details"
          element={<ReverseAuctionDetail />}
        />
        <Route path="" element={<PrivateRoute />}>
          <Route
            path="/userAuctioning/auctioneerProfile"
            element={<AuctioneerProfile />}
          />
          <Route path="/userAuctioning" element={<UserAuctioning />} />
          <Route
            path="/userAuctioning/createEnglishAuction"
            element={<EnglishAuctionCreateForm />}
          />
          <Route
            path="/userAuctioning/createReverseAuction"
            element={<ReverseAuctionCreateForm />}
          />
        </Route>
      </Route>

      <Route path="/admin/adminLogin" element={<AdminLogin />} />
      <Route path="" element={<PrivateRouteAdmin />}>
        <Route path="/admin/listUsers" element={<AdminListUsers />} />
        <Route
          path="/admin/listAuctioneers"
          element={<AdminListAuctioneers />}
        />
        <Route
          path="/admin/listEnglishAuctions"
          element={<AdminListEnglishAuctions />}
        />
        <Route
          path="/admin/listReverseAuctions"
          element={<AdminListReverseAuctions />}
        />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <ChatProvider>
        <ChakraProvider>
          <RouterProvider router={router} />
        </ChakraProvider>
      </ChatProvider>
    </React.StrictMode>
  </Provider>
);

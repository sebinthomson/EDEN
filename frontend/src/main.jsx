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
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import UserRegister from "./screens/UserRegister.jsx";
import UserLogin from "./screens/UserLogin.jsx";
import UserOTP from "./screens/UserOTP.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/userRegister" element={<UserRegister />} />
      <Route path="/userLogin" element={<UserLogin />} />
      <Route path="/userOTP" element={<UserOTP />} />
      <Route path="/" element={<App />}>
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

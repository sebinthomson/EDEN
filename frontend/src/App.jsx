import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/User/Navbar";

// eslint-disable-next-line react/prop-types, no-unused-vars
function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;

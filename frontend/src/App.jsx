import { Outlet } from "react-router-dom";
import Navbar from "./components/User/Navbar";
import Footer from "./components/User/Footer";

// eslint-disable-next-line react/prop-types, no-unused-vars
function App() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;

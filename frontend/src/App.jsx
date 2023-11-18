import { Outlet } from "react-router-dom";
import Navbar from "./components/User/Navbar";

// eslint-disable-next-line react/prop-types, no-unused-vars
function App({ user }) {
  return (
    <>
      {user && <Navbar />}
      <Outlet />
    </>
  );
}

export default App;

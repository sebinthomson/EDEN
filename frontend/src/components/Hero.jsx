import { useSelector } from "react-redux";

const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return <div className="py-5">
    {userInfo ? <><h1>Welcome {userInfo.name}</h1>
    <p>Go to dropdown on right top corner to logout and edit profile</p></> : <h1>Please Login for further Actions</h1>}
  </div>;
};

export default Hero;

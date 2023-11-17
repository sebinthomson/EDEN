import { Image } from "react-bootstrap";

const Logo = () => {
  return (
    <div style={{display: 'flex',justifyItems:"center", flexDirection:'column', alignItems:"center"}}>
      <Image
        src="../../public/Images/logo.png"
        style={{ maxWidth: "4.5rem", height: "auto" }}
      ></Image>
      <h5 style={{letterSpacing:".5rem"}}><strong>EDEN</strong></h5>
    </div>
  );
};

export default Logo;

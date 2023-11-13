import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useAdminLogoutMutation, useLogoutMutation } from "../slices/userAdminApiSlice";
import { logout } from "../slices/authSlice";
import { adminLogout } from "../slices/adminAuthSlice";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const Header = ({ admin }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const { adminInfo } = useSelector((state) => state.adminAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const [adminLogoutApiCall] = useAdminLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };
  const adminLogoutHandler = async () => {
    try {
      await adminLogoutApiCall().unwrap()
      dispatch(adminLogout())
      navigate('/admin/login')
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          {admin ? (
            <LinkContainer to="/admin/">
              <Navbar.Brand>Admin Panel</Navbar.Brand>
            </LinkContainer>
          ) : (
            <LinkContainer to="/">
              <Navbar.Brand>MERN App</Navbar.Brand>
            </LinkContainer>
          )}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {admin ? adminInfo ? (
                <>
                  <LinkContainer to="/admin/logout">
                    <Nav.Link onClick={adminLogoutHandler}>
                      <FaSignOutAlt /> Logout
                    </Nav.Link>
                  </LinkContainer>
                </>
              ): (
                <>
                  <LinkContainer to="/admin/logout">
                    <Nav.Link onClick={adminLogoutHandler}>
                      <FaSignOutAlt /> Login
                    </Nav.Link>
                  </LinkContainer>
                </>
              ) : userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <FaSignInAlt /> Sign In
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/register">
                    <Nav.Link>
                      <FaSignOutAlt /> Sign Up
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;

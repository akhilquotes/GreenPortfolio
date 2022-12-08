import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useUserAuth } from "../context/UserAuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useFirestore } from "../context/FirestoreContext";
import { NavDropdown, Badge, Button } from "react-bootstrap";

const NavbarLayout = ({
  user,
  setUser,
  setPortfolio,
  greenCoins,
  setGreenCoins,
}) => {
  const navigate = useNavigate();
  const { getDocument, getDocuments } = useFirestore();
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  const { logOut, userLogged } = useUserAuth();
  const linkStyle = {
    color: "#ffffff8c",
    textDecoration: "none",
  };
  const ddStyle = {
    color: "black",
    textDecoration: "none",
  };
  useEffect(() => {
    if (userLogged === null || userLogged === undefined) {
    } else {
      if (Object.keys(userLogged).length > 0) {
        if (Object.keys(user).includes("Email") === false) {
          getDocument(userLogged.email, "Users", "Email").then((x) => {
            console.log(x.data());
            setUser(x.data());
          });
          getDocuments(userLogged.email, "UserPortfolio", "Email").then((x) => {
            x.length > 0 && setPortfolio(x);
          });
          getDocuments(userLogged.email, "GreenCoins", "Email").then((x) => {
            x.length > 0 && setGreenCoins(x);
            console.log(x);
          });
        }
      }
    }
  });
  const getTotalCoins = () => {
    let count = 0;
    greenCoins.forEach((x) => {
      count += x.Coins;
    });
    return count;
  };
  return (
    <>
      <Navbar bg="success" variant="dark">
        <Container>
          <Navbar.Brand>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              Green Portfolio
            </Link>
          </Navbar.Brand>
          <Nav>
            {userLogged === null || Object.keys(userLogged).length === 0 ? (
              <>
                <Nav.Link>
                  <Link to="/signup" style={linkStyle}>
                    SignUp
                  </Link>
                </Nav.Link>
                <Nav.Link>
                  <Link to="/" style={linkStyle}>
                    Login
                  </Link>
                </Nav.Link>
              </>
            ) : (
              <>
                <Button
                  className="badge position-relative"
                  variant="warning"
                  onClick={() => {
                    window.location.href = "/greencoin";
                  }}
                >
                  Green Coins
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {getTotalCoins()}
                  </span>
                </Button>

                <NavDropdown
                  title={user.FirstName + " " + user.LastName}
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item>
                    <Link to="/myaccount" style={ddStyle}>
                      Account
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    {user.Email === "johnhenry2@gmail.com" ? (
                      <Link to="/mywallet" style={ddStyle}>
                        Company Wallet
                      </Link>
                    ) : (
                      <Link to="/mywallet" style={ddStyle}>
                        Wallet
                      </Link>
                    )}
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Link to="/myportfolio" style={ddStyle}>
                      Portfolio
                    </Link>
                  </NavDropdown.Item>
                  <NavDropdown.Item>
                    <Link to="" style={ddStyle} onClick={handleLogout}>
                      Logout
                    </Link>
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarLayout;

import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarLayout from "./components/Navbar";
import { FirestoreContextProvider } from "./context/FirestoreContext";
import { RapydContextProvider } from "./context/RapydContext";
import Portfolio from "./components/portfolio/Portfolio";
import { useState } from "react";
import MyAccount from "./components/MyAccount";
import MyWallet from "./components/wallet/MyWallet";
import GreenCoin from "./components/GreenCoin";

function App() {
  const [user, setUser] = useState({
    RapydAcc: { ewallet_id: "" },
  });
  const [portfolio, setPortfolio] = useState([]);
  const [greenCoins, setGreenCoins] = useState([]);
  return (
    <UserAuthContextProvider>
      <FirestoreContextProvider>
        <RapydContextProvider>
          <NavbarLayout
            user={user}
            setUser={setUser}
            setPortfolio={setPortfolio}
            greenCoins={greenCoins}
            setGreenCoins={setGreenCoins}
          />
          <Container fluid>
            <Routes>
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/myaccount"
                element={
                  <ProtectedRoute>
                    <MyAccount user={user} setUser={setUser} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mywallet"
                element={
                  <ProtectedRoute>
                    <MyWallet user={user} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/greencoin"
                element={
                  <ProtectedRoute>
                    <GreenCoin
                      user={user}
                      greenCoins={greenCoins}
                      setGreenCoins={setGreenCoins}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/companywallet"
                element={
                  <ProtectedRoute>
                    <MyWallet user={user} setUser={setUser} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  <Login
                    user={user}
                    setUser={setUser}
                    portfolio={portfolio}
                    setPortfolio={setPortfolio}
                  />
                }
              />
              <Route
                path="/signup"
                element={<Signup user={user} setUser={setUser} />}
              />
              <Route
                path="/myportfolio"
                element={
                  <ProtectedRoute>
                    <Portfolio
                      user={user}
                      portfolio={portfolio}
                      setPortfolio={setPortfolio}
                      greenCoins={greenCoins}
                      setGreenCoins={setGreenCoins}
                    />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>
        </RapydContextProvider>
      </FirestoreContextProvider>
    </UserAuthContextProvider>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import { useFirestore } from "../context/FirestoreContext";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const Login = ({ user, setUser, portfolio, setPortfolio }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logIn, userLogged } = useUserAuth();
  const { getDocument, getDocuments } = useFirestore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    try {
      await logIn(data.email, data.password);
      const userDoc = await getDocument(data.email, "Users", "Email");
      const portfolioDoc = await getDocuments(
        data.email,
        "UserPortfolio",
        "Email"
      );
      setUser(userDoc.data());
      portfolioDoc && setPortfolio(portfolioDoc);
      navigate("/myportfolio");
    } catch (err) {
      Swal.fire("Invalid email/password", "", "error");
    }
  };

  useEffect(() => {
    if (userLogged) {
      navigate("/myportfolio");
    }
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div style={{ marginTop: "15vh" }}>
        <div className="p-4 box">
          <h2 className="mb-3">Login to Green Portfolio</h2>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
                {...register("email", { required: "This field is required" })}
              />
              <span className="text-danger">
                {errors.email ? errors.email.message : ""}
              </span>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                {...register("password", {
                  required: "This field is required",
                })}
              />
              <span className="text-danger">
                {errors.password ? errors.password.message : ""}
              </span>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="success" type="Submit">
                Log In
              </Button>
            </div>
          </Form>
        </div>
        <div className="p-4 box mt-3 text-center">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

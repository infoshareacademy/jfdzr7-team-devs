import { Alert, Button, Snackbar, TextField } from "@mui/material";

import { signInWithEmailAndPassword } from "@firebase/auth";
import React, { useState } from "react";
import { StyledLogin } from "./Login.styled";
import { auth } from "../../../api/firebase";
import { NavLink } from "react-router-dom";

export const Login = () => {
  const defaultLoginForm = {
    email: "",
    password: "",
  };

  const [loginForm, setLoginForm] = useState(defaultLoginForm);
  const [showAlert, setShowAlert] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowAlert(false);
    setResponseMessage("");
  };

  const updateLoginForm = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const loginUser = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, loginForm.email, loginForm.password)
      .then((jwt) => {})
      .catch((e) => {
        setResponseMessage(e.code);
        setShowAlert(true);
      });
    setLoginForm(defaultLoginForm);
  };

  return (
    <StyledLogin>
      <h1>Log in</h1>

      <form onSubmit={loginUser}>
        <TextField
          required
          value={loginForm.email}
          name="email"
          label="email"
          variant="filled"
          onChange={updateLoginForm}
        />

        <TextField
          required
          value={loginForm.password}
          name="password"
          label="password"
          type="password"
          variant="filled"
          onChange={updateLoginForm}
        />

        <Button type="submit" variant="contained">
          Login
        </Button>

        <div>
          <p>
            Don't have an account? <NavLink to="/register">Register</NavLink>
          </p>
          <p>
            <NavLink to="/forgot">Forgot your password?</NavLink>
          </p>
        </div>
      </form>

      <Snackbar
        open={showAlert}
        autoHideDuration={2000}
        onClose={handleClose}
        message={responseMessage}
      >
        <Alert severity="warning">{responseMessage}</Alert>
      </Snackbar>
    </StyledLogin>
  );
};

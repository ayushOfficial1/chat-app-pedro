import { signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, provider } from "../firebase-config";
import Cookies from "js-cookie";
require("../css/Login.css");

const Login = ({ login }) => {
  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      Cookies.set("auth-token", result.user.refreshToken);
      login();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="login-container">
      <div className="login-wrapper">
        <h3>Sign-In with your Google Account to continue</h3>
        <button onClick={googleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;

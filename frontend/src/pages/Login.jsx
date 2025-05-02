import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/",{email,password});
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMessage("Login success Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <fieldset>
        <legend>Login</legend>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /> <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /> <br />
        <button onClick={handleLogin}>login</button>
        <p>New User.! want to <Link to='/'>Register Here.?</Link></p>
        {message && <p>{message}</p>}
      </fieldset>
    </div>
  );
};

export default Login;

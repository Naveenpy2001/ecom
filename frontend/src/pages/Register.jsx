import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom'
import axios from 'axios'


const Register = () => {
  const [email,setEmail] = useState('')
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [message,setMeesage] = useState('')

  const navigate = useNavigate()

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register/",{email,password,username});
      console.log(res);
      
      setMeesage("Register was Success")
      setTimeout(() => navigate('/login'),1500);
    } catch (error) {
      console.log(error);
      
    }
  }

  return (
    <>
    <fieldset>
      <legend>Register</legend>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/> <br />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/> <br />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/> <br />
      <button onClick={handleRegister}>Register</button>
      <p>Already User.! want to <Link to='/login'>Login. Here.?</Link></p>

      {
        setMeesage && <p>{message}</p>
      }
    </fieldset>
    </>
  )
}

export default Register
import React, { useState, useContext } from 'react'
import { Auth } from "aws-amplify";
import * as MdIcons from "react-icons/md";
import { AuthContext } from "../../contexts/AuthContext";
import style from '../../css/Authentication/ViewLogin.module.css';

function ViewLogin(props) {
  const context = useContext(AuthContext);
  var initialForm = {username: "", password: "", error: ""};

  // State - storage
  const [formState, setformState] = useState(initialForm)

  async function submit() {
    const {username, password} = formState;
    if (username === "") {
      context.spawnNotification("ERROR", "Error", "Username field is required.");
      return;
    }
    if (password === "") {
      context.spawnNotification("ERROR", "Error", "Password field is required.");
      return;
    }

    try {
      await Auth.signIn(username, password);
      context.spawnNotification("SUCCESS", `Welcome ${username}`, "Successfully logged in.");
    } catch(error) {
      if (error.message === "User is not confirmed.") {
        props.set_Username(username)
      }
      context.spawnNotification("ERROR", "Error", error.message);
    }
  }

  function onChange(e) {
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value,
      error: "",
    }));
  }

  function onKeyPress(e) {
    if (e.key === "Enter") {
      submit()
    }
  }

  return (
    <div className={style.container}>
      <div className={style.form} onKeyPress={onKeyPress}>
        <div className={style.title}>
          <h1>Welcome to Cryptalk.</h1>
          <h5>Enter your details to login.</h5>
        </div>
        { formState.error.includes("not confirmed") && <u onClick={() => props.set_View("CONFIRM")} className="error">Click here to confirm your email.</u>}

        {/* Username */}
        <label htmlFor="username"><MdIcons.MdPermIdentity/> &nbsp; Username</label>
        <input name="username" onChange={onChange} placeholder="Username.." id="cypress-usernameField"/>

        {/* Password */}
        <label htmlFor="password"><MdIcons.MdLockOutline/> &nbsp; Password</label>
        <input name="password" onChange={onChange} placeholder="Password.." type="password" id="cypress-passwordField"/>

        {/* Actions */}
        <button onClick={submit} id="cypress-signIn">Sign in</button>
        <u onClick={() => props.set_View("REGISTRATION")}>Don't have an account?</u>
        <u style={{fontSize:"9pt", opacity:"0.7", marginTop:"0.5ex"}} onClick={() => props.set_View("RECOVERY")}>Forgot your password?</u>
      </div>
      <div className={style.photo}>
        <img src={process.env.PUBLIC_URL + '/vector_assets/login-1.svg'} alt="Two figures interacting with a web-application."/>
      </div>
    </div>
  )
}

export default ViewLogin

import React, { useState } from 'react'
import { Auth } from "aws-amplify";
import * as MdIcons from "react-icons/md";
import style from '../../css/Authentication/ViewLogin.module.css';

function ViewLogin(props) {
  var initialForm = {username: "", password: "", error: ""};

  // State - storage
  const [formState, setformState] = useState(initialForm)

  async function submit() {
    const {username, password} = formState;
    if (username === "") { setformState(() => ({...formState, error: "Username field is required."})); return; }
    if (password === "") { setformState(() => ({...formState, error: "Password field is required."})); return; }

    try {
      await Auth.signIn(username, password);
    } catch(error) {
      if (error.message === "User is not confirmed.") {
        props.set_Username(username)
      }
      setformState(() => ({...formState, error: error.message}));
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
          <h1>Login</h1>
        </div>
        {/* Error messages */}
        { formState.error === "" ? <></> : <p className="error">{formState.error}</p>}
        { formState.error.includes("not confirmed") && <u onClick={() => props.set_View("CONFIRM")} className="error">Click here to confirm your email.</u>}

        {/* Username */}
        <label htmlFor="username"><MdIcons.MdPermIdentity/> Username</label>
        <input name="username" onChange={onChange} placeholder="Username.." id="cypress-usernameField"/>

        {/* Password */}
        <label htmlFor="password"><MdIcons.MdLockOutline/> Password</label>
        <input name="password" onChange={onChange} placeholder="Password.." type="password" id="cypress-passwordField"/>

        {/* Actions */}
        <button onClick={submit} id="cypress-signIn">Sign in</button>
        <u onClick={() => props.set_View("REGISTRATION")}>Don't have an account?</u>
        <u onClick={() => props.set_View("RECOVERY")}>Forgot your password?</u>
      </div>
      <div className={style.photo}>
        <img src={process.env.PUBLIC_URL + '/vector_assets/login-1.svg'} alt="Two figures interacting with a web-application."/>
      </div>
      
    
    </div>
    
  )
}

export default ViewLogin

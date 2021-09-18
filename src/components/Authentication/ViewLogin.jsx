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
      <div className={style.title}>
        <h1>Login</h1>
      </div>
      <div className={style.form} onKeyPress={onKeyPress}>
        {/* Error messages */}
        { formState.error === "" ? <></> : <p className="error">{formState.error}</p>}
        { formState.error.includes("not confirmed") && <u onClick={() => props.set_View("CONFIRM")} className="error">Click here to confirm your email.</u>}

        {/* Username */}
        <label htmlFor="username"><MdIcons.MdPermIdentity/> Username</label>
        <input name="username" onChange={onChange} placeholder="Username.."/>

        {/* Password */}
        <label htmlFor="password"><MdIcons.MdLockOutline/> Password</label>
        <input name="password" onChange={onChange} placeholder="Password.." type="password"/>

        {/* Actions */}
        <button onClick={submit}>Sign in</button>
        <u onClick={() => props.set_View("REGISTRATION")}>Don't have an account?</u>
        <u onClick={() => props.set_View("RECOVERY")}>Forgot your password?</u>
      </div>
    </div>
  )
}

export default ViewLogin
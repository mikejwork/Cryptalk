import React, { useState } from 'react'
import { Auth } from "aws-amplify";
import * as MdIcons from "react-icons/md";
import style from '../../css/Authentication/ViewConfirm.module.css';

function ViewConfirm(props) {
  var initialForm = {authCode: "", error: ""};

  // State - storage
  const [formState, setformState] = useState(initialForm)

  async function submit() {
    const { authCode } = formState;
    try {
      await Auth.confirmSignUp(props._Username, authCode);
      props.set_View("LOGIN")
    } catch(error) {
      setformState(() => ({...formState, error: error.message}));
    }
  }

  async function resend() {
    try {
      await Auth.resendSignUp(props._Username)
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
        <h1>Confirm</h1>
      </div>
      <div className={style.form} onKeyPress={onKeyPress}>
        {/* Error messages */}
        { formState.error === "" ? <></> : <p className="error">{formState.error}</p>}

        {/* Authcode */}
        <label htmlFor="authCode"><MdIcons.MdLockOutline/> Confirmation code has been sent to {props._SentTo ? props._SentTo : <>your email</>}.</label>
        <input name="authCode" onChange={onChange} placeholder="_ _ _ _ _ _"/>
        <button onClick={submit}>Confirm</button>
        <u onClick={resend}>Resend confirmation code</u>
      </div>
    </div>
  )
}

export default ViewConfirm

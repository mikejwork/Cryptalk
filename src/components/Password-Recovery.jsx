import React, { useState, useContext } from 'react';
import { Redirect } from "react-router-dom";
import { Auth } from "aws-amplify";
import { AuthContext } from "../contexts/AuthContext";

import '../css/Login.css';

import * as MdIcons from "react-icons/md";


function FormRecover(props) {
  const initialForm = { username: "", error_message: "" };
  const [formState, setFormState] = useState(initialForm)

  async function process_confirm() {
    const { username } = formState;
    try {
      await Auth.forgotPassword(username).then(() => {
        //why wont you save an email? Please fix
        props.setFormUserName(username)
        props.updateFormState("password_recover")
      });
    } catch (e) {
      setFormState(() => ({ ...formState, error_message: e.message }));
    }
  }

  function onChange(e) {
    setFormState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  const process_keypress = e => {
    if (e.key === 'Enter') {
        process_confirm();
    }
  };


  return (
    <>
      <section className="form-top">
        <h1>Recover your password</h1>
      </section>
      <section className="form-divider">
        <div className="custom-shape-divider-top-1629434998">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
          </svg>
        </div>
      </section>
      <section className="form-bottom" onKeyPress={process_keypress}>
        {formState.error_message === "" ? <></> : <p className="error-text">{formState.error_message}</p>}
        <label htmlFor="username"><MdIcons.MdPermIdentity className="label-icon" />Enter your username: </label>
        <input name="username" onChange={onChange} placeholder="Enter username" />
        <button onClick={process_confirm}>Confirm</button>
      </section>
    </>
  )
}

function FormPassRecover(props) {
  const initialForm = { username: props.form_username, authCode: "", new_password: "", error_message: "" };
  const [formState, setFormState] = useState(initialForm)

  async function process_confirm() {
    const { authCode, new_password } = formState;
    const username = props.form_username;

    try {
      await Auth.forgotPasswordSubmit(username, authCode, new_password).then(() => props.updateFormState("redirect"));
    } catch (e) {
      setFormState(() => ({ ...formState, error_message: e.message }));
    }
  }

  function onChange(e) {
    setFormState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  
  const process_keypress = e => {
    if (e.key === 'Enter') {
        process_confirm();
    }
  };

  return (
    <>
      <section className="form-top">
        <h1>Recover your password</h1>
      </section>
      <section className="form-divider">
        <div className="custom-shape-divider-top-1629434998">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
          </svg>
        </div>
      </section>
      <section className="form-bottom" onKeyPress={process_keypress}>
        {formState.error_message === "" ? <></> : <p className="error-text">{formState.error_message}</p>}
        <label htmlFor="authCode"><MdIcons.MdLockOutline className="label-icon" />Confirmation code has been sent to {props.email_blurred ? <>{props.email_blurred}</> : <>your email.</>}       </label>
        <input name="authCode" onChange={onChange} placeholder="Enter code" />

        <label htmlFor="new_password"><MdIcons.MdLockOutline className="label-icon" />Enter your new password: </label>
        <input name="new_password" onChange={onChange} placeholder="Enter new password" type="password" />
        <button onClick={process_confirm}>Confirm</button>
      </section>
    </>
  )
}


function PasswordRecovery() {
  const context = useContext(AuthContext);
  const [formState, updateFormState] = useState("recover");
  const [email_blurred, setEmailBlurred] = useState("")
  const [form_username, setFormUserName] = useState("")

  if (context.datastore_ready) {
    return (<Redirect to="/login" />)
  }

  return (
    <div className="login-container">
      <div className="login-form-container">
        {formState === "recover" && <FormRecover updateFormState={updateFormState} setEmailBlurred={setEmailBlurred} setFormUserName={setFormUserName} />}
        {formState === "password_recover" && <FormPassRecover updateFormState={updateFormState} email_blurred={email_blurred} form_username={form_username} />}
        {formState === "redirect" && <Redirect to="/authentication" />}
      </div>
    </div>
  )
}

export default PasswordRecovery

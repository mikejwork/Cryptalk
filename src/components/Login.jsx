import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from "react-router-dom";
import { Auth, Hub } from "aws-amplify";
import { AuthContext } from "../contexts/AuthContext";

import '../css/Login.css';
import * as MdIcons from "react-icons/md";


function FormLogin(props) {
  const initialForm = { username: "", password: ""};
  const [formState, setFormState] = useState(initialForm)

  async function process_login() {
    const { username, password } = formState;
    try {
      await Auth.signIn(username, password);
    } catch (error) {

    }
  }

  function onChange(e) {
    setFormState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <>
      <section className="form-top">
        <h1>Login</h1>
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
      <section className="form-bottom">
        <label htmlFor="username"><MdIcons.MdPermIdentity/>Username</label>
        <input name="username" onChange={onChange} placeholder="Type your username"/>

        <label htmlFor="password"><MdIcons.MdLockOutline/>Password</label>
        <input name="password" onChange={onChange} placeholder="Type your password" type="password"/>
        <button name="signin" onClick={process_login}>Sign in</button>
        <span onClick={() => props.updateFormState("register")}>Don't have an account?</span>
      </section>
    </>
  )
}

function FormRegister(props) {
  const initialForm = { firstname: "", lastname: "",username: "",email: "", password: ""};
  const [formState, setFormState] = useState(initialForm)

  async function process_register() {
    const { firstname, lastname, username, email, password } = formState;
    try {
      await Auth.signUp({
          username: formState.username,
          password: formState.password,
          attributes: {
              email: formState.email,          // optional
              given_name: formState.firstname,
              family_name: formState.lastname   // optional - E.164 number convention
              // other custom attributes 
          }
      });
    } catch (error) {
    }
  }

  function onChange(e) {
    setFormState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <div className="login-container">
      <div className="login-form-container">
      <section className="form-top">
        <h1>Register</h1>
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
      <section className="form-bottom">
                <section className="form-name-section">
                    <div className="form-name-div">
                        <label htmlFor="firstname">First Name:</label>
                        <input name="firstname" onChange={onChange} className="form-name-input" type="text" placeholder="Enter your First Name" />
                    </div>
                    <div className="form-name-div">
                        <label htmlFor="lastname">Last Name:</label>
                        <input name="lastname" onChange={onChange} className="form-name-input" type="text" placeholder="Enter your Last name" />
                    </div>
                </section>
                <section className="form-user" >
                    <label htmlFor="username">Username:</label>
                    <input name="username" onChange={onChange} type="text" placeholder="Enter your User Name" />
                     <label htmlFor="email">Email:</label>
                     <input name="email" onChange={onChange} type="text" placeholder="Enter your Email" />
                    <label htmlFor="password">Password: </label>
                    <input name="password" onChange={onChange} type="password" placeholder="Enter your Password" />
                </section>
                <section className="form-terms">
                    <a href="Terms-and-Conditions">Terms and Conditions</a>
                    <a href="Privacy-Policy">Privacy Policy</a>
                    <section className="form-checkbox-section">
                        <div className="form-checkbox">
                            <input className="checkBox" type="checkbox" id="form-terms" />
                            <label className="checkBoxLabel" htmlFor="form-terms" >I agree to the Terms and Conditions</label>
                        </div>
                        <div className="form-checkbox">
                            <input type="checkbox" id="form-privacy" />
                            <label htmlFor="form-privacy">I agree to the Privacy Policy</label>
                        </div>
                    </section>
                </section>
                <button name="signup" onClick={process_register, () => props.updateFormState("confirm")}>Register</button>
                <span onClick={() => props.updateFormState("login")}>Already have an account?</span>

      </section>
      </div>
    </div>
  )
}


function FormConfirm(props) {
  const initialForm = { username: "", code: ""};
  const [formState, setFormState] = useState(initialForm)

  async function confirm_signup() {
    const { username, code } = formState;
    try {
      await Auth.confirmSignUp(username, code);
    } catch (error) {
        console.log('error confirming sign up', error);
    }
  }

  function onChange(e) {
    setFormState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <>
      <section className="form-top">
        <h1>Confirm Sign up</h1>
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
      <section className="form-bottom">
        <label htmlFor="username"><MdIcons.MdPermIdentity/>Username</label>
        <input name="username"  onChange={onChange} placeholder="Type your username"/>

        <label htmlFor="code"><MdIcons.MdLockOutline/>Enter the code sent to your email</label>
        <input name="code"  onChange={onChange} placeholder="Enter code" type="text"/>
        <button name="auth" onClick={confirm_signup}>Sign in</button>
      </section>
    </>
  )
}

function Login() {
  const context = useContext(AuthContext);
  const [formState, updateFormState] = useState("login");

   async function checkUser() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      context.updateUser(user)
      updateFormState("redirect")
    } catch (error) {
      context.updateUser(null)
    }
  }

  async function setAuthListener() {
    Hub.listen("auth", (data) => {
      switch(data.payload.event) {
        case "signIn":
          checkUser()
          break;
        default:
          break;
      }
    });
  }

  useEffect(() => {
    checkUser();
    setAuthListener();

    return () => {
      Hub.remove("auth");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="login-container">
      <div className="login-form-container">
        { formState === "login" && <FormLogin updateFormState={updateFormState}/> }
        { formState === "register" && <FormRegister updateFormState={updateFormState}/> }
        { formState === "confirm" && <FormConfirm updateFormState={updateFormState}/> }
        { formState === "redirect" && <Redirect to="/" /> }
      </div>
    </div>
  )
}

export default Login

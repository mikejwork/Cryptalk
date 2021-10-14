/*
  Author: Braden
  Description:
    A part of AWS Amplify's user creation is for a user to register with an email
    and a code will be sent to the email entered, this code is used to verify the user
  Related PBIs: 2
*/

import React, { useState } from 'react'
import { Auth } from "aws-amplify";
import * as MdIcons from "react-icons/md";
import styles from './index.module.css';

function ViewConfirm(props) {
  //sets all Inputs to 0
  var initialForm = { authCode: "", error: "", code_1: "", code_2: "", code_3: "", code_4: "", code_5: "", code_6: "" };

  // State - storage
  const [formState, setformState] = useState(initialForm)

  //submits the entered code to Amplify Confirm Function
  async function submit() {
    const { code_1, code_2, code_3, code_4, code_5, code_6 } = formState
    const authCode = code_1 + code_2 + code_3 + code_4 + code_5 + code_6;
    try {
      console.log(props._Username)
      await Auth.confirmSignUp(props._Username, authCode);
      props.set_View("LOGIN")
    } catch (error) {
      setformState(() => ({ ...formState, error: error.message }));
    }
  }

  //resend the email with code to user
  async function resend() {
    try {
      await Auth.resendSignUp(props._Username)
    } catch (error) {
      setformState(() => ({ ...formState, error: error.message }));
    }
  }

  //There is only number input required, each change moves the user input to the next digit
  function onChange(e) {
    const { maxLength, value, name } = e.target;
    const codeNumber = name[5];

    //Moves the user to the next input if the input has been filled in
    if (value.length >= maxLength) {
      if (parseInt(codeNumber, 10) < 6) {
        const nextCode = document.querySelector(
          `input[name=code_${parseInt(codeNumber, 10) + 1}]`
        );
        if (nextCode !== null) {
          nextCode.focus();
        }
      }
    }
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value,
      error: "",
    }));
  }

  //submits on enter
  function onKeyPress(e) {
    if (e.key === "Enter") {
      submit()
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.photo}>
        <img src={process.env.PUBLIC_URL + '/vector_assets/confirmation-1.svg'} alt="Two figures interacting with a web-application." />
      </div>

      <div className={styles.form} onKeyPress={onKeyPress}>
        <div className={styles.title}>
          <h1>Confirm</h1>
        </div>
        {/* Error messages */}
        {formState.error === "" ? <></> : <p className="error">{formState.error}</p>}

        {/* Authcode */}
        <label htmlFor="authCode"><MdIcons.MdLockOutline />&nbsp; Confirmation code has been sent to {props._SentTo ? props._SentTo : <>your email</>}.</label>
        <div className={styles.codeInput}>
          <input name="code_1" className={styles.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
          <input name="code_2" className={styles.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
          <input name="code_3" className={styles.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
          <input name="code_4" className={styles.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
          <input name="code_5" className={styles.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
          <input name="code_6" className={styles.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
        </div>
        <button onClick={submit}>Confirm</button>
        <u onClick={resend}>Resend confirmation code</u>
      </div>
    </div>
  )
}

export default ViewConfirm

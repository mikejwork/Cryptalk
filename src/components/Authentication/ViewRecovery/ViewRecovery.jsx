/*
  Author: Michael, Braden
  Description:
    If a user forgets their password, this will be help them recover
    and change it, and use the email that their account is linked to.
    The first state makes the user input their username, after they submit
    an email will be sent to the user's email address, and the page will
    change, and then the user will have to input the code sent, and the
    new password.

  Related PBIs: 3, 5
*/

import React, { useState, useContext } from 'react'
import { Auth } from "aws-amplify";
import * as MdIcons from "react-icons/md";
import { AuthContext } from "../../../contexts/AuthContext";
import style from './index.module.css';

function ViewRecovery(props) {
  const context = useContext(AuthContext);
  var initialForm = { stage: "FIRST", username: "", error: "", AttributeName: "", Destination: "", authCode: "", desired_password: "", code_1: "", code_2: "", code_3: "", code_4: "", code_5: "", code_6: "" };

  // State - storage
  const [formState, setformState] = useState(initialForm)

  //Two states use the same function, the first if submits the username using an amplify function
  //Second state then submits the code provided and the new passwords to amplify.
  async function submit() {
    // First stage -- send confirmation email
    if (formState.stage === "FIRST") {
      try {
        await Auth.forgotPassword(formState.username).then((result) => {
          setformState(() => ({
            ...formState,
            AttributeName: result.CodeDeliveryDetails.AttributeName,
            Destination: result.CodeDeliveryDetails.Destination,
            //if successful move to code and password input state
            stage: "SECOND"
          }));
          context.spawnNotification("SUCCESS", "Success", `Confirmation email sent.`);
          return;
        })
      } catch (error) {
        //creates error
        context.spawnNotification("ERROR", "Error", error.message);
      }
    }
    // Second stage -- change password with code
    if (formState.stage === "SECOND") {
      const { code_1, code_2, code_3, code_4, code_5, code_6 } = formState
      const authCode = code_1 + code_2 + code_3 + code_4 + code_5 + code_6;
      try {
        //submit the username with the code and new password
        await Auth.forgotPasswordSubmit(formState.username, authCode, formState.desired_password).then((result) => {
          if (result === "SUCCESS") {
            context.spawnNotification("SUCCESS", "Success", "Password changed, please login.");
            props.set_View("LOGIN")
          }
        })
      } catch (error) {
        context.spawnNotification("ERROR", "Error", error.message);
      }
    }
  }

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

  function onKeyPress(e) {
    if (e.key === "Enter") {
      submit()
    }
  }

  return (
    <div className={style.container} id="cypress-recoveryPage">

      <div className={style.photo}>
        <img src={process.env.PUBLIC_URL + '/vector_assets/forgot-1.svg'} alt="Two figures interacting with a web-application." />
      </div>

      <div className={style.form} onKeyPress={onKeyPress}>
        <div className={style.title}>
          <h1>Recover your password</h1>
          <h5>Enter your username and a code will be sent to your email.</h5>
        </div>
        {/* Error messages */}
        {formState.error === "" ? <></> : <p className="error">{formState.error}</p>}

        {formState.stage === "FIRST" &&
          <>
            {/* Username */}
            <label htmlFor="username"><MdIcons.MdPermIdentity /> &nbsp; Username</label>

            <input className={style.userInput} name="username" onChange={onChange} placeholder="Username.." />

            {/* Actions */}
            <button onClick={submit}>Recover</button>
            <u onClick={() => props.set_View("LOGIN")} id="cypress-returnToLogin">Return to login</u>

          </>
        }
        {formState.stage === "SECOND" &&
          <>
            {/* Authcode */}
            <label className={style.emailLabel} htmlFor="authCode"><MdIcons.MdLockOutline />&nbsp; Confirmation code has been sent to {formState.Destination ? formState.Destination : <>your email</>}.</label>
            <div className={style.codeInput}>
              <input name="code_1" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
              <input name="code_2" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
              <input name="code_3" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
              <input name="code_4" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
              <input name="code_5" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
              <input name="code_6" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
            </div>
            {/* New password */}
            <label htmlFor="desired_password"><MdIcons.MdLockOutline />&nbsp; New password</label>
            <input className={style.userInput} name="desired_password" onChange={onChange} placeholder="Desired password.." type="password" />

            {/* Confirm */}
            <button onClick={submit}>Confirm</button>
            <u onClick={() => props.set_View("LOGIN")}>Return to login</u>
          </>
        }
      </div>
    </div>
  )
}

export default ViewRecovery

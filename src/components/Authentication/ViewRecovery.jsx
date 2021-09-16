import React, { useState } from 'react'
import { Auth } from "aws-amplify";
import * as MdIcons from "react-icons/md";
import style from '../../css/Authentication/ViewRecovery.module.css';

function ViewRecovery(props) {
  var initialForm = {stage: "FIRST", username: "", error: "", AttributeName: "", Destination: "", authCode: "", desired_password: ""};

  // State - storage
  const [formState, setformState] = useState(initialForm)

  async function submit() {
    // First stage -- send confirmation email
    if (formState.stage === "FIRST") {
      try {
        await Auth.forgotPassword(formState.username).then((result) => {
          setformState(() => ({...formState,
            AttributeName: result.CodeDeliveryDetails.AttributeName,
            Destination: result.CodeDeliveryDetails.Destination,
            stage: "SECOND"
          }));
          return;
        })
      } catch(error) {
        setformState(() => ({...formState, error: error.message}));
      }
    }
    // Second stage -- change password with code
    if (formState.stage === "SECOND") {
      try {
        await Auth.forgotPasswordSubmit(formState.username, formState.authCode, formState.desired_password).then((result) => {
          if (result === "SUCCESS") {
            props.set_View("LOGIN")
          }
        })
      } catch(error) {
        setformState(() => ({...formState, error: error.message}));
      }
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
        <h1>Recover your password</h1>
      </div>
      <div className={style.form} onKeyPress={onKeyPress}>
        {/* Error messages */}
        { formState.error === "" ? <></> : <p className="error">{formState.error}</p>}

        { formState.stage === "FIRST" &&
          <>
            {/* Username */}
            <label htmlFor="username"><MdIcons.MdPermIdentity/> Username</label>
            <input name="username" onChange={onChange} placeholder="Username.."/>

            {/* Actions */}
            <button onClick={submit}>Recover</button>
          </>
        }
        { formState.stage === "SECOND" &&
          <>
            {/* Authcode */}
            <label htmlFor="authCode"><MdIcons.MdLockOutline/> Confirmation code has been sent to {formState.Destination ? formState.Destination : <>your email</>}.</label>
            <input name="authCode" onChange={onChange} placeholder="_ _ _ _ _ _"/>

            {/* New password */}
            <label htmlFor="desired_password"><MdIcons.MdLockOutline/> New password</label>
            <input name="desired_password" onChange={onChange} placeholder="Desired password.." type="password"/>

            {/* Confirm */}
            <button onClick={submit}>Confirm</button>
          </>
        }
      </div>
    </div>
  )
}

export default ViewRecovery

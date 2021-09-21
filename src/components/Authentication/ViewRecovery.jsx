import React, { useState } from 'react'
import { Auth } from "aws-amplify";
import * as MdIcons from "react-icons/md";
import style from '../../css/Authentication/ViewRecovery.module.css';

function ViewRecovery(props) {
  var initialForm = { stage: "FIRST", username: "", error: "", AttributeName: "", Destination: "", authCode: "", desired_password: "", code_1: "", code_2: "", code_3: "", code_4: "", code_5: "", code_6: "" };

  // State - storage
  const [formState, setformState] = useState(initialForm)

  async function submit() {
    // First stage -- send confirmation email
    if (formState.stage === "FIRST") {
      try {
        await Auth.forgotPassword(formState.username).then((result) => {
          setformState(() => ({
            ...formState,
            AttributeName: result.CodeDeliveryDetails.AttributeName,
            Destination: result.CodeDeliveryDetails.Destination,
            stage: "SECOND"
          }));
          return;
        })
      } catch (error) {
        setformState(() => ({ ...formState, error: error.message }));
      }
    }
    // Second stage -- change password with code
    if (formState.stage === "SECOND") {
      const { code_1, code_2, code_3, code_4, code_5, code_6 } = formState
      const authCode = code_1 + code_2 + code_3 + code_4 + code_5 + code_6;
      try {
        await Auth.forgotPasswordSubmit(formState.username, authCode, formState.desired_password).then((result) => {
          if (result === "SUCCESS") {
            props.set_View("LOGIN")
          }
        })
      } catch (error) {
        setformState(() => ({ ...formState, error: error.message }));
      }
    }
  }

  function onChange(e) {
    const { maxLength, value, name } = e.target;
    const codeNumber = name[5];

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
    <div className={style.container}>

      <div className={style.photo}>
        <img src={process.env.PUBLIC_URL + '/vector_assets/forgot-1.svg'} alt="Two figures interacting with a web-application." />
      </div>

      <div className={style.form} onKeyPress={onKeyPress}>
        <div className={style.title}>
          <h1>Recover your password</h1>
        </div>
        {/* Error messages */}
        {formState.error === "" ? <></> : <p className="error">{formState.error}</p>}

        {formState.stage === "FIRST" &&
          <>
            {/* Username */}
            <label htmlFor="username"><MdIcons.MdPermIdentity /> Username</label>
            <input className={style.userInput} name="username" onChange={onChange} placeholder="Username.." />

            {/* Actions */}
            <button onClick={submit}>Recover</button>
          </>
        }
        {formState.stage === "SECOND" &&
          <>
            {/* Authcode */}
            <label className={style.emailLabel} htmlFor="authCode"><MdIcons.MdLockOutline /> Confirmation code has been sent to {formState.Destination ? formState.Destination : <>your email</>}.</label>
            <div className={style.codeInput}>
              <input name="code_1" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
              <input name="code_2" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
              <input name="code_3" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
              <input name="code_4" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
              <input name="code_5" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
              <input name="code_6" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
            </div>

            {/* New password */}
            <label htmlFor="desired_password"><MdIcons.MdLockOutline /> New password</label>
            <input className={style.userInput} name="desired_password" onChange={onChange} placeholder="Desired password.." type="password" />

            {/* Confirm */}
            <button onClick={submit}>Confirm</button>
          </>
        }
      </div>
    </div>
  )
}

export default ViewRecovery

import React, { useState } from 'react'
import { Auth } from "aws-amplify";
import * as MdIcons from "react-icons/md";
import style from './index.module.css';

function ViewConfirm(props) {
  var initialForm = { authCode: "", error: "", code_1: "", code_2: "", code_3: "", code_4: "", code_5: "", code_6: "" };

  // State - storage
  const [formState, setformState] = useState(initialForm)

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

  async function resend() {
    try {
      await Auth.resendSignUp(props._Username)
    } catch (error) {
      setformState(() => ({ ...formState, error: error.message }));
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
        <img src={process.env.PUBLIC_URL + '/vector_assets/confirmation-1.svg'} alt="Two figures interacting with a web-application." />
      </div>

      <div className={style.form} onKeyPress={onKeyPress}>
        <div className={style.title}>
          <h1>Confirm</h1>
        </div>
        {/* Error messages */}
        {formState.error === "" ? <></> : <p className="error">{formState.error}</p>}

        {/* Authcode */}
        <label htmlFor="authCode"><MdIcons.MdLockOutline />&nbsp; Confirmation code has been sent to {props._SentTo ? props._SentTo : <>your email</>}.</label>
        <div className={style.codeInput}>
          <input name="code_1" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
          <input name="code_2" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
          <input name="code_3" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
          <input name="code_4" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
          <input name="code_5" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
          <input name="code_6" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
        </div>
        <button onClick={submit}>Confirm</button>
        <u onClick={resend}>Resend confirmation code</u>
      </div>
    </div>
  )
}

export default ViewConfirm

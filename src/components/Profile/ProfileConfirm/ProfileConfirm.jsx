/*
  Author: Braden
  Description:
    Confirm email change after user changes email in profile edit
  Related PBIs: 6
*/

import React, { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { Auth } from "aws-amplify";

import style from "./index.module.css";

function ProfileConfirm(props) {
  const context = useContext(AuthContext);

  const [formState, setformState] = useState({code: "", error: "", code_1: "", code_2: "", code_3: "", code_4: "", code_5: "", code_6: "" })

  //enter the code given from email
  async function submit() {
    try {
      const { code_1, code_2, code_3, code_4, code_5, code_6 } = formState
      const authCode = code_1 + code_2 + code_3 + code_4 + code_5 + code_6;
      Auth.verifyCurrentUserAttributeSubmit("email", authCode).then(() => {
        Auth.signOut();
      })
    } catch(error) {
      context.spawnNotification("ERROR", "Error", error.message);
    }
  }

  //resends the link to confirm email
  async function resend() {
    try {
      await Auth.verifyCurrentUserAttribute("email");
    } catch(error) {
      if (error.code === "LimitExceededException") {
        context.spawnNotification("ERROR", "Error", error.message);
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
    }));
  }

  return (
    <div className={style.container}>
      <div className={style.title}>
        <h2>Confirm</h2>
        <h5 className="subcomment">Enter the confirmation code sent to <strong>{context.user.attributes.email}</strong></h5>
        <h5 className="subcomment">You will be logged-out after confirming, and will have to login again.</h5>
      </div>
      <div className={style.codeInput}>
              <input name="code_1" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
              <input name="code_2" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
              <input name="code_3" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
              <input name="code_4" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
              <input name="code_5" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
              <input name="code_6" className={style.digitCode} onChange={onChange} placeholder="_" maxLength="1" />
            </div>

      <div className={style.actions}>
        <button onClick={submit}>Confirm</button>
        <br/>
        <u onClick={resend}>Resend code</u>
        <u onClick={() => props.set_View("MAIN")}>Return to profile</u>
      </div>
    </div>
  )
}

export default ProfileConfirm

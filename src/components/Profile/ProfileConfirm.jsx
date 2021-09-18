import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Auth } from "aws-amplify";

import style from "../../css/Profile/ProfileConfirm.module.css";

function ProfileConfirm(props) {
  const context = useContext(AuthContext);

  const [formState, setformState] = useState({code: "", error: ""})

  async function submit() {
    try {
      Auth.verifyCurrentUserAttributeSubmit("email", formState.code).then(() => {
        Auth.signOut();
      })
    } catch(error) {
      setformState(() => ({
        ...formState,
        error: error.message,
      }));
    }
  }

  async function resend() {
    try {
      await Auth.verifyCurrentUserAttribute("email");
    } catch(error) {
      if (error.code === "LimitExceededException") {
        setformState(() => ({
          ...formState,
          error: error.message,
        }));
      }
    }
  }

  function onChange(e) {
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
      <div className={style.info}>
        {/* Error */}
        { formState.error === "" ? <></> : <p style={{alignSelf: "center"}} className="error">{formState.error}</p>}

        {/* Email */}
        <label htmlFor="code">Confirmation code</label>
        <input name="code" onChange={onChange} placeholder="_ _ _ _ _ _" type="text"/>
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

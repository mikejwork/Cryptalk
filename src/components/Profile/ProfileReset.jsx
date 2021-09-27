import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Auth } from "aws-amplify";

import style from "../../css/Profile/ProfileReset.module.css";

function ProfileReset(props) {
  const context = useContext(AuthContext);

  const [formState, setformState] = useState({oldPassword: "", newPassword: ""})

  async function submit() {
    const { oldPassword, newPassword } = formState;

    try {
      await Auth.changePassword(context.user, oldPassword, newPassword).then((result) => {
        if (result === "SUCCESS") {
          context.spawnNotification("SUCCESS", "Success", "Password has been reset.");
          Auth.signOut();
        }
      })
    } catch(error) {
      console.log(error)
      switch(error.code) {
        case "NotAuthorizedException":
          // setformState(() => ({...formState, error: error.message}));
          context.spawnNotification("ERROR", "Error", error.message);
          break;
        case "InvalidPasswordException":
          // setformState(() => ({...formState, error: error.message}));
          context.spawnNotification("ERROR", "Error", error.message);
          break;
        case "InvalidParameterException":
          // setformState(() => ({...formState, error: "Please fill in the required fields."}));
          context.spawnNotification("ERROR", "Error", "Please fill in the required fields.");
          break;
        case "LimitExceededException":
          // setformState(() => ({...formState, error: "Please fill in the required fields."}));
          context.spawnNotification("ERROR", "Error", error.message);
          break;
        default:
          break;
      }
    }
  }

  function onChange(e) {
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value,
    }));
  }

  function onKeyPress(e) {
    if (e.key === "Enter") {
      submit()
    }
  }

  return (
    <div className={style.container} onKeyPress={onKeyPress}  id="cypress-changePasswordPage">
      <div className={style.title}>
        <h2>Change password</h2>
        <h5 className="subcomment">Enter your old password and desired password below.</h5>
      </div>
      <div className={style.info}>
        {/* Old password */}
        <input name="oldPassword" onChange={onChange} placeholder="Current password.." type="password"/>

        {/* New password */}
        <input name="newPassword" onChange={onChange} placeholder="Desired password.." type="password"/>
      </div>

      <div className={style.actions}>
        <button onClick={submit}>Change</button>
        <br/>
        <u onClick={() => props.set_View("MAIN")}  id="cypress-returnToProfile">Return to profile</u>
      </div>
    </div>
  )
}

export default ProfileReset

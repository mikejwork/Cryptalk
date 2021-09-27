import React, { useState, useEffect, useContext } from 'react'
import { Auth, Storage } from "aws-amplify";
import * as MdIcons from "react-icons/md";
import { AuthContext } from "../../contexts/AuthContext";
import style from '../../css/Authentication/ViewRegistration.module.css';

import PrivacyPolicy from '../../components/Legal/PrivacyPolicy';
import TermsAndConditions from '../../components/Legal/TermsAndConditions';

function ViewRegistration(props) {
  const context = useContext(AuthContext);
  var initialForm = { username: "", password: "", email: "", avatar: null, error: "" };

  // State - storage
  const [formState, setformState] = useState(initialForm)
  const [_Legal, set_Legal] = useState(false)
  const [_Page, set_Page] = useState("DEFAULT")

  // useEffect
  useEffect(() => {
    // Get an avatar on start
    get_avatar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Avatar generation
  async function get_avatar() {
    // Change the number below depending on how many default_avatars we have
    var random = Math.floor(Math.random() * 254);
    const response = await fetch(process.env.PUBLIC_URL + "/default_avatars/" + random + ".jpg");
    const blob = await response.blob();
    setformState(() => ({ ...formState, avatar: blob, error: "" }));
  }

  // Events
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

  async function onFileChange(e) {
    const file = e.target.files[0];
    if (!file) { return; }
    if (!file.type.startsWith("image/")) { return; }

    await setformState(() => ({ ...formState, avatar: file, error: "" }))

    try {
      let src = URL.createObjectURL(file);
      document.getElementById("avatar_preview").src = src;
    } catch (error) {
      context.spawnNotification("ERROR", "Error", error.message);
      // setformState(() => ({ ...formState, error: error.message }))
    }
  }

  // Registration logic
  async function submit() {
    const { username, password, email, avatar } = formState;

    // Validation checks
    if (username === "" || password === "" || email === "") {
      // setformState(() => ({ ...formState, error: "Please fill in the required fields." }));
      context.spawnNotification("ERROR", "Error", "Please fill in the required fields.");
      return;
    }

    if (!_Legal) {
      // setformState(() => ({ ...formState, error: "You can't create an account without accepting our Terms & Conditions and Privacy Policy." }));
      context.spawnNotification("ERROR", "Error", "You can't create an account without accepting our Terms & Conditions and Privacy Policy.");
      return;
    }

    try {
      // Register and save profile pic
      await Auth.signUp({ username, password, attributes: { email } }).then(async (result) => {
        await Storage.put(result.userSub + ".jpg", avatar);
        props.set_SentTo(result.codeDeliveryDetails.Destination)
        context.spawnNotification("SUCCESS", "Success", "Account created, please confirm your email.");
      });
      // Move onto confirm
      props.set_Username(username)
      props.set_View("CONFIRM")
    } catch (error) {
      if (error.message) {
        // setformState(() => ({ ...formState, error: error.message }));
        context.spawnNotification("ERROR", "Error", error.message);
      }
    }
  }

  return (
    <div className={style.container}>
      { _Page === "TERMS" &&
        <>
          <div className={style.form} onKeyPress={onKeyPress}>
            <div className={style.title}>
              <h1>Terms & Conditions</h1>
              <h5>Scroll & Read through our terms and conditions before you begin using our site.</h5>
            </div>
            <div className={style.legalContainer}>
              <TermsAndConditions padding={false} />
            </div>
            <MdIcons.MdKeyboardArrowLeft className={style.returnButton} onClick={() => set_Page("DEFAULT")} />
          </div>
        </>
      }
      { _Page === "PRIVACY" &&
        <>
          <div className={style.form} onKeyPress={onKeyPress}>
            <div className={style.title}>
              <h1>Privacy Policy</h1>
              <h5>Scroll & Read through our privacy policy before you begin using our site.</h5>
            </div>
            <div className={style.legalContainer}>
              <PrivacyPolicy padding={false} />
            </div>
            <MdIcons.MdKeyboardArrowLeft className={style.returnButton} onClick={() => set_Page("DEFAULT")} />
          </div>
        </>
      }

      {_Page === "DEFAULT" &&
        <>
          <div className={style.form} onKeyPress={onKeyPress}>
            <div className={style.title}>
              <h1>Registration</h1>
              <h5>Enter your details below to sign up, and accept our terms to start chatting.</h5>
            </div>
            {/* Error messages */}
            {formState.error === "" ? <></> : <p className="error">{formState.error}</p>}

            {/* Username */}
            <label htmlFor="username"><MdIcons.MdPermIdentity />&nbsp; Username</label>
            <input name="username" onChange={onChange} placeholder="Username.." />

            {/* Password */}
            <label htmlFor="password"><MdIcons.MdLockOutline /> &nbsp; Password</label>
            <input name="password" onChange={onChange} placeholder="Password.." type="password" />

            {/* Email */}
            <label htmlFor="email"><MdIcons.MdMailOutline /> &nbsp; Email address</label>
            <input name="email" onChange={onChange} placeholder="Email address.." type="email" />

            {/* Avatar */}
            <div className={style.avatarForm}>
              <div className={style.fileDiv}>
                <label htmlFor="avatar"><MdIcons.MdPermIdentity /> &nbsp; Avatar</label>
                <input name="avatar" id="avatar" onChange={onFileChange} type="file" />
              </div>
              <div className={style.avatarDiv}>
                <img src={formState.avatar ? URL.createObjectURL(formState.avatar) : ""} id="avatar_preview" alt="" width="100" height="100" className={style.avatar} />
                <button className={style.avatarButton} onClick={get_avatar}><MdIcons.MdRefresh/></button>
              </div>
            </div>


            {/* Legal */}
            <label className={style.confirmLabel} htmlFor="legal">
              { _Legal ?
                <MdIcons.MdCheckBox style={{cursor:"pointer", color:"var(--bg-accent)"}} onClick={() => set_Legal(!_Legal)}/>
                :
                <MdIcons.MdCheckBoxOutlineBlank style={{cursor:"pointer"}} onClick={() => set_Legal(!_Legal)}/>
              }
              &nbsp;I have read, and agree to the &nbsp; <u onClick={() => set_Page("TERMS")}>Terms & Conditions</u> &nbsp;and&nbsp; <u onClick={() => set_Page("PRIVACY")}>Privacy Policy</u>
            </label>
            {/* Actions */}
            <button onClick={submit}>Sign up</button>
            <u onClick={() => props.set_View("LOGIN")}>Already have an account?</u>
          </div>
        </>
      }

      <div className={style.photo} onKeyPress={onKeyPress}>
        <img src={process.env.PUBLIC_URL + '/vector_assets/registration-1.svg'} alt="Two figures interacting with a web-application." />
      </div>
    </div>
  )
}

export default ViewRegistration

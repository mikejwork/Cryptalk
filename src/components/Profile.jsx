import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from "../contexts/AuthContext";
import { Redirect } from "react-router-dom";
import { Storage, DataStore, Auth } from "aws-amplify";
import { Friends } from '../models';

import { useSpring, animated } from 'react-spring';
import * as MdIcons from "react-icons/md";
import '../css/Profile.css';

function ViewMain(props) {
  const context = useContext(AuthContext)

  // State
  const [avatar, setAvatar] = useState(undefined)
  const [friendCount, setfriendCount] = useState(0)
  const [channelCount, setchannelCount] = useState(0)

  // Animations
  const styling = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 }
  })

  useEffect(() => {
    fetch_avatar()
    setchannelCount(0)

    if (context.datastore_ready) {
      fetch_friends()
      const friends_subscription = DataStore.observe(Friends).subscribe(() => fetch_friends());
      return () => { friends_subscription.unsubscribe() }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.datastore_ready])

  async function fetch_avatar() {
    const result = await Storage.get(context.user.attributes.sub + '.jpg', { level: 'public' });
    setAvatar(result)
  }

  async function fetch_friends() {
    DataStore.query(Friends).then((result) => {
      setfriendCount(result[0].list.length)
    })
  }

  return (
    <>
      <animated.div style={styling} className="profile-main">
        <div className="profile-main-title">
          <h2>Profile</h2>
          <h6>View your profile details below.</h6>
        </div>
        <hr />
        <div className="profile-main-avatar-container">
          <img className="profile-main-avatar" src={avatar} alt=" " />
          <div className="profile-main-avatar-overlay" onClick={() => props.setView("edit")}><span className="avatar-overlay-text"><MdIcons.MdOpenInNew className="icon-spacer" />Edit</span></div>
        </div>
        <div className="profile-main-username">
          <h2>{context.user.username}</h2>
        </div>
        <div className="profile-main-email">
          <h4><MdIcons.MdOpenInNew className="icon-spacer" onClick={() => props.setView("edit")} />{context.user.attributes.email}</h4>
          {!context.user.attributes.email_verified && <span className="profile-main-email-warning" onClick={() => props.setView("confirm")}><MdIcons.MdWarning className="icon-spacer" />Click here to verify your email</span>}
        </div>
        <div className="profile-main-stats">
          <div className="profile-main-stats-friends">
            <MdIcons.MdSupervisorAccount/>
            <h2>Friends</h2>
            <p>{friendCount}</p>
          </div>
          <div className="profile-main-stats-channels">
            <MdIcons.MdContacts/>
            <h2>Channels</h2>
            <p>{channelCount}</p>
          </div>
        </div>
        <div className="profile-main-reset">
          <button className="profile-main-reset-button" onClick={() => props.setView("reset")}>Change password</button>
          <button className="profile-main-mfa-button">Enable MFA</button>
        </div>
      </animated.div>
    </>
  )
}

function ViewEdit(props) {
  const context = useContext(AuthContext)

  // State
  const [avatar, setAvatar] = useState(undefined)
  const [errorMessage, seterrorMessage] = useState("")
  const [formState, setformState] = useState({ avatar: undefined })

  // Animations
  const styling = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 }
  })

  useEffect(() => {
    fetch_avatar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetch_avatar() {
    const result = await Storage.get(context.user.attributes.sub + '.jpg', { level: 'public' });
    setAvatar(result)
  }

  async function save_information() {
    const { email, avatar } = formState

    if (avatar !== undefined) {
      await Storage.put(context.user.attributes.sub + '.jpg', avatar, {
        progressCallback(progress) {
          const percent = (progress.loaded / progress.total) * 100;
          props.setLoader(percent)
          if (percent === 100) {
            props.setLoader(0)
          }
        },
      });
    }

    if (email !== "") {
      // eslint-disable-next-line no-useless-escape
      const regex_email = (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      if (regex_email.test(email)) {
        await Auth.updateUserAttributes(context.user, {
          'email': email
        }).then(async (result) => {
          if (result === "SUCCESS") {
            await Auth.currentAuthenticatedUser().then((result) => {
              context.updateUser(result);
            });
            props.setView("profile")
          }
        });
      } else {
        console.log('failed regex')
      }
    }
  }

  function onFileChange(e) {
    const file = e.target.files[0];

    if (!file) { return }
    if (!file.type.startsWith('image/')) { return }
    if (file.size > 1000000) {
      seterrorMessage("Avatar cannot be larger than 2MB!")
      setformState(() => ({ ...formState, avatar: undefined }));
      return
    }
    seterrorMessage("")

    try {
      const source = URL.createObjectURL(file);
      setAvatar(source)
      setformState(() => ({ ...formState, avatar: file }));
    } catch (e) {
      console.log(e)
    }
  }

  function onChange(e) {
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <>
      <animated.div style={styling} className="profile-edit">
        <div className="profile-main-title">
          <h2>Edit Profile</h2>
          <h6>Edit your profile details below.</h6>
        </div>
        <hr />
        <div className="profile-main-avatar-container">
          <img className="profile-main-avatar" id="avatar-preview" src={avatar} alt=" " />
          <p className="profile-main-avatar-error">{errorMessage}</p>
          <div className="profile-avatar-inputs">
            <input className="profile-main-avatar-input" onChange={onFileChange} type="file" />
          </div>
        </div>
        <div className="profile-main-email-edit">
          <div className="profile-avatar-inputs">
            <input className="profile-main-email-input" name="email" placeholder={context.user.attributes.email} onChange={onChange} type="text" />
          </div>
        </div>
        <button onClick={save_information}>Save all changes</button>
        <div className="return-span">
          <span onClick={() => props.setView("profile")}>Return</span>
        </div>
      </animated.div>
    </>
  )
}

function ViewConfirm(props) {
  const context = useContext(AuthContext)

  // State
  const [sentTo, setSentTo] = useState("")
  const [formState, setformState] = useState({ code: "", error: "" })

  // Animations
  const styling = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 }
  })

  useEffect(() => {
    setSentTo(context.user.attributes.email)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function send_code() {
    try {
      await Auth.verifyCurrentUserAttribute('email');
    } catch (e) {
      if (e.code === "LimitExceededException") {
        setformState(() => ({
          ...formState,
          "error": e.message
        }));
      }
    }
  }

  async function submit_code() {
    const { code } = formState;
      Auth.verifyCurrentUserAttributeSubmit('email', code).then(() => {
        Auth.signOut()
      }).catch ((e) => 
      setformState(() => ({ ...formState, error: e.message }))
      );


  }

  function onChange(e) {
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <>
      <animated.div style={styling} className="profile-confirm">
        <div className="profile-confirm-title">
          <h2>Confirm Email</h2>
          <h6>Enter the confirmation code sent to {sentTo}</h6>
          <h6>You will be logged-out after confirming, and will have to login again.</h6>
          <h5 className="error-msg">{formState.error}</h5>
        </div>
        <div className="profile-main-email-edit">
          <div className="profile-avatar-inputs">
            <input onChange={onChange} className="profile-main-email-input" name="code" placeholder="Confirmation code" type="text" />
          </div>
        </div>
        <button onClick={submit_code}>Confirm</button>
        <div className="return-span">
          <span onClick={() => send_code()}>Resend code</span>
          <span onClick={() => props.setView("profile")}>Return</span>
        </div>
      </animated.div>
    </>
  )
}

function ViewReset(props) {
  const context = useContext(AuthContext)

  // State
  const [formState, setformState] = useState({ oldPassword: "", newPassword: "" })

  // Animations
  const styling = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 }
  })

  async function change() {
    const { oldPassword, newPassword } = formState;

    try {
      const result = await Auth.changePassword(context.user, oldPassword, newPassword);
      // TODO Success notification
      if (result === "SUCCESS") { Auth.signOut() }
    } catch (e) {
      console.log(e)
      switch (e.code) {
        case "NotAuthorizedException":
          setformState(() => ({ ...formState, "error": e.message }));
          break;
        case "InvalidPasswordException":
          setformState(() => ({ ...formState, "error": e.message }));
          break;
        case "InvalidParameterException":
          setformState(() => ({ ...formState, "error": "Please fill in the required fields." }));
          break;
        default:
          break;
      }

    }
  }

  function onChange(e) {
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <>
      <animated.div style={styling} className="profile-reset">
        <div className="profile-reset-title">
          <h2>Change Password</h2>
          <h6>Enter your old password and desired password below.</h6>
          <h5 className="error-msg">{formState.error}</h5>
        </div>
        <div className="profile-main-email-edit">
          <div className="profile-reset-inputs">
            <input onChange={onChange} className="profile-reset-input" name="oldPassword" placeholder="Old password" type="password" />
            <input onChange={onChange} className="profile-reset-input" name="newPassword" placeholder="New password" type="password" />
          </div>
        </div>
        <button onClick={change}>Confirm</button>
        <div className="return-span">
          <span onClick={() => props.setView("profile")}>Return</span>
        </div>
      </animated.div>
    </>
  )
}

function Profile() {
  const context = useContext(AuthContext)

  // State
  const [view, setView] = useState("profile")
  const [loader, setLoader] = useState(0)

  // Animations
  const styling = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 }
  })

  if (!context.datastore_ready) { return <Redirect to="/" /> }

  return (
    <>
      <div className="profile-page">
        <animated.div style={styling} className="profile-container">
          <div style={{ width: loader + "%" }} className="loading-bar"></div>
          {view === "profile" && <ViewMain setView={setView} setLoader={setLoader} />}
          {view === "edit" && <ViewEdit setView={setView} setLoader={setLoader} />}
          {view === "confirm" && <ViewConfirm setView={setView} setLoader={setLoader} />}
          {view === "reset" && <ViewReset setView={setView} setLoader={setLoader} />}
        </animated.div>
      </div>
    </>
  )
}

export default Profile

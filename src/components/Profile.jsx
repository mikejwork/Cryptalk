import '../css/Profile.css';
import React, { useContext, useEffect, useState } from 'react'
import { Auth, Storage } from "aws-amplify";
import { AuthContext } from "../contexts/AuthContext";
import { Redirect } from "react-router-dom";
import * as MdIcons from "react-icons/md";


function ProfileView(props) {
  // To add: Status
  const context = useContext(AuthContext)
  const [profilePic, setprofilePic] = useState(null)

  async function getProfilePic() {
    const result = await Storage.get(context.user.attributes.sub + '.jpg', { level: 'public' });
    await setprofilePic(result)
  }

  useEffect(() => {
    getProfilePic()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  console.log(context.user)
  return (
    <>
      <section className="profile-top">
        <h1>Login</h1>
      </section>
      <section className="form-divider">
        <div className="custom-shape-divider-top-1629434998">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
          </svg>

        </div>
      </section>
      <section className="profile-bottom" >
        <div className="profile-picture">{profilePic !== null && <img className="user-avatar" src={profilePic} alt=" " width="150" height="150" />}</div>
        <button className="edit-profile" onClick={() => props.updateFormState("ProfileEdit")}>Edit profile</button>
        <h1 className="profile-name">{context.user.username}</h1>

        {/* This is to still be implemented */}
        <h4><MdIcons.MdLightbulbOutline /> Status</h4>

        <div className="profile-fc">
          <span className="profile-friends">
            <h1>Friends</h1>
            <label>12</label>
            {/* Create function to loop through friends */}
          </span>
          <hr className="hr-vertical" />
          <span className="profile-friends">
            <h1>Channels</h1>
            <label>3</label>
            {/* Create function to loop through channels */}
          </span>
        </div>

        <section className="profile-information">
          <h1>Email:</h1>
          <label>{context.user.attributes.email} </label> {!context.user.attributes.email_verified && <span className="warning" onClick={() => props.updateFormState("FormConfirm")}> <MdIcons.MdWarning />  Click here to verify your email</span>}
          <hr className="hr-horizontal-information" />
        </section>
        <button className="reset-password-button" name="signin" onClick={() => props.updateFormState("ResetPassword")} >Reset Password</button>
      </section>
    </>
  )
}

function ProfileEdit(props) {
  const context = useContext(AuthContext)

  const [profilePic, setprofilePic] = useState(null)

  async function getProfilePic() {
    const result = await Storage.get(context.user.attributes.sub + '.jpg', { level: 'public' });
    await setprofilePic(result)
  }

  useEffect(() => {
    getProfilePic()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const initialForm = { status: "", email: "", error_message: "", avatar: null };

  const [formState, setFormState] = useState(initialForm)

  async function generate_random_avatar() {
    var rand = Math.floor(Math.random() * 24);
    const response = await fetch(process.env.PUBLIC_URL + '/default_avatars/' + rand + '.jpg')
    const blob = await response.blob();
    setFormState(() => ({ ...formState, avatar: blob }));
  }

  async function process_change() {
    const { email, avatar } = formState;
    //Add status in const when implemented
    // if (formState.status !== "") {
    //To be used when status is implemented
    // }
    if (formState.avatar) {
      let result = await Auth.currentAuthenticatedUser();
      await Storage.put(result.attributes.sub + '.jpg', avatar)
    }
    if (!email) {
      props.updateFormState("ProfileView");
    }
    if (email) {
      let user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, {
        'email': email
      });
      props.updateFormState("FormConfirm");
    }
  }

  async function OnFileChange(e) {
    const file = e.target.files[0];

    if (!file) { return }
    if (!file.type.startsWith('image/')) { return }

    await setFormState(() => ({ ...formState, avatar: file, error_message: "" }));

    try {
      const source = URL.createObjectURL(file);
      const preview_element = document.getElementById("avatar-preview50")
      preview_element.src = source;
    } catch (e) {
      console.log(e)
      return;
    }
  }

  function onChange(e) {
    setFormState(() => ({
      ...formState,
      [e.target.name]: e.target.value,
      error_message: ""
    }));
  }

  return (
    <>
      <section className="profile-top">
        <MdIcons.MdChevronLeft className="mdIcon-back" onClick={() => props.updateFormState("ProfileView")} />
        <h1>Edit Profile</h1>
      </section>
      <section className="form-divider">
        <div className="custom-shape-divider-top-1629434998">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
          </svg>
        </div>
      </section>
      <section className="profile-bottom" >
        <div className="avatar-container">

          <div className="avatar-input">
            <div className="profile-picture">
              {formState.avatar && profilePic !== null && <img className="user-avatar" src={URL.createObjectURL(formState.avatar)} alt={profilePic} width="150" height="150" />}
            </div>
            <input className="avatar-input-field" name="avatar" id="avatar" onChange={OnFileChange} type="file" />
          </div>
          <button onClick={generate_random_avatar} className="avatar-refresh"><MdIcons.MdRefresh /></button>
        </div>

        <label htmlFor="status">Change your status</label>
        <input name="status" value={formState.status} placeholder="Change your status" onChange={onChange} />
        <label htmlFor="email">Change Email address</label>
        <input name="email" value={formState.email} placeholder={context.user.attributes.email} onChange={onChange} type="email" />

        <button className="reset-password-button" name="acceptChanges" onClick={process_change} >Accept Changes</button>
      </section>
    </>
  )
}


function ResetPassword(props) {
  const initialForm = { old_password: "", password: "", error_message: "" };

  const [formState, setFormState] = useState(initialForm)


  async function process_password() {
    const { old_password, password } = formState;

    Auth.currentAuthenticatedUser().then(user => {
      return Auth.changePassword(user, old_password, password);
    })
      .then(() => {
        props.updateFormState("ProfileView")
      })
      .catch(err =>
        setFormState(() => ({ ...formState, error_message: err.message }))
      );




  }

  function onChange(e) {
    setFormState(() => ({
      ...formState,
      [e.target.name]: e.target.value,
      error_message: ""
    }));
  }

  return (
    <>
      <section className="profile-top">
        <MdIcons.MdChevronLeft className="mdIcon-back" onClick={() => props.updateFormState("ProfileView")} />
        <h1>Edit Profile</h1>
      </section>
      <section className="form-divider">
        <div className="custom-shape-divider-top-1629434998">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
          </svg>
        </div>
      </section>
      <section className="profile-bottom" >
        {formState.error_message === "" ? <></> : <p className="error-text">{formState.error_message}</p>}

        <label htmlFor="old_password">Old Password</label>
        <input name="old_password" value={formState.old_password} placeholder="Enter your old password" onChange={onChange} type="password" />
        <label htmlFor="password">New Password</label>
        <input name="password" value={formState.password} placeholder="Enter your new password" onChange={onChange} type="password" />

        <button className="reset-password-button" name="acceptChanges" onClick={process_password} >Change password</button>
      </section>
    </>
  )
}

function FormConfirm(props) {
  const initialForm = { authCode: "" };
  const [formState, setFormState] = useState(initialForm)

  async function process_confirm() {
    const { authCode } = formState;
    try {
      await Auth.currentAuthenticatedUser();
      await Auth.verifyCurrentUserAttributeSubmit('email', authCode);
      props.updateFormState("ProfileView")
    } catch (error) {
      console.log(error)
    }
  }

  function onChange(e) {
    setFormState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <>
      <section className="form-top">
        <h1>Confirm</h1>
      </section>
      <section className="form-divider">
        <div className="custom-shape-divider-top-1629434998">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="shape-fill"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="shape-fill"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="shape-fill"></path>
          </svg>
        </div>
      </section>
      <section className="form-bottom">

        <label htmlFor="authCode"><MdIcons.MdLockOutline className="label-icon" />Confirmation code has been sent to the new email.</label>
        <input name="authCode" onChange={onChange} placeholder="Type your confirmation code" />
        
        <button onClick={process_confirm}>Confirm</button>
      </section>
    </>
  )
}


function Profile() {
  const [formState, updateFormState] = useState("ProfileView");
  const context = useContext(AuthContext)

  if (context.user === null) {
    return <Redirect to={"authentication"} />
  }

  return (
    <div className="profile-container">
      <div className="profile-view-container">
        {formState === "ProfileView" && <ProfileView updateFormState={updateFormState} />}
        {formState === "ProfileEdit" && <ProfileEdit updateFormState={updateFormState} />}
        {formState === "FormConfirm" && <FormConfirm updateFormState={updateFormState} />}
        {formState === "ResetPassword" && <ResetPassword updateFormState={updateFormState} />}

        {formState === "redirect" && <Redirect to="/" />}

      </div>
    </div>
  )
}

export default Profile

import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Storage, Auth } from "aws-amplify";

import * as MdIcons from "react-icons/md";
import style from "../../css/Profile/ProfileEdit.module.css";

function ProfileEdit(props) {
  const context = useContext(AuthContext);

  const [_Avatar, set_Avatar] = useState(undefined)
  const [formState, setformState] = useState({email: context.user.attributes.email, avatar: undefined})

  async function submit() {
    const {email, avatar} = formState;

    if (avatar !== undefined) {
      await Storage.put(context.user.attributes.sub + ".jpg", avatar);
    }

    if (email !== context.user.attributes.email) {
      // eslint-disable-next-line no-useless-escape
      const email_expr = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (email_expr.test(email)) {
        await Auth.updateUserAttributes(context.user, {
          email: email
        }).then(async (result) => {
          if (result === "SUCCESS") {
            await Auth.currentAuthenticatedUser().then(async (result) => {
              await context.updateUser(result)
            });
            props.set_View("CONFIRM")
          }
        });
      } else {
        setformState(() => ({...formState, error: "Not a valid email, please try again."}));
      }
    }
  }

  async function get_avatar() {
    set_Avatar(await Storage.get(context.user.attributes.sub + ".jpg"))
  }

  useEffect(() => {
    get_avatar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

    await setformState(() => ({...formState, avatar: file, error: ""}))

    try {
      let src = URL.createObjectURL(file);
      set_Avatar(src)
    } catch(error) {
      setformState(() => ({...formState, error: error.message}))
    }
  }

  return (
    <div className={style.container} onKeyPress={onKeyPress}>
      <div className={style.title}>
        <h2>Edit Profile</h2>
        <h5 className="subcomment">Edit your profile details below.</h5>
      </div>
      <hr/>
      <div className={style.avatar}>
        <img src={_Avatar} alt=" "/>
      </div>
      <div className={style.info}>
        {/* Error */}
        { formState.error === "" ? <></> : <p style={{alignSelf: "center"}} className="error">{formState.error}</p>}

        {/* Email */}
        <label htmlFor="email"><MdIcons.MdMailOutline/> Email address</label>
        <input name="email" onChange={onChange} placeholder="Email address.." type="email" value={formState.email}/>

        {/* Avatar */}
        <label htmlFor="avatar"><MdIcons.MdPermIdentity/> Avatar</label>
        <input name="avatar" id="avatar" onChange={onFileChange} type="file"/>
      </div>
      <div className={style.actions}>
        <button onClick={submit}>Save changes</button>
        <br/>
        <u onClick={() => props.set_View("MAIN")}>Return to profile</u>
      </div>
    </div>
  )
}

export default ProfileEdit

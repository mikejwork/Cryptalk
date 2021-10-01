import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { DataStore } from "aws-amplify";
import { Friends } from "../../../models";
import UserAvatar from '../../Wrappers/Avatar/UserAvatar'

import * as MdIcons from "react-icons/md";
import style from "./index.module.css";

function ProfileMain(props) {
  const context = useContext(AuthContext);

  // State - Storage
  const [_NumFriends, set_NumFriends] = useState(0)
  const [_NumChannels, set_NumChannels] = useState(0)

  async function get_friends() {
    DataStore.query(Friends).then((result) => {
      set_NumFriends(result[0].list.length);
    });
  }

  useEffect(() => {
    if (context.datastore_ready) {
      get_friends()
      set_NumChannels(0) // TODO
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.datastore_ready])

  return (
    <div className={style.container} id="cypress-profileMain">
      <div className={style.title}>
        <h2>Profile</h2>
        <h5 className="subcomment">View your profile details below.</h5>
      </div>
      <hr/>
      <div className={style.avatar}>
        <UserAvatar key={context.user.attributes.sub} alt="User profile picture" id={context.user.attributes.sub}/>
        <div onClick={() => props.set_View("EDIT")} className={style.avatarOverlay} id="cypress-profileAvatarEdit"><MdIcons.MdOpenInNew className="MdIcon"/></div>
      </div>
      <div className={style.info}>
        <h2 id="cypress-profileUsername">{context.user.username}</h2>
        <h4><MdIcons.MdOpenInNew onClick={() => props.set_View("EDIT")} className={style.MdIcon}/>{context.user.attributes.email}</h4>
        { !context.user.attributes.email_verified &&
          <>
            <u onClick={() => props.set_View("CONFIRM")}>Email not verified! Click here.</u>
          </>
        }
      </div>
      <div className={style.stats}>
        <div className={style.statsFriends}>
          <MdIcons.MdSupervisorAccount/>
          <h2>Friends</h2>
          <h5 className="subcomment">{_NumFriends}</h5>
        </div>
        <div className={style.statsChannels}>
          <MdIcons.MdContacts/>
          <h2>Channels</h2>
          <h5 className="subcomment">{_NumChannels}</h5>
        </div>
      </div>
      <div className={style.actions}>
        <button onClick={() => props.set_View("RESET")} id="cypress-changePassword">Change password</button>
        <button onClick={() => props.set_View("MAIN")} id="cypress-twoFactor">Two-factor Authentication</button>
      </div>
    </div>
  )
}

export default ProfileMain

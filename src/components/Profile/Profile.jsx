import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Redirect } from "react-router-dom";

import ProfileMain from './ProfileMain'
import ProfileEdit from './ProfileEdit'
import ProfileConfirm from './ProfileConfirm'
import ProfileReset from './ProfileReset'

import style from "../../css/Profile/Profile.module.css";

function Profile() {
  const context = useContext(AuthContext);

  // State - UI
  const [_View, set_View] = useState("MAIN")

  // Switch component that will change depending on the above ^ state
  const CurrentView = () => {
    switch(_View) {
      case "MAIN": return <ProfileMain set_View={set_View}/>;
      case "EDIT": return <ProfileEdit set_View={set_View}/>;
      case "RESET": return <ProfileReset set_View={set_View}/>;
      case "CONFIRM": return <ProfileConfirm set_View={set_View}/>;
      default: return <h6>No page selected</h6>;
    }
  }

  if (!context.datastore_ready) { return <Redirect to="/"/>; }

  return (
    <div className={style.profile}>
      <div className={style.profileContainer}>
        { CurrentView() }
      </div>
    </div>
  )
}

export default Profile

import React, {useState, useContext} from "react";
import s_Form from './index.module.css';
import { AuthContext } from "../../../contexts/AuthContext";
import { Redirect } from "react-router-dom";

import ViewLogin from '../ViewLogin/ViewLogin'
import ViewConfirm from '../ViewConfirm/ViewConfirm'
import ViewRecovery from '../ViewRecovery/ViewRecovery'
import ViewRegistration from '../ViewRegistration/ViewRegistration'

function Authentication(props) {
  const context = useContext(AuthContext);

  // State - view
  const [_View, set_View] = useState("LOGIN")

  // State - storage
  const [_Username, set_Username] = useState()
  const [_SentTo, set_SentTo] = useState()

  // Switch component that will change depending on the above ^ state
  const CurrentView = () => {
    switch(_View) {
      case "LOGIN": return <ViewLogin set_View={set_View} set_Username={set_Username}/>;
      case "CONFIRM": return <ViewConfirm set_View={set_View} _Username={_Username} _SentTo={_SentTo}/>;
      case "RECOVERY": return <ViewRecovery set_View={set_View}/>;
      case "REGISTRATION": return <ViewRegistration set_View={set_View}  set_Username={set_Username} set_SentTo={set_SentTo}/>;
      case "REDIRECT": return <Redirect to="/dashboard"/>;
      default: return <h6>No page selected</h6>;
    }
  }

  // If datastore is ready, this means we are already logged in
  if (context.datastore_ready) { return <Redirect to="/channels"/>;}

  // Just a switch case inside our overall page formatting
  return (
    <div className={s_Form.authentication}>
      { CurrentView() }
    </div>
  )
}

export default Authentication;

import React, { useContext, useEffect, useState } from 'react'
import { Storage } from "aws-amplify";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

import '../css/Navigation.css';
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";

import { Auth } from "aws-amplify";

function Navbar(props) {
  return (
    <nav className="navbar">
        <ul className="navbar-nav"> {props.children}</ul>
    </nav>
  );
}

function NavItem(props) {
  return (
    <li className="nav-item">
      <Link name={props.name} to={props.destination} className="nav-item-icon">
        { props.icon } <p>{ props.name }</p>
      </Link>
    </li>
  )
}

function NavBtn(props) {
  const onClick = () => {
    props.func()
  }

  return (
    <li className="nav-item">
      <span name={props.name} onClick={onClick} className="nav-item-icon">
        { props.icon } <p>{ props.name }</p>
      </span>
    </li>
  )
}

function LoggedInNav() {
  const context = useContext(AuthContext)
  const [profilePic, setprofilePic] = useState(null)

  async function signOut() {
    await Auth.signOut()
    context.updateUser(null)
  }

  async function getProfilePic() {
    const result = await Storage.get(context.user.attributes.sub + '.jpg', { level: 'public' });
    await setprofilePic(result)
  }

  useEffect(() => {
    getProfilePic()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <NavItem name="Dashboard" destination="/dashboard" icon={<MdIcons.MdDashboard/>}/>

      <NavItem name="Profile" destination="/profile" icon={<FaIcons.FaUser/>}/>

      <NavBtn name="Sign Out" func={signOut} destination="/authentication" icon={<FaIcons.FaSignOutAlt/>}/>

      <li className="nav-item">
        <Link name="username" className="nav-username" to="/profile">{context.user.username}</Link>
        { profilePic !== null && <img className="user-avatar" src={profilePic} alt=" " width="30" height="30"/>}
      </li>
    </>
  )
}

function LoggedOutNav() {
  return (
    <>
      <NavItem name="Login" destination="/authentication" icon={<FaIcons.FaSignInAlt/>}/>
    </>
  )
}

function Navigation() {
  const context = useContext(AuthContext)

  return (
    <Navbar>
      <li className="nav-logo">
        <Link className="nav-logo-link" to="/">
          <img src={process.env.PUBLIC_URL + '/logo-white-crop.png'} alt="logo"/>
        </Link>
      </li>
      { context ? <>{ context.user ? <LoggedInNav/> : <LoggedOutNav/> }</> : <></>}
    </Navbar>
  )
}

export default Navigation

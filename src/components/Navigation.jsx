import React, { useContext } from 'react'
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import UserAvatar from './Wrappers/Avatar/UserAvatar'

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

  async function signOut() {
    await Auth.signOut()
    context.updateUser(null)
  }

  return (
    <>
      <NavItem name="Channels" destination="/channels" icon={<MdIcons.MdContacts/>}/>

      <NavItem name="Profile" destination="/profile" icon={<FaIcons.FaUser/>}/>

      <NavBtn name="Logout" func={signOut} destination="/authentication" icon={<FaIcons.FaSignOutAlt/>}/>

      <li className="nav-item">
        <div className="nav-user-container">
          <Link name="username" className="nav-username" to="/profile">{context.user.username}</Link>
          <UserAvatar className="nav-avatar" key={context.user.attributes.sub} alt="User profile picture" id={context.user.attributes.sub}/>
        </div>
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
          <img src={process.env.PUBLIC_URL + '/logo_assets/3000x3000-Logo.png'} alt="logo"/>
        </Link>
      </li>
      { context ? <>{ context.user ? <LoggedInNav/> : <LoggedOutNav/> }</> : <></>}
    </Navbar>
  )
}

export default Navigation

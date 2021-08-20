import React, { useContext } from 'react'
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
      <Link to={props.destination} className="nav-item-icon">
        { props.icon }
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
      <span onClick={onClick} className="nav-item-icon">
        { props.icon }
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
      <li className="nav-item">
        <Link className="nav-username" to="/profile">{context.user.username}</Link>
      </li>

      <Tooltip text="Dashboard">
        <NavItem destination="/" icon={<MdIcons.MdDashboard/>}/>
      </Tooltip>

      <Tooltip text="Profile">
        <NavItem destination="/profile" icon={<FaIcons.FaUser/>}/>
      </Tooltip>

      <Tooltip text="Sign Out">
        <NavBtn func={signOut} destination="/authentication" icon={<FaIcons.FaSignOutAlt/>}/>
      </Tooltip>
    </>
  )
}

function Tooltip(props) {
  return (
    <>
      <div className="tooltip"> {props.children}
        <span className="tooltip-text">{props.text}</span>
      </div>

    </>
  )
}

function LoggedOutNav() {
  return (
    <>
      <Tooltip text="Dashboard">
        <NavItem destination="/" icon={<MdIcons.MdDashboard/>}/>
      </Tooltip>

      <Tooltip text="Profile">
        <NavItem destination="/profile" icon={<FaIcons.FaUser/>}/>
      </Tooltip>

      <Tooltip text="Sign In">
        <NavItem destination="/authentication" icon={<FaIcons.FaSignInAlt/>}/>
      </Tooltip>
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
      { context.user ? <LoggedInNav/> : <LoggedOutNav/> }
    </Navbar>
  )
}

export default Navigation

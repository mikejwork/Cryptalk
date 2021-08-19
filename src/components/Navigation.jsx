import React from 'react'
import { Link } from "react-router-dom";

import * as FaIcons from "react-icons/fa"; //basic icon

function Navbar(props) { //setup for future use
  return (
    <nav className="navbar">
        <ul className="navbar-nav"> {props.children}</ul>
    </nav>
  );
}

// PlAN: Have two seperate navbars, one for logged in and one for logged out

function Navigation() {
  return (
    <Navbar>
      <li className="nav-logo">
        <Link to="/" className="icon-logo"><FaIcons.FaRedhat/></Link><Link to="/">Cryptalk</Link>
      </li>
    </Navbar>
  )
}

export default Navigation

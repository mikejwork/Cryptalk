import React, { useState } from 'react'
import { useSpring, animated } from 'react-spring'
import * as MdIcons from "react-icons/md";

import '../css/Footer.css';

function Footer() {
  const [open, setOpen] = useState(false)

  function onMouseEnter(e) {
    setOpen(true)
  }

  function onMouseLeave(e) {
    setOpen(false)
  }

  function FooterMenu(props) {
    const styling = useSpring({
      from: { transform:`translateX(-100%)`, opacity: 0 },
      to: { transform:`translateX(0%)`, opacity: 1 }
    })
    return (
      <animated.div style={styling} className="footer-menu">  
        <a href="/privacy" className="hyperlink">Privacy Policy</a>
        <a href="/terms" className="hyperlink">Terms & Conditions</a>
        <span className="trademark">© 2021 Cryptalk</span>
      </animated.div>
    )
  }

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className="footer-container">
      <button className="footer-button"><MdIcons.MdHelpOutline/></button>
      {open && <FooterMenu/>}
    </div>
  )
}

export default Footer

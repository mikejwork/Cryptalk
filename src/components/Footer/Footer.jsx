/*
  Author: Braden
  Description:
    Site footer to display links to the legal documents.
  Related PBIs: 1
*/

import React, { useState, useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import * as MdIcons from "react-icons/md";

import styles from './index.module.css';

function Footer() {
  const [open, setOpen] = useState(false)

  const [styling, api] = useSpring(() => ({
    marginLeft: "-26.5rem"
  }))

  const [arrowStyle, apiArrow] = useSpring(() => ({
    transform: `rotate(0deg)`
  }))

  function toggle_menu() {
    api.start({
      marginLeft: open ? "0rem" : "-26.5rem"
    })
    apiArrow.start({
      transform: open ? `rotate(0deg)` : `rotate(180deg)`
    })
  }

  useEffect(() => {
    toggle_menu()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <div className={styles.footer} id="cypress-footerDiv">
      <div className={styles.footerSpacer}></div>
      <div className={styles.footerContainer}>
        <animated.div style={styling} className={styles.footerItems} id="cypress-footerAnimated">
          <ul>
            <li><a href="/terms" id="cypress-terms">Terms & Conditions</a></li>
            <li><a href="/privacy" id="cypress-privacy">Privacy Policy</a></li>
            <li>© 2021 Cryptalk</li>
          </ul>
        </animated.div>
        <button name="footer-button" onClick={() => setOpen(!open)}><animated.div className={styles.arrowDiv} style={arrowStyle} id="cypress-footerBtn"><MdIcons.MdKeyboardArrowLeft/></animated.div></button>
      </div>
    </div>
  )
}

export default Footer

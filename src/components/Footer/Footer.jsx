import React, { useState, useEffect } from 'react'
import { useSpring, animated } from 'react-spring'
import * as MdIcons from "react-icons/md";

import styles from '../../css/Footer/Footer.module.css';

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
    <div className={styles.footer}>
      <div className={styles.footerSpacer}></div>
      <div className={styles.footerContainer}>
        <animated.div style={styling} className={styles.footerItems}>
          <ul>
            <li><a href="/terms">Terms & Conditions</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li>© 2021 Cryptalk</li>
          </ul>
        </animated.div>
        <button onClick={() => setOpen(!open)}><animated.div className={styles.arrowDiv} style={arrowStyle}><MdIcons.MdKeyboardArrowLeft/></animated.div></button>
      </div>
    </div>
  )
}

export default Footer

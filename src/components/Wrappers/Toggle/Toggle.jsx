import React, { useState, useEffect } from 'react'
import * as HiIcons from "react-icons/hi";
import { useSpring, animated } from 'react-spring';
import styles from './index.module.css';

function Toggle(props) {
  const [toggle, settoggle] = useState(false)
  const [styling, api] = useSpring(() => ({
    marginLeft: `0ex`,
    color: "white"
  }))

  const [styling_i, api_i] = useSpring(() => ({
    backgroundColor: `grey`
  }))

  useEffect(() => {
    props.value(toggle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggle])

  function flick() {
    api.start({
      marginLeft: toggle ? `0ex` : `2.5ex`,
      color: toggle ? "white" : "#3c9dca"
    })
    api_i.start({
      backgroundColor: toggle ? `grey` : `#3c9dca`
    })
    settoggle(!toggle)
  }

  return (
    <animated.div className={styles.container} style={styling_i} onClick={flick}>
       <animated.div className={styles.toggle} style={styling}>{ toggle ? <HiIcons.HiDotsVertical/> : <></>}</animated.div>
    </animated.div>
  )
}

export default Toggle

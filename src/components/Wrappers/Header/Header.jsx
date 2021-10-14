/*
  Author: Michael
  Description:
    A header for settings menus etc.
  Related PBIs: nil
*/

import React from 'react'
import styles from './index.module.css'

function Header(props) {
  return (
    <div className={styles.header}>
      <h5 className="subcomment">{props.text}</h5>
      <div className={styles.spacer}/>
      <span>{ props.children }</span>
    </div>
  )
}

export default Header

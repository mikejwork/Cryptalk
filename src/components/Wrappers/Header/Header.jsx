import React from 'react'
import styles from './index.module.css'

function Header(props) {
  return (
    <div className={styles.header}>
      <h5 className="subcomment">{props.text}</h5>
      <div className={styles.spacer}/>
      { props.children }
    </div>
  )
}

export default Header

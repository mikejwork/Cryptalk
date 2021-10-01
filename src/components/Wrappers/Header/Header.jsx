import React from 'react'
import styles from './index.module.css'
import * as HiIcons from "react-icons/hi";

function Header(props) {
  return (
    <div className={styles.header}>
      <h5 className="subcomment">{props.text}</h5>
      <div className={styles.spacer}/>
      { props.callback &&
        <HiIcons.HiDocumentAdd className={styles.icon} onClick={props.callback} />
      }
    </div>
  )
}

export default Header

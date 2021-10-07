import React from 'react'
import styles from './index.module.css'

function Loading() {
  return (
    <div className={styles.containerPage}>
      <div className={styles.ldsRoller}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  )
}

export function LoadingDiv() {
  return (
    <div className={styles.container}>
      <div className={styles.ldsRoller}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  )
}

export default Loading

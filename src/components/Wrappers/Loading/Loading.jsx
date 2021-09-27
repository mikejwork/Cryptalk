import React from 'react'
import styles from './index.module.css'

function LoadingPage() {
  return (
    <div className={styles.containerPage}>
      <div className={styles.ldsRoller}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  )
}

// function LoadingDiv() {
//   return (
//     <div className={styles.container}>
//       <div class={styles.ldsRoller}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
//     </div>
//   )
// }

export default LoadingPage

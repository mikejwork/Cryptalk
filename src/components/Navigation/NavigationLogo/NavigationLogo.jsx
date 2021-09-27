import React from 'react'
import styles from './index.module.css'

function NavigationLogo(props) {
  return (
    <div className={styles.container}>
      <img src={process.env.PUBLIC_URL + '/logo_assets/3000x3000-Logo.png'} alt="logo"/>
    </div>
  )
}

export default NavigationLogo

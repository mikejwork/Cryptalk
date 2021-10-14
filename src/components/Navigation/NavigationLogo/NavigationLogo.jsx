/*
  Author: Michael
  Description:
    Navigation site logo
  Related PBIs: nil
*/

import React from 'react'
import styles from './index.module.css'

function NavigationLogo(props) {
  return (
    <div className={styles.container}>
      <a href="/">
        <img src={process.env.PUBLIC_URL + '/logo_assets/3000x3000-Logo.png'} alt="logo"/>
      </a>
    </div>
  )
}

export default NavigationLogo

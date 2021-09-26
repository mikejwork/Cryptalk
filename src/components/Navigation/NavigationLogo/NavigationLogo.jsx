import React, { useContext } from 'react'
import styles from './index.module.css'
import { AuthContext } from "../../../contexts/AuthContext";

function NavigationLogo(props) {
  const context = useContext(AuthContext)
  return (
    <div className={styles.container}>
      <img src={process.env.PUBLIC_URL + '/logo_assets/3000x3000-Logo.png'} alt="logo" onClick={() => context.spawnNotification("ERROR", "Error title", "Error message")}/>
    </div>
  )
}

export default NavigationLogo

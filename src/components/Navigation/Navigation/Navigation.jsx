import React from 'react'
import styles from './index.module.css';

import NavigationMenu from '../NavigationMenu/NavigationMenu'

function Navigation() {
  return (
    <div className={styles.navigation}>
      <div className={styles.content}>
        <NavigationMenu/>
      </div>
    </div>
  )
}

export default Navigation

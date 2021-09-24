import React from 'react'
import styles from './index.module.css';
import * as HiIcons from "react-icons/hi";

import { NavigationLink } from '../NavigationItem/NavigationItem'
import NavigationMenu from '../NavigationMenu/NavigationMenu'
import NavigationLogo from '../NavigationLogo/NavigationLogo'

function Navigation() {
  return (
    <div className={styles.navigation}>
      <div className={styles.content}>
        <NavigationLogo/>
        <NavigationLink name="Home" icon={<HiIcons.HiHome/>} destination="/" menu={false}/>
        <NavigationLink name="Channels" icon={<HiIcons.HiOutlineChatAlt/>} destination="/channels" menu={false}/>
        <NavigationLink name="My Profile" icon={<HiIcons.HiUser/>} destination="/profile" menu={false}/>
        <NavigationMenu/>
      </div>
    </div>
  )
}

export default Navigation

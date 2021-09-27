import React, { useContext } from 'react'
import { AuthContext } from "../../../contexts/AuthContext";
import styles from './index.module.css';
import * as HiIcons from "react-icons/hi";

import { NavigationLink } from '../NavigationItem/NavigationItem'
import NavigationMenu from '../NavigationMenu/NavigationMenu'
import NavigationLogo from '../NavigationLogo/NavigationLogo'

function Navigation() {
  const context = useContext(AuthContext);
  return (
    <div className={styles.navigation}>
      <div className={styles.content}>
        <NavigationLogo/>
        <NavigationLink name="Home" icon={<HiIcons.HiHome/>} destination="/" menu={false}/>
        { context.datastore_ready ?
          <>
            <NavigationLink name="Channels" icon={<HiIcons.HiOutlineChatAlt/>} destination="/channels" menu={false}/>
            <NavigationLink name="My Profile" icon={<HiIcons.HiUser/>} destination="/profile" menu={false}/>
          </>
        :
          <>
            <NavigationLink name="Login" icon={<HiIcons.HiTerminal/>} destination="/authentication" menu={false}/>
          </>
        }
        <NavigationMenu/>
      </div>
    </div>
  )
}

export default Navigation

import React, { useState } from 'react'
import styles from './index.module.css';
import * as HiIcons from "react-icons/hi";

import NavigationItem, { NavigationUser, NavigationLink } from '../NavigationItem/NavigationItem'

function NavigationMenu() {
  const [_Open, set_Open] = useState(false)
  return (
    <>
      <div className={`${_Open ? styles.dropdownOpen : styles.dropdown}`} onClick={() => set_Open(!_Open)}>
        <HiIcons.HiMenuAlt3/>

      </div>
      { _Open &&
        <>
          <div className={styles.dropdownContent}>
            <NavigationUser/>
            <hr/>
            <NavigationLink
              name="Home"
              icon={<HiIcons.HiHome/>}
              destination="/"
            />
            <NavigationLink
              name="Channels"
              icon={<HiIcons.HiOutlineChatAlt/>}
              destination="/channels"
            />
            <NavigationLink
              name="My Profile"
              icon={<HiIcons.HiUser/>}
              destination="/profile"
            />
            <NavigationItem
              name="Logout"
              icon={<HiIcons.HiLogout/>}
              onClick={() => console.log("logout")}
            />
          </div>
        </>
      }
    </>
  )
}

export default NavigationMenu

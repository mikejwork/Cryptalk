import React, { useState, useContext } from 'react'
import { Auth } from "aws-amplify";
import { AuthContext } from "../../../contexts/AuthContext";
import styles from './index.module.css';
import * as HiIcons from "react-icons/hi";

import NavigationItem, { NavigationUser } from '../NavigationItem/NavigationItem'

function NavigationMenu() {
  const context = useContext(AuthContext)
  const [_Open, set_Open] = useState(false)

  async function signOut() {
    await Auth.signOut()
    context.updateUser(null)
    set_Open(false)
  }

  return (
    <>
      <div className={`${_Open ? styles.dropdownOpen : styles.dropdown}`} onClick={() => set_Open(!_Open)} id="cypress-navMenu">
        <HiIcons.HiMenuAlt3/>
      </div>
      { _Open &&
        <>
          <div className={styles.dropdownContent}>
            <NavigationUser/>
            {context.datastore_ready &&
              <>
                <hr/>
                <NavigationItem
                  name="Logout"
                  icon={<HiIcons.HiLogout/>}
                  onClick={() => signOut()}
                  menu={true}
                />
              </>
            }
          </div>
        </>
      }
    </>
  )
}

export default NavigationMenu

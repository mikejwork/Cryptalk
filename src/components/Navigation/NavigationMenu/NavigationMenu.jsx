/*
  Author: Michael
  Description:
    Navigation menu for profile and logout buttons
  Related PBIs: nil
*/

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
            <NavigationUser set_Open={set_Open}/>
            {context.datastore_ready &&
              <>
                <hr/>
                <NavigationItem
                  name="Logout"
                  icon={<HiIcons.HiLogout/>}
                  onClick={() => {signOut(); set_Open(!_Open)}}
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

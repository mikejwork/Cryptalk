/*
  Author: Braden
  Description:
    Friend request list item, shows options to accept or reject friend requests
  Related PBIs: 13
*/

import React from 'react'
import styles from './index.module.css'
import * as MdIcons from "react-icons/md";
import { DataStore } from "aws-amplify";
import { RequestStorage, RequestStatus } from '../../../models';
import UserAvatar from '../../Wrappers/Avatar/UserAvatar'

function RequestListItem(props) {
  async function reject() {
    DataStore.query(RequestStorage, props.request.id).then((result) => {
      DataStore.save(RequestStorage.copyOf(result, item => {
        item.status = RequestStatus.REJECTED;
      }));
    })
  }

  async function accept() {
    DataStore.query(RequestStorage, props.request.id).then((result) => {
      DataStore.save(RequestStorage.copyOf(result, item => {
        console.log("ACCEPTING");
        item.status = RequestStatus.ACCEPTED;
      }));
    })
  }

  if (props.request.status !== "PENDING") {
    return (<></>)
  }

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <UserAvatar className={styles.avatar} alt="" id={props.request.sender_sub}/>
        <p className={styles.name}> {props.request.sender_username}</p>
      </div>
      <div className={styles.spacer}/>
      <div className={styles.responseContainer}>
        <p onClick={accept} className={styles.accept}><MdIcons.MdDone/></p>
        <p onClick={reject} className={styles.reject}><MdIcons.MdClose/></p>
      </div>
    </div>
  )
}

export default RequestListItem

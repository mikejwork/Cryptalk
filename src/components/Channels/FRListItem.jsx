import React from 'react'
import styles from '../../css/Channels/FRListItem.module.css';
import * as MdIcons from "react-icons/md";
import { DataStore } from "aws-amplify";
import { RequestStorage, RequestStatus } from '../../models';
import UserAvatar from '../Wrappers/Avatar/UserAvatar'


function FRListItem(props) {
    async function reject() {
        DataStore.query(RequestStorage, props.data.id).then((result) => {
          DataStore.save(RequestStorage.copyOf(result, item => {
            item.status = RequestStatus.REJECTED;
          }));
        })
      }

      async function accept() {
        DataStore.query(RequestStorage, props.data.id).then((result) => {
          DataStore.save(RequestStorage.copyOf(result, item => {
            console.log("ACCEPTING");
            item.status = RequestStatus.ACCEPTED;
          }));
        })
      }

      if (props.data.status !== "PENDING") {
        return (<></>)
      }

      return (
        <div className={styles.container}>
          <div className={styles.infoContainer}>
            <UserAvatar className={styles.avatar} alt="" id={props.data.sender_sub}/>
            <p className={styles.name}> {props.data.sender_username}</p>
          </div>
          <div className={styles.spacer}/>
          <div className={styles.responseContainer}>
            <p onClick={accept} className={styles.accept}><MdIcons.MdDone/></p>
            <p onClick={reject} className={styles.reject}><MdIcons.MdClose/></p>
          </div>
        </div>
      )
  }

  export default FRListItem

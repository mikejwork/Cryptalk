/*
  Author: Michael, Braden
  Description:
    This class is used to list all the user Channels, Friends and Friend requests

  Related PBIs: 19, 7, 13
*/

import React, { useContext } from 'react'

import { ChannelsContext } from "../Channels/Channels";
import { AuthContext } from "../../../contexts/AuthContext";

import styles from './index.module.css'
import * as HiIcons from "react-icons/hi";

import FriendsListAdd from "../FriendsListAdd/FriendsListAdd";
import FriendsListItem from "../FriendsListItem/FriendsListItem";
import RequestListItem from "../RequestListItem/RequestListItem";
import ChannelsListItem from "../ChannelsListItem/ChannelsListItem";

import Header from '../../Wrappers/Header/Header'

function ChannelsList() {
  const context = useContext(AuthContext)
  const channelsContext = useContext(ChannelsContext)

  return (
    <div className={styles.container}>
        <Header text="GROUPS">
          <HiIcons.HiDocumentAdd onClick={() => channelsContext.set_ViewOverlay("ViewOverlay_NewChannel")} id="cypress-addChannel"/>
        </Header>
        {/* Finds all channels user has */}
      { context?.channels?.map((channel) => {
        return (
          <ChannelsListItem key={channel.id} _Channel={channel}/>
        )
      })}
        {/* Lists and finds all friends user has */}
      <Header text="FRIENDS"/>
      { context?.friends?.map((friend) => {
        return (
          <FriendsListItem key={friend.sub} friend={friend} selectable={true}/>
        )
      })}
      <FriendsListAdd/>

      <Header text="PENDING REQUESTS"/>
      { context?.requests?.map((request) => {
        return (
          <RequestListItem key={request.id} request={request}/>
        )
      })}
    </div>
  )
}

export default ChannelsList

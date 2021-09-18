import React, { useState } from 'react'
import { DataStore } from "aws-amplify"
import { Channel } from '../../../models';
import EmojiMenu from '../../Wrappers/Emoji/EmojiMenu'
import styles from '../../../css/Channels/EditChannel/Edit.module.css';

function EditDetails(props) {

  let initialState = {
    name: props._Channel.name,
    description: props._Channel.description,
    message: props._Channel.icon
  }

  const [formState, setformState] = useState(initialState)

  function creationDate() {
    var date = new Date(props._Channel.createdAt);
    return (<>{ date.getFullYear() }-{ date.getMonth() + 1 }-{ date.getDate() }</>)
  }

  function editedAt() {
    var date = new Date(props._Channel.createdAt);
    return (<>{ date.getFullYear() }-{ date.getMonth() + 1 }-{ date.getDate() } { 24 - date.getHours() }:{ date.getMinutes() }:{ date.getSeconds() }</>)
  }

  async function save_changes() {
    await DataStore.save(Channel.copyOf(props._Channel, item => {
      item.name = formState.name
      item.description = formState.description
      item.icon = formState.message
    }));
  }

  function onChange(e) {
    setformState(() => ({
      ...formState,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <h2>Details</h2>
        <h6>View and edit channel information & details</h6>
        <hr/>
      </div>
      <div className={styles.setting}>
        <h5>Date created</h5>
        <h6>{ creationDate() }</h6>
      </div>
      <div className={styles.setting}>
        <h5>Last edited</h5>
        <h6>{ editedAt() }</h6>
      </div>
      <div className={styles.setting}>
        <h5>Channel name</h5>
        <input value={formState.name} onChange={onChange} autoComplete="off" name="name" spellCheck="false" type="text" placeholder="Channel name.."/>
      </div>
      <div className={styles.setting}>
        <h5>Channel description</h5>
        <input value={formState.description} onChange={onChange} autoComplete="off" name="description" spellCheck="false" type="text" placeholder="Channel description.."/>
      </div>
      <div className={styles.setting}>
        <h5>Channel icon</h5>
        <div className={styles.emojiContainer}>
          <p>{formState.message}</p>
          <EmojiMenu setting="REPLACE" formState={formState} setformState={setformState} className={styles.emojiMenuIcon}/>
        </div>
      </div>
      <div className={styles.submit}>
        <button onClick={save_changes}>Save changes</button>
      </div>
    </div>
  )
}

export default EditDetails

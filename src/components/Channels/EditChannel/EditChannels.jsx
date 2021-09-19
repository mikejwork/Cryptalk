import React, { useState, useContext } from 'react'
import { DataStore } from "aws-amplify";
import { AuthContext } from "../../../contexts/AuthContext";
import { SubChannel, SubChannelType } from '../../../models';
import * as HiIcons from "react-icons/hi";
import Toggle from '../../../components/Wrappers/Toggle/Toggle'
import styles from '../../../css/Channels/EditChannel/Edit.module.css';

function EditChannels(props) {
  const context = useContext(AuthContext)
  const [formState, setformState] = useState({})
  const [isVoice, setisVoice] = useState(false)

  async function addChannel() {
    if (!formState.name) { return }
    if (!/[^\s]/.test(formState.name)) { return }
    if (!props._Channel) { return }

    await DataStore.save(
      new SubChannel({
        "name": formState.name,
        "type": isVoice ? SubChannelType.VOICE : SubChannelType.TEXT,
        "users": [{username: context.user.username, sub: context.user.attributes.sub}],
        "channelID": props._Channel.id
      })
    )
    setformState({})
    setisVoice(false)
    document.getElementById("name").value = ""
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
        <h2>Channels</h2>
        <h6>View and edit sub-channels</h6>
        <hr/>
      </div>
      <div className={styles.subContainer}>
        <div className={styles.subContainerDivHalf}>
          <h6 className={styles.subtitle}>SUBCHANNELS</h6>
          <hr/>
          { props._SubChannels &&
            <div className={styles.subChannels}>
              { props._SubChannels.map((subchannel) => {
                return (
                  <div key={subchannel.id} className={styles.subChannel}>
                    { subchannel.type === "TEXT" ? <HiIcons.HiHashtag/> : <HiIcons.HiMicrophone/>}
                    <p>{subchannel.name}</p>
                  </div>
                )
              })}
            </div>
          }
        </div>
        <div className={styles.subContainerDivHalf}>
          <h6 className={styles.subtitle}>CREATE NEW SUBCHANNEL</h6>
          <hr/>
          <div className={styles.setting}>
            <h5>Subchannel name</h5>
            <input onChange={onChange} autoComplete="off" id="name" name="name" spellCheck="false" type="text" placeholder="Subchannel name.."/>
          </div>
          <div className={styles.setting}>
            <h5>Subchannel type: { isVoice ? <>VOICE</> : <>TEXT</>}</h5>
            <Toggle value={setisVoice}/>
          </div>
          <hr/>
          <div className={styles.submit}>
            <button onClick={addChannel}>Add channel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditChannels

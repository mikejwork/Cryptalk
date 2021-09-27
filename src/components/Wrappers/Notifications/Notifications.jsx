import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { useSpring, animated } from 'react-spring'
import * as MdIcons from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';
import styles from './index.module.css'

// context.spawnNotification("ERROR", "Login error", "Username field is required!");

function Wrap(props) {
  const [styling, api] = useSpring(() => ({opacity: "0"}))

  useEffect(() => {
    api.start({
      opacity: "1",
      onRest: () => startTimer()
    })
  })

  function startTimer() {
    setTimeout(() => {
      close()
    }, 1000);
  }

  function close() {
    api.start({
      opacity: "0",
      onRest: () => props.unset(props.itemKey)
    })
  }

  function getIcon() {
    switch(props.type) {
      case "SUCCESS":
        return <MdIcons.MdDoneAll style={{color:"green"}}/>;
      case "DELETE":
        return <MdIcons.MdDeleteForever style={{color:"red"}}/>;
      case "NETWORK":
        return <MdIcons.MdDns style={{color:"orange"}}/>;
      case "INFO":
        return <MdIcons.MdHelp/>;
      case "WAIT":
        return <MdIcons.MdHourglassFull style={{color:"orange"}}/>;
      case "DOWNLOAD":
        return <MdIcons.MdGetApp style={{color:"orange"}}/>;
      case "ERROR":
        return <MdIcons.MdReport style={{color:"red"}}/>;
      default:
        break;
    }
  }

  return (
    <animated.div style={styling} className={styles.wrapContainer}>
      <div className={styles.icon}>
        {getIcon()}
      </div>
      <div className={styles.info}>
        <p className={styles.title}>{props.title}</p>
        <p className={styles.message}>{props.message}</p>
      </div>
      <div className={styles.actions}>
        <MdIcons.MdClose className={styles.close} onClick={close}/>
      </div>
    </animated.div>
  )
}

const Notification = forwardRef((props, ref) => {
  const [_Notifications, set_Notifications] = useState([])

  // Remove an element by key
  function unset(key) {
    set_Notifications(old => old.filter(item => item.key !== key));
  }

  useImperativeHandle(ref, () => ({
    spawn(type, title, message) {
      let itemKey = uuidv4();
      set_Notifications(old => [...old, {
        key: itemKey,
        element: <Wrap type={type} title={title} message={message} itemKey={itemKey} unset={unset}/>
      }])
    }
  }))

  return (
    <div className={styles.container}>
      <div className={styles.sideContainer}>
        { _Notifications.map((item) => {
          return (
            <div key={item.key}>
              {item.element}
            </div>
          )
        })}
      </div>
    </div>
  )
})

export default Notification

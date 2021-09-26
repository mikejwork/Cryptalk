import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { useSpring, animated } from 'react-spring'
import * as MdIcons from "react-icons/md";
import styles from './index.module.css'

// SUCCESS <MdIcons.MdDoneAll/>
// DELETE <MdIcons.MdDeleteForever/>
// NETWORK <MdIcons.MdDns/>
// INFO <MdIcons.MdHelp/>
// WAIT <MdIcons.MdHourglassFull/>
// DOWNLOAD <MdIcons.MdGetApp/>
// ERROR <MdIcons.MdReport/>

const Notification = forwardRef((props, ref) => {
  const [_Type, set_Type] = useState("SUCCESS")
  const [_Title, set_Title] = useState("Nil")
  const [_Message, set_Message] = useState("Nil")
  var timeout;
  const [styling, api] = useSpring(() => ({
    opacity: "0"
  }))

  useImperativeHandle(ref, () => ({
      spawn(type, title, message) {
        console.log('spawn')
        set_Type(type);
        set_Title(title);
        set_Message(message);
        open();

        timeout = setTimeout(() => {
          close();
        }, 5000)
      }
  }))

  function open() {
    console.log('open')
    api.start({opacity: "1"})
  }

  function close() {
    console.log('close')
    api.start({opacity: "0"})
  }

  function getIcon() {
    switch(_Type) {
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
    <>
      <div className={styles.container}>
        <div>
          <animated.div style={styling} className={styles.notification}>
            <div className={styles.icon}>
              {getIcon()}
            </div>
            <div className={styles.info}>
              <p className={styles.title}>{_Title}</p>
              <p className={styles.message}>{_Message}</p>
            </div>
            <div className={styles.actions}>
              <MdIcons.MdClose onClick={close} style={{cursor:"pointer"}}/>
            </div>
          </animated.div>
        </div>
      </div>
    </>
  )
})

export default Notification

import React, { useState } from 'react'
import * as HiIcons from "react-icons/hi";
import { Redirect } from "react-router-dom";
import style from './index.module.css';

function Home() {
  const [redirect, setredirect] = useState(false)

  if (redirect) {
    return <Redirect to="/authentication"/>
  }

  return (
    <>
      <div className={style.home} id="cypress-home">

        <div className={style.homeContainer}>
          <div className={style.homeTitle}>
            <img src={process.env.PUBLIC_URL + '/logo_assets/3000x3000-Logo.png'} alt="Cryptalk logo."/>
            <h1>Cryptalk</h1>
            <p>Secure text and voice chat, designed for teams, used by teams.</p>
            <button onClick={() => setredirect(true)} id="cypress-getStarted">Get started</button>
            <HiIcons.HiChevronDoubleDown className={style.downArrow} style={{alignSelf:"center", marginTop:"5ex"}}/>
          </div>
          <div className={style.homeImage}>
            <img src={process.env.PUBLIC_URL + '/vector_assets/home-1.svg'} alt="Two figures interacting with a web-application."/>
          </div>
        </div>

        <div className={style.chatting}>
          <div className={style.chattingTitleIcon}>
            <HiIcons.HiAnnotation/>
          </div>
          <div className={style.chattingTitle}>
            <h1>The perfect environment for collaboration</h1>
            <h4>delegate work, execute sprint meetings</h4>
          </div>
          <div className={style.chattingImg}>
            <img src={process.env.PUBLIC_URL + '/examples_assets/chatting.png'} alt="Cryptalk logo."/>
          </div>
        </div>

        <div className={style.features}>
          <div className={style.card}>
            <HiIcons.HiCloud className={style.cardIcon} style={{color:"#ad2d6d"}}/>
            <h1>Real time</h1>
            <h4>
              Meet, share and plan, all in real time.
              Access all of your shared files and messages straight from the cloud.
            </h4>
          </div>
          <div className={style.card}>
            <HiIcons.HiKey className={style.cardIcon} style={{color:"var(--bg-accent)"}}/>
            <h1>Encrypted</h1>
            <h4>
              All of your messages are encrypted to keep your data safe.
              Ensuring you and your team members have safe access.
            </h4>
          </div>
          <div className={style.card}>
            <HiIcons.HiUpload className={style.cardIcon} style={{color:"orange"}}/>
            <h1>File sharing</h1>
            <h4>
              Share documents, videos and more to your team.
              Stored on our cloud, your files will be accessible from anywhere.
            </h4>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

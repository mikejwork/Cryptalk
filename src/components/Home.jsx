import React, { useState } from 'react'
import { Redirect } from "react-router-dom";
import { useSpring, animated } from 'react-spring';
import '../css/Home.css';

function Home() {
  const [redirect, setredirect] = useState(false)
  const pageStyling = useSpring({
    from: { transform: `translateY(100%)` },
    to: { transform: `translateY(0%)` },
    delay: 100
    })

  if (redirect) {
    return <Redirect to="/dashboard"/>
  }

  return (
    <>
      <div className="home">
        <animated.div style={pageStyling} className="home-container">
          <div className="home-title">
            <img src={process.env.PUBLIC_URL + '/logo_assets/3000x3000-Logo.png'} alt="Cryptalk logo."/>
            <h1>Cryptalk</h1>
            <p>Secure text and voice chat, designed for teams, used by teams.</p>
            <button onClick={() => setredirect(true)}>Get started</button>
          </div>
          <div className="home-image">
            <img src={process.env.PUBLIC_URL + '/vector_assets/home-1.svg'} alt="Two figures interacting with a web-application."/>
          </div>
        </animated.div>
      </div>
    </>
  )
}

export default Home

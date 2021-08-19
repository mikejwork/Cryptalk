import React from 'react'
import '../css/Home.css';

function Home() {
  return (
    <>
      <div className="home">
        <div className="home-div">
          <img src={process.env.PUBLIC_URL + '/logo-white-crop.png'} alt="" className="home-logo" />
          <div className="anim"><p>.</p></div>
          <span className="anim-place">|</span>
        </div>
        <h3 className="caption">Secure messaging and voice chat for teams.</h3>
      </div>

    </>
  )
}

export default Home

import React from 'react'
import '../css/Home.css';

function Home() {
  return (
    <>
      <div className="home">
        <div className="container">
          <img src={process.env.PUBLIC_URL + '/aligned-logo.png'} alt="" className="Logo" />

          <span className="Animated"></span>

          <h3 className="Caption">Secure messaging and voice chat for teams.</h3>
        </div>
      </div>
    </>
  )
}

export default Home

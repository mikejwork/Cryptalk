import React from 'react'
import '../css/Homepage.css';

function Home() {
  return (
    <div className="div-main">
        <h1><strong>Welcome to Cryptalk</strong></h1>
        <a href="../profile">
          <button> Profile </button>
        </a>
        <a href="../channels">
          <button> Channels </button>
        </a>
        <a href="../login">
          <button > login </button>
        </a>
    </div>
  )
}

export default Home

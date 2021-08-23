import React from 'react'

import '../css/Footer.css';

function Footer() {
  return (
    <div className="footer-container">
      <a href="/privacy" className="hyperlink">Privacy Policy</a>
      <span className="spacer">.</span>
      <a href="/terms" className="hyperlink">Terms & Conditions</a>
      <span className="spacer">.</span>
      <span className="trademark">© 2021 Cryptalk</span>
    </div>
  )
}

export default Footer

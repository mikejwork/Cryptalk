<div align="center">
    <img src="https://i.imgur.com/vUI6rcQ.png" alt="Cryptalk" width="450">
</div>

<h4 align="center">A secure messaging and voice chat for teams built with <a href="https://aws.amazon.com/amplify/" target="_blank">AWS Amplify</a>.</h4>

<p align="center">
  <a href="#local-setup">Local setup</a> •
  <a href="#showcase">Showcase</a> •
  <a href="#personal-notes">Personal notes</a>
</p>

<div align="center">
  <a href="https://github.com/mikejwork/COSC2408-2150-Capstone-TEAM07/releases/tag/v0.1">
      <img src="https://img.shields.io/badge/Release-v0.1_(prerelease)-orange"/>
  </a>
  <a href="https://github.com/mikejwork/COSC2408-2150-Capstone-TEAM07/releases/tag/v0.2">
      <img src="https://img.shields.io/badge/Release-v0.2-9cf"/>
  </a>
  <a href="https://github.com/mikejwork/COSC2408-2150-Capstone-TEAM07/releases/tag/v0.3">
      <img src="https://img.shields.io/badge/Release-v0.3-9cf"/>
  </a>
  <a href="https://github.com/mikejwork/COSC2408-2150-Capstone-TEAM07/releases/tag/v0.4">
      <img src="https://img.shields.io/badge/Release-v0.4-9cf"/>
  </a>
  <a href="https://github.com/mikejwork/COSC2408-2150-Capstone-TEAM07/releases/tag/v0.5">
      <img src="https://img.shields.io/badge/Release-v0.5-9cf"/>
  </a>
  <a href="https://github.com/mikejwork/COSC2408-2150-Capstone-TEAM07/releases/tag/v1.0">
      <img src="https://img.shields.io/badge/Release-v1.0-green"/>
  </a>
</div>


**Credits:**
1. Braden Smith - Software Developer
2. Michael Jurie - Software Developer
3. Luke Cocorocchio - Scrum Master
4. Matthew Sesto - Product Owner

**Project description**<br/>
Cryptalk is a secure text and voice chat application that allows for real-time communication for teams, build specifically for the Royal Melbourne Institute of Technology for their faculty and student base. The project requires scalable cloud infrastructure to manage the backend database and large number of requests, and a sleek and enjoyable user interface

**Features**<br/>
User authentication
User profile & customisation
Friend request system
Direct messaging
Channel system
Text channels & Voice channels
Specific channel permission system
Attachment sending and downloads (all stored on-cloud)
WebRTC, Peer to peer voice chat

**Outstanding Problems**
1. Socket server overhaul, problems with TLS/SSL certificates on production app. Voice chat only works with local development server running at the moment.
2. Sockets and WebRTC can be optimised further to reduce connection dropouts.
3. Video chat can easily be implemented with the above changes, but for now is too buggy to keep in the production app.

import React, { useState, useContext } from 'react'
import { useSpring, animated, useTrail } from 'react-spring'
import { Redirect } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import '../css/Dashboard.css';
import * as MdIcons from "react-icons/md";

function FeedPost(props) {

  function Tag(props) {
    return (
      <div className="feed-post-tag">
        <p>#{props.tagname}</p>
      </div>
    )
  }

  function AnnouncementPost() {
    return (
      <>
        <li>
          <div className="feed-post-container">
            <p className="feed-post-timestamp"><MdIcons.MdTimer className="feed-post-timestamp-icon"/>{props.timestamp}</p>
            <div className="feed-post-info">
              <p className="feed-post-title">{props.title}</p>
              <p className="feed-post-users">{props.organizer}</p>
              <div className="feed-post-tags">
                {props.tags.map((tag) => {
                  return <Tag tagname={tag.tagname}/>
                })}
              </div>
            </div>
          </div>
        </li>
      </>
    )
  }

  function MeetingPost() {
    return (
      <>

      </>
    )
  }

  function FriendRequestPost() {
    return (
      <>

      </>
    )
  }

  function UnreadMessagePost() {
    return (
      <>
        <li>
          <div className="feed-post-container">
            <p className="feed-post-timestamp"><MdIcons.MdTimer className="feed-post-timestamp-icon"/>{props.timestamp}</p>
            <div className="feed-post-info">
              <p className="feed-post-title">Unread message</p>
              <p className="feed-post-message">{props.sender}: <p className="feed-post-message-content">{props.message}</p></p>
            </div>
            <button className="feed-post-button"><MdIcons.MdMarkunread className="feed-post-timestamp-icon"/> Mark as read</button>
          </div>
        </li>
      </>
    )
  }

  switch(props.type) {
    case "meeting":
      return <MeetingPost/>
    case "announcement":
      return <AnnouncementPost/>
    case "friend-request":
      return <FriendRequestPost/>
    case "unread-message":
      return <UnreadMessagePost/>
    default:
      break;
  }

  return (
    <>
      <li>
        <div className="feed-post-container">
          <p className="feed-post-timestamp"><MdIcons.MdTimer className="feed-post-timestamp-icon"/>{props.timestamp}</p>
          <div className="feed-post-info">
            <p className="feed-post-title">{props.title}</p>
            {props.message &&  <p className="feed-post-message">{props.sender}: <p className="feed-post-message-content">{props.message}</p></p>}
            {props.users && <p className="feed-post-users">{props.users}</p>}
            {props.tags && <div className="feed-post-tags">{props.tags.map((tag) => {return <Tag tagname={tag.tagname}/>})}</div>}
          </div>
          {props.message && <button className="feed-post-button"><MdIcons.MdMarkunread className="feed-post-timestamp-icon"/> Mark as read</button>}
        </div>
      </li>
    </>
  )
}

function Dashboard() {
  const context = useContext(AuthContext)
  const styling = useSpring({
    from: { transform:`translateY(100%)`, opacity: 0 },
    to: { transform:`translateY(0%)`, opacity: 1 }
  })

  // redirect if not logged in
  if (!context.user) { return <Redirect to="/authentication"/> }

  return (
    <div className="background">
      <animated.div style={styling} className="dashboard-container">
        <animated.div style={styling} className="people">
          <div className="people-title">
            <h2>People</h2>
          </div>
          <div className="people-list">
            <h6>ONLINE (4)</h6>
            <ul>
              <li>
                <div className="people-container">
                  <img className="people-avatar" src={process.env.PUBLIC_URL + '/default_avatars/1.jpg'} alt=" "/>
                  <div className="people-info">
                    <p className="people-info-name">Michael Jurie</p>
                    <p className="people-info-status">custom user status here</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="people-container">
                  <img className="people-avatar" src={process.env.PUBLIC_URL + '/default_avatars/2.jpg'} alt=" "/>
                  <div className="people-info">
                    <p className="people-info-name">John Smith</p>
                    <p className="people-info-status">custom user status here</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="people-container">
                  <img className="people-avatar" src={process.env.PUBLIC_URL + '/default_avatars/3.jpg'} alt=" "/>
                  <div className="people-info">
                    <p className="people-info-name">Mark Bevan</p>
                    <p className="people-info-status">custom user status here</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="people-container">
                  <img className="people-avatar" src={process.env.PUBLIC_URL + '/default_avatars/4.jpg'} alt=" "/>
                  <div className="people-info">
                    <p className="people-info-name">Jason Clarke</p>
                    <p className="people-info-status">custom user status here</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </animated.div>
        <animated.div style={styling} className="feed">
          <div className="feed-title">
            <h2>Your Feed</h2>
            <h6>Unread notifications</h6>
          </div>
          <div className="feed-list">
            <ul>
              {/* Replace this with functional db logic */}
              <FeedPost
                type="meeting"
                title="Team meeting"
                timestamp="12:00 PM"
                users="Michael Jurie, John Smith, Mark Bevan, Marcy Wu"
                tags={[{"tagname": "scrum"}, {"tagname": "team-meeting"}]}
              />

              <FeedPost
                type="unread-message"
                timestamp="6:30 AM"
                sender="John Smith"
                message="Hey, ready for the meeting at 12?"
              />

              <FeedPost
                type="announcement"
                title="RMIT Student Experience Survey"
                timestamp="Friday 10:30 AM"
                organizer="RMIT Coordinators"
                tags={[{"tagname": "student-survey"}, {"tagname": "ses"}]}
              />
            </ul>
          </div>
        </animated.div>
      </animated.div>
    </div>
  )
}

export default Dashboard

import React, { useState, useEffect, useContext } from 'react'
import { Storage } from "aws-amplify";
import { useSpring, animated } from 'react-spring';
import { AuthContext } from "../../../contexts/AuthContext";
// Unused but leave empty
// import styles from "../../../css/Wrappers/Avatar/UserAvatar.module.css";

function UserAvatar(props) {
  const context = useContext(AuthContext);
  const [source, setSource] = useState(undefined);
  const [loaded, setloaded] = useState(false)
  const [styling, api] = useSpring(() => ({
    opacity: `0`,
    config: { duration: 500 }
  }))

  useEffect(() => {
    if (props.id === context.user.attributes.sub && context._cachedAvatar) {
      setSource(context._cachedAvatar);
    } else {
      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id]);

  useEffect(() => {
    api.start({
      opacity: loaded ? `1` : `0`
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  async function fetch() {
    const src = await Storage.get(props.id + ".jpg");
    setSource(src);
  }

  return (
    <>
      <animated.img className={`${props.className}`} style={styling} src={source} alt={props.alt} onLoad={() => setloaded(true)}/>
    </>
  )
}

export default UserAvatar

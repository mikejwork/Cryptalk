import React, { useState, useEffect } from 'react'
import { Storage } from "aws-amplify";

function AvatarImg(props) {
  const [source, setSource] = useState(undefined)

  useEffect(() => {
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id])

  async function fetch() {
    const src = await Storage.get(props.id + ".jpg")
    setSource(src)
  }

  return (
    <img className={props.className} style={props.style} src={source} alt={props.alt}/>
  )
}

export default AvatarImg

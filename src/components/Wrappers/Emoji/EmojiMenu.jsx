/*
  Author: Michael
  Description:
    Emoji menu for text chatting
  Related PBIs: nil
*/

import React, { useState } from 'react'
import * as MdIcons from "react-icons/md";
import styles from './index.module.css';

const emojis = [
  '๐','๐','๐','๐','๐','๐','๐','๐คฃ','๐','๐','๐','๐','๐','๐'
  ,'๐','๐ฅฐ','๐','๐','๐','๐','๐','๐','๐','๐','๐คช','๐คจ','๐ง','๐ค'
  ,'๐','๐คฉ','๐ฅณ','๐','๐','๐','๐','๐','๐','๐','โน๏ธ','๐ฃ','๐','๐ซ'
  ,'๐ฉ','๐ฅบ','๐ข','๐ญ','๐ค','๐ ','๐ก','๐คฌ','๐คฏ','๐ณ','๐ฅต','๐ฅถ','๐ฑ','๐จ'
  ,'๐ฐ','๐ฅ','๐','๐ค','๐ค','๐คญ','๐คซ','๐คฅ','๐ถ','๐','๐','๐ฌ','๐','๐ฏ'
  ,'๐ฆ','๐ง','๐ฎ','๐ฒ','๐ฅฑ','๐ด','๐คค','๐ช','๐ต','๐ค','๐ฅด','๐คข','๐คฎ','๐คง'
  ,'๐ท','๐ค','๐ค','๐ค','๐ค ','๐','๐ฟ','๐น','๐บ','๐คก','๐ฉ','๐ป','๐','โ ๏ธ'
  ,'๐ฝ','๐พ','๐ค','๐','๐บ','๐ธ','๐น','๐ป','๐ผ','๐ฝ','๐','๐','๐ค','๐'
  ,'โ','๐','๐','๐ค','โ๏ธ','๐ค','๐ค','๐ค','๐ค','๐','๐','๐','๐','๐','โ๏ธ'
  ,'๐','๐','โ','๐','๐ค','๐ค','๐','๐','๐','๐คฒ','๐ค','๐','โ๏ธ','๐'
  ,'๐คณ','๐ช','๐ฆพ','๐ฆต','๐ฆฟ','๐ฆถ','๐๐ป','๐ค๐ป','๐๐ป','โ๐ป','๐๐ป','๐๐ป','๐ค๐ป','โ๐ป','๐ค๐ป'
  ,'๐ค๐ป','๐ค๐ป','๐ค๐ป','๐๐ป','๐๐ป','๐๐ป','๐๐ป','๐๐ป','โ๐ป','๐๐ป','๐๐ป','โ๐ป','๐๐ป','๐ค๐ป','๐ค๐ป'
  ,'๐๐ป','๐๐ป','๐๐ป','๐คฒ๐ป','๐๐ป','โ๐ป','๐๐ป','๐คณ๐ป','๐ช๐ป','๐ฆต๐ป','๐ฆถ๐ป','๐๐ผ','๐ค๐ผ','๐๐ผ'
  ,'โ๐ผ','๐๐ผ','๐๐ผ','๐ค๐ผ','โ๐ผ','๐ค๐ผ','๐ค๐ผ','๐ค๐ผ','๐ค๐ผ','๐๐ผ','๐๐ผ','๐๐ผ','๐๐ผ','๐๐ผ','โ๐ผ'
  ,'๐๐ผ','๐๐ผ','โ๐ผ','๐๐ผ','๐ค๐ผ','๐ค๐ผ','๐๐ผ','๐๐ผ','๐๐ผ','๐คฒ๐ผ','๐๐ผ','โ๐ผ','๐๐ผ','๐คณ๐ผ'
  ,'๐ช๐ผ','๐ฆต๐ผ','๐ฆถ๐ผ','๐๐ฝ','๐ค๐ฝ','๐๐ฝ','โ๐ฝ','๐๐ฝ','๐๐ฝ','๐ค๐ฝ','โ๐ฝ','๐ค๐ฝ','๐ค๐ฝ','๐ค๐ฝ','๐ค๐ฝ'
  ,'๐๐ฝ','๐๐ฝ','๐๐ฝ','๐๐ฝ','๐๐ฝ','โ๐ฝ','๐๐ฝ','๐๐ฝ','โ๐ฝ','๐๐ฝ','๐ค๐ฝ','๐ค๐ฝ','๐๐ฝ','๐๐ฝ'
  ,'๐๐ฝ','๐คฒ๐ฝ','๐๐ฝ','โ๐ฝ','๐๐ฝ','๐คณ๐ฝ','๐ช๐ฝ','๐ฆต๐ฝ','๐ฆถ๐ฝ','๐๐พ','๐ค๐พ','๐๐พ','โ๐พ','๐๐พ'
  ,'๐๐พ','๐ค๐พ','โ๐พ','๐ค๐พ','๐ค๐พ','๐ค๐พ','๐ค๐พ','๐๐พ','๐๐พ','๐๐พ','๐๐พ','๐๐พ','โ๐พ','๐๐พ','๐๐พ'
  ,'โ๐พ','๐๐พ','๐ค๐พ','๐ค๐พ','๐๐พ','๐๐พ','๐๐พ','๐คฒ๐พ','๐๐พ','โ๐พ','๐๐พ','๐คณ๐พ','๐ช๐พ','๐ฆต๐พ'
  ,'๐ฆถ๐พ','๐๐ฟ','๐ค๐ฟ','๐๐ฟ','โ๐ฟ','๐๐ฟ','๐๐ฟ','๐ค๐ฟ','โ๐ฟ','๐ค๐ฟ','๐ค๐ฟ','๐ค๐ฟ','๐ค๐ฟ','๐๐ฟ','๐๐ฟ'
  ,'๐๐ฟ','๐๐ฟ','๐๐ฟ','โ๐ฟ','๐๐ฟ','๐๐ฟ','โ๐ฟ','๐๐ฟ','๐ค๐ฟ','๐ค๐ฟ','๐๐ฟ','๐๐ฟ','๐๐ฟ','๐คฒ๐ฟ','๐๐ฟ'
  ,'โ๐ฟ','๐๐ฟ','๐คณ๐ฟ','๐ช๐ฟ','๐ฆต๐ฟ','๐ฆถ๐ฟ','๐','๐','๐','๐','๐','๐','๐','๐'
  ,'๐','๐','๐','๐','๐','๐','๐','๐','๐ช','๐ซ','โญ๏ธ','๐','โจ','โก๏ธ'
  ,'โ๏ธ','๐ฅ','๐ฅ','๐ช','๐','โ๏ธ','๐ค','โ๏ธ','๐ฅ','โ๏ธ','๐ฆ','๐ง','โ','๐ฉ','๐จ'
  ,'โ๏ธ','โ๏ธ','โ๏ธ','๐ฌ','๐จ','๐ง','๐ฆ','โ๏ธ','โ๏ธ','๐','๐ซ','๐','๐','๐','๐'
  ,'๐','๐','๐','๐','๐','๐','๐','๐','๐ฅญ','๐','๐ฅฅ','๐ฅ','๐','๐'
  ,'๐ฅ','๐ฅฆ','๐ฅฌ','๐ฅ','๐ถ','๐ฝ','๐ฅ','๐ง','๐ง','๐ฅ','๐ ','๐ฅ','๐ฅฏ','๐'
  ,'๐ฅ','๐ฅจ','๐ง','๐ฅ','๐ณ','๐ง','๐ฅ','๐ง','๐ฅ','๐ฅฉ','๐','๐','๐ฆด','๐ญ'
  ,'๐','๐','๐','๐ฅช','๐ฅ','๐ง','๐ฎ','๐ฏ','๐ฅ','๐ฅ','๐ฅซ','๐','๐','๐ฒ'
  ,'๐','๐ฃ','๐ฑ','๐ฅ','๐ฆช','๐ค','๐','๐','๐','๐ฅ','๐ฅ ','๐ฅฎ','๐ข','๐ก'
  ,'๐ง','๐จ','๐ฆ','๐ฅง','๐ง','๐ฐ','๐','๐ฎ','๐ญ','๐ฌ','๐ซ','๐ฟ','๐ฉ','๐ช'
  ,'๐ฐ','๐ฅ','๐ฏ','๐ฅ','๐ผ','โ๏ธ','๐ต','๐ง','๐ฅค','๐ถ','๐บ','๐ป','๐ฅ','๐ท','๐ฅ'
  ,'๐ธ','๐น','๐ง','๐พ','๐ง','๐ฅ','๐ด','๐ฝ','๐ฅฃ','๐ฅก','๐ฅข','๐ง','โค๏ธ','๐งก','๐'
  ,'๐','๐','๐','๐ค','๐ค','๐ค','๐','โฃ๏ธ','๐','๐','๐','๐','๐','๐'
  ,'๐','๐ฃ','๐','๐ฆป','๐','๐ง ','๐ฆท','๐ฆด','๐','๐','๐','๐','๐','๐ฉธ', '๐ฌ'
];

// Pass an element to append the emoji to the input
// Example =>
//    pass an input field
//    when emoji is clicked the emoji is added to the end of element.value
function EmojiMenu(props) {
  const [open, setopen] = useState(false)

  function addEmoji(emoji) {
    switch(props.setting) {
      // will replace formState.message
      case "REPLACE":
        if (emoji) {
          props.setformState(() => ({...props.formState, message: emoji}));
          setopen(false)
        }
        break;
      // will append to the end of formState.message
      case "APPEND":
        if (emoji) {
          var temp = props.formState.message;
          temp += emoji;
          props.setformState(() => ({
            ...props.formState,
            message: temp
          }));
          // TODO: Toggle for this? user setting?
          setopen(false)
        }
        break;
      default:
        break;
    }
  }

  return (
    <div className={styles.parent}>
      <MdIcons.MdTagFaces className={styles.emoji} onClick={() => setopen(!open)}/>
      { open &&
        <div className={styles.container}>
          <div className={styles.list}>
            { emojis.map((i, k) => {
              return (
                <p key={k} onClick={() => addEmoji(i)}>{i}</p>
              )
            })}
          </div>
        </div>
      }
    </div>
  )
}

export default EmojiMenu

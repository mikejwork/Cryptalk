import React, { useState } from 'react'
import * as MdIcons from "react-icons/md";
import styles from '../../../css/Wrappers/Emoji/Emoji.module.css';

const emojis = [
  '😀','😃','😄','😁','😆','😅','😂','🤣','😊','😇','🙂','🙃','😉','😌'
  ,'😍','🥰','😘','😗','😙','😚','😋','😛','😝','😜','🤪','🤨','🧐','🤓'
  ,'😎','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫'
  ,'😩','🥺','😢','😭','😤','😠','😡','🤬','🤯','😳','🥵','🥶','😱','😨'
  ,'😰','😥','😓','🤗','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯'
  ,'😦','😧','😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧'
  ,'😷','🤒','🤕','🤑','🤠','😈','👿','👹','👺','🤡','💩','👻','💀','☠️'
  ,'👽','👾','🤖','🎃','😺','😸','😹','😻','😼','😽','🙀','👋','🤚','🖐'
  ,'✋','🖖','👌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️'
  ,'👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅'
  ,'🤳','💪','🦾','🦵','🦿','🦶','👋🏻','🤚🏻','🖐🏻','✋🏻','🖖🏻','👌🏻','🤏🏻','✌🏻','🤞🏻'
  ,'🤟🏻','🤘🏻','🤙🏻','👈🏻','👉🏻','👆🏻','🖕🏻','👇🏻','☝🏻','👍🏻','👎🏻','✊🏻','👊🏻','🤛🏻','🤜🏻'
  ,'👏🏻','🙌🏻','👐🏻','🤲🏻','🙏🏻','✍🏻','💅🏻','🤳🏻','💪🏻','🦵🏻','🦶🏻','👋🏼','🤚🏼','🖐🏼'
  ,'✋🏼','🖖🏼','👌🏼','🤏🏼','✌🏼','🤞🏼','🤟🏼','🤘🏼','🤙🏼','👈🏼','👉🏼','👆🏼','🖕🏼','👇🏼','☝🏼'
  ,'👍🏼','👎🏼','✊🏼','👊🏼','🤛🏼','🤜🏼','👏🏼','🙌🏼','👐🏼','🤲🏼','🙏🏼','✍🏼','💅🏼','🤳🏼'
  ,'💪🏼','🦵🏼','🦶🏼','👋🏽','🤚🏽','🖐🏽','✋🏽','🖖🏽','👌🏽','🤏🏽','✌🏽','🤞🏽','🤟🏽','🤘🏽','🤙🏽'
  ,'👈🏽','👉🏽','👆🏽','🖕🏽','👇🏽','☝🏽','👍🏽','👎🏽','✊🏽','👊🏽','🤛🏽','🤜🏽','👏🏽','🙌🏽'
  ,'👐🏽','🤲🏽','🙏🏽','✍🏽','💅🏽','🤳🏽','💪🏽','🦵🏽','🦶🏽','👋🏾','🤚🏾','🖐🏾','✋🏾','🖖🏾'
  ,'👌🏾','🤏🏾','✌🏾','🤞🏾','🤟🏾','🤘🏾','🤙🏾','👈🏾','👉🏾','👆🏾','🖕🏾','👇🏾','☝🏾','👍🏾','👎🏾'
  ,'✊🏾','👊🏾','🤛🏾','🤜🏾','👏🏾','🙌🏾','👐🏾','🤲🏾','🙏🏾','✍🏾','💅🏾','🤳🏾','💪🏾','🦵🏾'
  ,'🦶🏾','👋🏿','🤚🏿','🖐🏿','✋🏿','🖖🏿','👌🏿','🤏🏿','✌🏿','🤞🏿','🤟🏿','🤘🏿','🤙🏿','👈🏿','👉🏿'
  ,'👆🏿','🖕🏿','👇🏿','☝🏿','👍🏿','👎🏿','✊🏿','👊🏿','🤛🏿','🤜🏿','👏🏿','🙌🏿','👐🏿','🤲🏿','🙏🏿'
  ,'✍🏿','💅🏿','🤳🏿','💪🏿','🦵🏿','🦶🏿','🌝','🌛','🌜','🌚','🌕','🌖','🌗','🌘'
  ,'🌑','🌒','🌓','🌔','🌙','🌎','🌍','🌏','🪐','💫','⭐️','🌟','✨','⚡️'
  ,'☄️','💥','🔥','🌪','🌈','☀️','🌤','⛅️','🌥','☁️','🌦','🌧','⛈','🌩','🌨'
  ,'❄️','☃️','⛄️','🌬','💨','💧','💦','☔️','☂️','🌊','🌫','🍏','🍎','🍐','🍊'
  ,'🍋','🍌','🍉','🍇','🍓','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆'
  ,'🥑','🥦','🥬','🥒','🌶','🌽','🥕','🧄','🧅','🥔','🍠','🥐','🥯','🍞'
  ,'🥖','🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🦴','🌭'
  ,'🍔','🍟','🍕','🥪','🥙','🧆','🌮','🌯','🥗','🥘','🥫','🍝','🍜','🍲'
  ,'🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥠','🥮','🍢','🍡'
  ,'🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪'
  ,'🌰','🥜','🍯','🥛','🍼','☕️','🍵','🧃','🥤','🍶','🍺','🍻','🥂','🍷','🥃'
  ,'🍸','🍹','🧉','🍾','🧊','🥄','🍴','🍽','🥣','🥡','🥢','🧂','❤️','🧡','💛'
  ,'💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘'
  ,'💝','👣','👂','🦻','👃','🧠','🦷','🦴','👀','👁','👅','👄','💋','🩸', '💬'
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

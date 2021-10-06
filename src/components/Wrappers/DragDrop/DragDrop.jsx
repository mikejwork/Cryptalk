import React, {useState, useRef, useEffect } from 'react'

import styles from './index.module.css'

function DragDrop(props) {
    const ref = useRef()
    
    const [drag, setDrag] = useState(false);
    const dragOver = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setDrag(true)
    }
    const dragLeave = (event) => {
        event.preventDefault()
        event.stopPropagation()
        setDrag(false)
    }
    const dragEnter = (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
           setDrag(true)
          }
    }
    const dropFile = (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          props.dropFile(event.dataTransfer.files)
          event.dataTransfer.clearData()
          setDrag(false)
        }
    }

    useEffect(() => {
        if (ref.current) {
        let container = ref.current;
        container.addEventListener('dragover', dragOver);
        container.addEventListener('drop', dropFile);
        container.addEventListener('dragenter', dragEnter);
        container.addEventListener('dragleave', dragLeave);
       
    }
        return () => {
            if (ref.current)  {
                // eslint-disable-next-line
                let container = ref.current; 
                container.removeEventListener('dragover', dragOver);
                container.removeEventListener('drop', dropFile);
                container.removeEventListener('dragenter', dragEnter);
                container.removeEventListener('dragleave', dragLeave);
            }
        }
    }) // eslint-disable-next-line react-hooks/exhaustive-deps


    return (
        <div ref={ref} className={styles.container}>
            { drag &&
            <div className={styles.hoverDiv}>
                <div className={styles.innerHover}>
                    <h1>Drop your file in the input!</h1>
                </div>
            </div>
            }
            {props.children}
        </div>
    )
}

export default DragDrop

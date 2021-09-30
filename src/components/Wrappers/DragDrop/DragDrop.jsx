import React, {useRef, useEffect } from 'react'

import styles from './index.module.css'

function DragDrop(props) {
    const ref = useRef()
    const dragOver = (event) => {
        event.preventDefault()
        event.stopPropagation()
    }
    const dragLeave = (event) => {
        event.preventDefault()
        event.stopPropagation()
    }
    const dragEnter = (event) => {
        event.preventDefault()
        event.stopPropagation()
    }
    const dropFile = (event) => {
        event.preventDefault()
        event.stopPropagation()
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
          props.dropFile(event.dataTransfer.files)
          event.dataTransfer.clearData()
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
            {props.children}
        </div>
    )
}

export default DragDrop

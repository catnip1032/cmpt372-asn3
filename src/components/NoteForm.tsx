// A form for taking notes. The form includes a 'Title' input field as well as a 'Body'
// input field for the note.

import { useState } from "react"
import styles from "./NoteForm.module.css"

interface NoteFormProps {
    titleState: any
    bodyState: any
    onTitleChange: (noteTitle: string) => void
    onBodyChange: (noteBody: string) => void
}

const NoteForm: React.FC<NoteFormProps> = (props: NoteFormProps) => {
    const [showTitleError, setShowTitleError] = useState(false);
    const [showBodyError, setShowBodyError] = useState(false);

    function handleTitleInputChange(event: any) {
        const element = event.currentTarget as HTMLInputElement
        const value = element.value
        if (value.length >= 50) {
            setShowTitleError(true);
        } else {
            setShowTitleError(false);
            props.onTitleChange(value)
        }
    }
    
    function handleBodyTextAreaChange(event: any) {
        const element = event.currentTarget as HTMLInputElement
        const value = element.value
        if (value.length >= 500) {
            setShowBodyError(true);
        } else {
            setShowBodyError(false);
            props.onBodyChange(value)
        }
        
    }

    return (
            <form action="/api/form">
                <div className={styles.formElements}>
                <label className={styles.formLabels} htmlFor="title">Title:</label>
                <input className={styles.input}
                    type="text" 
                    id="title" 
                    name="title" 
                    placeholder="Enter title here"
                    value={props.titleState}
                    maxLength={49}
                    onChange={handleTitleInputChange}
                    required>
                </input>
                <div className={styles.inputFieldWarning}>
                    { showTitleError ? <p>Title MUST be under 50 characters.</p> : null}
                </div>
                <label className={styles.formLabels} htmlFor="noteBody">Content:</label>
                <textarea className={styles.input}
                    maxLength={499}
                    id="noteBody"
                    name="noteBody"
                    placeholder="Enter note here"
                    value={props.bodyState}
                    rows={10}
                    cols={50}
                    onChange={handleBodyTextAreaChange}
                    required
                >
                </textarea>
                <div className={styles.inputFieldWarning}>
                    { showBodyError ? <p>Body MUST be under 500 characters.</p> : null}
                </div>
                </div>
            </form>
    )
}

export default NoteForm

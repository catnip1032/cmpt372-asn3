import { useState, useEffect } from 'react';
import NoteForm from './components/NoteForm';
import SavedNoteList from './components/SavedNotesList';
import styles from './App.module.css';
import { AxiosResponse } from "axios";
import {readAllNotes, createANote} from './noteApi'
import Note from './models/Note'

// App page for the note taking web application. Showcases the note form as well
// as the saved note list.

function App() {
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [displayWarning, setDisplayWarning] = useState(false);
  const [noteList, setNoteList] = useState<Note[]>([]);
  const [appStart, setAppStart] = useState(false);

  useEffect(() => {
    if (!appStart) {
      populateNoteListFromDB();
      setAppStart(true);
    }
  }, []);

  function clearNoteFields() {
    setNoteTitle("");
    setNoteBody("");
  }

  function handleOnTitleChange(changedNoteTitle: string) {
    setNoteTitle(changedNoteTitle);
  }

  function handleOnBodyChange(changedNoteBody: string) {
    setNoteBody(changedNoteBody);
  }

  function handleOnSavePressed() {
    if (noteTitle.trim() !== "" && noteBody.trim() !== "") {
      addNote(noteTitle, noteBody);
      clearNoteFields();
      setDisplayWarning(false);
    } else {
      setDisplayWarning(true);
    }
  }

  const populateNoteListFromDB = async () => {
    try {
      const response = await readAllNotes();
      if (response.status === 200) {
        setResponseNoteListToAppNoteList(response)
        return response;
      }else throw Error;
    } catch (error) {
      return error;
    }
  }

  function setResponseNoteListToAppNoteList(response: AxiosResponse<any, any>) {
    var responseData = response.data;
    var savedNotes = [];
    for (var index in responseData) {
      let note = responseData[index] as Note;
      savedNotes.push(note);
    }

    setNoteList(savedNotes)
  }

  const addNote = async (
  noteTitle: string, noteBody: string
  ) => {
    var myDate = new Date(Date.now())
    var createdOn = myDate.toLocaleString("en-US", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })
    let lastModified = createdOn;
    try {
      const response = await createANote(noteTitle, noteBody, createdOn, lastModified);
      if (response.status === 200) {
        let allNotes = response.data;
        setNoteList(allNotes);
        return response;
      }else throw Error;
    } catch (error) {
      return error;
    }
  };
 
  function onDeleteCallback(response: AxiosResponse<any, any>) {
    setResponseNoteListToAppNoteList(response);
  }

  function onUpdateCallback(response: AxiosResponse<any, any>) {
    setResponseNoteListToAppNoteList(response);
  }

  const noteFormProps = {
    titleState: noteTitle,
    bodyState: noteBody,
    onTitleChange: handleOnTitleChange,
    onBodyChange: handleOnBodyChange
  };

  const savedNoteProps = {
    savedNotes: noteList,
    onDeleteCallback: onDeleteCallback,
    onUpdateCallback: onUpdateCallback
  };

  return (
    <div className="App">
      <div className={styles.formAndNotesContainer}>
        <div className={styles.formCard}>
          <NoteForm {...noteFormProps}></NoteForm>
          <div className={styles.inputFieldWarning}>
            { displayWarning ? <p>Must have both a Title and some Content to save note.</p> : null}
          </div>
          <div className={styles.saveButtonContainer}>
            <button 
              className={styles.saveButton}
              onClick={handleOnSavePressed}
            >SAVE</button>
          </div>
        </div>
        <div className={styles.savedNoteListContainer}>
          <div className={styles.savedNotesLabel}>
            <label>Saved Notes:</label>
          </div>
          <SavedNoteList {...savedNoteProps}></SavedNoteList>
        </div>
      </div>
    </div>
  )
}

export default App;
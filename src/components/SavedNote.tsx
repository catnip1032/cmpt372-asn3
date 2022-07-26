// Handles the creation of a saved note title button as well as populates
// the modal that showcases the note.

import { useEffect, useState } from 'react';
import styles from '../components/SavedNote.module.css';
import React from 'react';
import ReactModal from 'react-modal';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import Save from '@mui/icons-material/SaveAs';
import Close from '@mui/icons-material/Close';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {deleteFromDataBase, readAllNotes, updateANote} from "../noteApi"
import { toast } from 'react-toastify';
import Note from '../models/Note'



interface SavedNoteProps{
    // savedNoteBody: string
    // savedNoteTitle: string
    savedNote: Note;
    onDeleteCallback: any;
    onUpdateCallback: any;
}

function SavedNote (props: SavedNoteProps){
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [noteIsEditable, setNoteIsEditable] = useState(false);
    const [displayWarning, setDisplayWarning] = useState(false)
    const [warningMessage, setWarningMessage] = useState("");
    var newTitle = "";
    var newBody = "";


    useEffect(() => {
        ReactModal.setAppElement('body');
    });



    const buttonStyles = {
        width: "fit-content",
        height: "fit-content"
    };

    const customStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };

    function onModalClose() {
      setModalIsOpen(false);
      setNoteIsEditable(false);
    };

    function handleOnButtonClick() {
        setModalIsOpen(true);
    };

    function handleEditButton() {
        if (!noteIsEditable) {
            setNoteIsEditable(true);
        } else {
            setNoteIsEditable(false);
        };
    };

    function handleTitleInputChange(event: any) {
        const element = event.currentTarget as HTMLInputElement;
        const value = element.value;
        newTitle = value;
    }
    
    function handleBodyTextAreaChange(event: any) {
        const element = event.currentTarget as HTMLInputElement;
        const value = element.value;
        newBody = value;
    }

    function getLastModified(lastModified: string) {
        var result = lastModified.replace("T", " ");
        result = result.replace("Z", "");
        let resultTokens = result.split(".");
        return resultTokens[0];
    }

    const handleSaveUpdateButton = async() => {
        let newTitleTrim = newTitle.trim();
        let newBodyTrim = newBody.trim();
        var myDate = new Date(Date.now())
        var lastModified = myDate.toLocaleString("en-US", {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
        if (newTitleTrim === "" && newBodyTrim === "") {
            setWarningMessage("Must update the Title or Content in order to save note.");
            setDisplayWarning(true);
        } else {
            setNoteIsEditable(false);
            setDisplayWarning(false);
            let titleChanged = newTitleTrim !== "" ? true : false;
            let bodyChanged = newBodyTrim !== "" ? true : false;
            var typeOfUpdate = "";
            if (titleChanged && bodyChanged) {
                typeOfUpdate = "titleAndBody";
            } else if (titleChanged && !bodyChanged) {
                typeOfUpdate = "title";
            } else {
                typeOfUpdate = "body";
            }
            try {
                var response = await updateANote(newTitle.trim(), newBody.trim(), props.savedNote.note_id, typeOfUpdate, lastModified)
                if (response.status === 200 ) {
                    var noteResponse = await readAllNotes();
                    props.onUpdateCallback(noteResponse);
                    setNoteIsEditable(false);
                    onModalClose();
                }
            }
            catch(error) {
                console.error(error);
            }

        }
    };

    const handleDeleteButton = async () => {
        onModalClose();
        var response = await deleteFromDataBase(props.savedNote.note_id);
        if (response.status === 200 ) {
            var noteResponse = await readAllNotes();
            props.onDeleteCallback(noteResponse);
            toast('Note deleted!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        } else {
            toast('Delete failed, try again.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        }
    };


    function NoteType() {
        if (noteIsEditable) {
            return (
            <div>
                <Row>
                    <Col>
                        <input className={styles.input}
                        type="text" 
                        id="title" 
                        name="title" 
                        placeholder={props.savedNote.title}
                        maxLength={49}
                        onChange={handleTitleInputChange}
                        required>
                        </input>
                    </Col>
                    <Col>
                        <textarea className={styles.input}
                        id="noteBody"
                        name="noteBody"
                        placeholder={props.savedNote.body}
                        rows={10}
                        cols={50}
                        maxLength={600}
                        onChange={handleBodyTextAreaChange}
                        required
                        >
                        </textarea>
                    </Col>
                </Row>
        </div>);
        }  
        return (<div>
            {/* Tite */}
            <label>{props.savedNote.title}
            </label>
            {/* Body */}
            <p className={styles.p}>{props.savedNote.body}</p>
        
            </div>);
    }

    return (
        <div>
            <button
                className={styles.noteTitleButton}
                onClick={handleOnButtonClick}
                style={buttonStyles}
            >{props.savedNote.title}</button>

            <ReactModal
                isOpen={modalIsOpen}
                onRequestClose={onModalClose}
                style={customStyles}
                contentLabel={props.savedNote.title}
            >
            <div
                className={styles.reactModalStyle}>
                    <div>
                        <IconButton
                        className={styles.iconButtonsStyle}
                        onClick={onModalClose}
                        >
                            <Close className={styles.editButton}/>
                        </IconButton>
                        <IconButton
                        className={styles.iconButtonsStyle}
                        onClick={handleEditButton}
                        >
                            <Edit className={styles.editButton}/>
                        </IconButton>     
                    </div>
                    <div>
                    <NoteType></NoteType>
                </div>
                <div className={styles.bottomButtonsContainer}>
                    <p>Last modified: {getLastModified(props.savedNote.last_modified)}</p>
                    <IconButton
                    className={styles.iconButtonsStyle}
                     style={{
                        visibility: noteIsEditable ? 'visible' : 'hidden'
                    }}                   
                    onClick={handleDeleteButton}
                    >
                        <Delete/>
                    </IconButton>
                    <IconButton
                    className={styles.iconButtonsStyle}
                    style={{
                        visibility: noteIsEditable ? 'visible' : 'hidden'
                    }}
                    onClick={handleSaveUpdateButton}
                    >
                        <Save/>
                    </IconButton>
                </div>
            </div>
            <div className={styles.inputFieldWarning}>
            { displayWarning ? <p>{warningMessage}</p> : null}
            </div>
            </ReactModal>
        </div>
    );
}

export default SavedNote;

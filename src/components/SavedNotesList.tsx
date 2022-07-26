// The saved notes list components contains all the saved notes in an unordered list.

import { useEffect, useState } from 'react';
import SavedNote from './SavedNote';
import Note from '../models/Note';

interface AddSavedNoteProps {
    savedNotes: Note[];
    onDeleteCallback: any;
    onUpdateCallback: any;
}

function SavedNotesList (props: AddSavedNoteProps){
    var updatedList = [] as any[]
    const savedNotes = props.savedNotes
    
    const [isSSR, setIsSSR] = useState(true);

    // Counters hydration failure if initial UI does not match server rendered UI
    // Fix found here: https://github.com/vercel/next.js/discussions/35773?sort=top#discussioncomment-2485078
    useEffect(() => {
      setIsSSR(false);
    }, []);

    if (!isSSR){
      if (savedNotes.length !== 0){   
        updatedList = savedNotes.map((savedNote, index) => (
            <li key={index}>{
              <SavedNote 
                savedNote={savedNote}
                onDeleteCallback={props.onDeleteCallback}
                onUpdateCallback={props.onUpdateCallback}
              ></SavedNote>
              }
            </li>
          ))
    }
    return (
      <ul>{updatedList}</ul>
    )
    }
return(<ul></ul>)
}

export default SavedNotesList

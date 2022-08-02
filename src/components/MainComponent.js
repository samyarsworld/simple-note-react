import React from "react";
import Sidebar from "./SidebarComponent";
import Editor from "./EditorComponent";
import { data } from "../shared/data";
import Split from "react-split";
import { nanoid } from "nanoid";

export default function App() {
    // Here if "notes" don't exist, it will return null, also we shouldn't use
    // null as the state, hence use or ||.
    const [notes, setNotes] = React.useState(() => JSON.parse(localStorage.getItem("notes")) || [])
    const [currentNoteId, setCurrentNoteId] = React.useState(() => (
        (notes[0] && notes[0].id) || "")
    )

    // Use useEffect as accessing localStorage is a foreign request
    // This will store your data as note json file in the local file of the
    // browser
    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes))
    }, [notes])


    function createNewNote() {
        const newNote = {
            // nadoid is a fast id creator
            id: nanoid(),
            body: "# Type your markdown note's title here"
        };
        setNotes(prevNotes => [newNote, ...prevNotes]);
        setCurrentNoteId(newNote.id);
    }

    function updateNote(text) {
        // Rearranges the most recent chanegd note to be on the top
        setNotes(oldNotes => {
            const newNotes = []
            for (let i = 0; i < oldNotes.length; i++) {
                if (oldNotes[i].id === currentNoteId) {
                    newNotes.unshift({ ...oldNotes[i], body: text })
                } else {
                    newNotes.push(oldNotes[i])
                }
            }
            return newNotes;
        });

        // If you don't want to change the index of notes use map:
        // setNotes(oldNotes => oldNotes.map(oldNote => {
        //     return oldNote.id === currentNoteId
        //         ? { ...oldNote, body: text }
        //         : oldNote
        // }));
    }


    function deleteNote(event, noteId) {
        // Avoid a bug that the code tries to select the deleted note right after it is deleted
        event.stopPropagation()

        setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
    }


    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }

    return (
        <main>
            {notes.length > 0
                ?
                <Split sizes={[30, 70]}
                    direction="horizontal"
                    className="split">

                    <Sidebar notes={notes}
                        currentNote={findCurrentNote()}
                        setCurrentNoteId={setCurrentNoteId}
                        newNote={createNewNote}
                        deleteNote={deleteNote} />

                    {currentNoteId && notes.length > 0 &&
                        <Editor currentNote={findCurrentNote()}
                            updateNote={updateNote} />
                    }
                </Split>

                :
                <div className="no-notes">
                    <h1>You have no notes</h1>
                    <button
                        className="first-note"
                        onClick={createNewNote}>
                        Create one now
                    </button>
                </div>
            }
        </main>
    )
}

import { createNote, deleteNote, getAllNotes, getNoteById, updateNote } from "../services/note.js"

export const createNoteController = async (req, res) => {
  const { message, ticketId, userId } = req.body
  const newNote = await createNote(message, ticketId, userId)
  res.json(newNote)
}
export const updateNoteController = async (req, res) => {
  const { id } = req.params
  const { message, ticketId, userId } = req.body

  const noteUpdate = await updateNote(id, message, ticketId, userId)
  res.json(noteUpdate)
}
export const deleteNoteController = async (req, res) => {
  const { id } = req.params

  const noteDeleted = await deleteNote(id)
  res.json(noteDeleted)
}

export const getAllNotesController = async (req, res) => {
  const notes = await getAllNotes()
  res.json(notes)
}
export const getNoteByIdController = async (req, res) => {
  const { id } = req.params
  const note = await getNoteById(id)
  res.json(note)
}
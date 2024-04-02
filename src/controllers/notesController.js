import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  updateNote
} from "../services/note.js"

export const createNoteController = async (req, res) => {
  const { note, ticketId, userId } = req.body
  const { id } = req.params
  const newNote = await createNote(note, ticketId, userId, id)
  res.json(newNote)
}
export const updateNoteController = async (req, res) => {
  const { id } = req.params
  const { note, ticketId, userId } = req.body

  const noteUpdate = await updateNote(id, note, ticketId, userId)
  res.json(noteUpdate)
}
export const deleteNoteController = async (req, res) => {
  const { id } = req.params
  const { idBody } = req.body
  const noteDeleted = await deleteNote(id, idBody)
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
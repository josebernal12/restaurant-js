import noteModel from "../model/NotesModel.js"
import tableModel from "../model/TableModel.js"

export const createNote = async (note, ticketId, userId, tableId) => {
  try {
    ticke
    const newNote = await noteModel.create({ note, ticketId, userId, tableId })
    if (!newNote) {
      return {
        msg: 'error al crear la nota'
      }
    }
    return newNote
  } catch (error) {
    console.log(error)
  }
}

export const updateNote = async (id, note, ticketId, userId) => {
  try {
    const noteUpdate = await noteModel.findByIdAndUpdate(id, { note, ticketId, userId }, { new: true })
    if (!noteUpdate) {
      return {
        msg: 'no existe nota con ese id'
      }
    }
    return noteUpdate
  } catch (error) {
    console.log(error)
  }
}


export const deleteNote = async (id, idBody) => {
  try {
    if (idBody) {
      const notes = await noteModel.findById(id)
      const noteUpdate = notes.note.filter(value => value._id.toString() !== idBody)
      notes.note = noteUpdate
      notes.save()
      return notes
    }
    const noteDeleted = await noteModel.findByIdAndDelete(id, { new: true })
    if (!noteDeleted) {
      return {
        msg: 'no hay id con esa nota'
      }
    }
    return noteDeleted
  } catch (error) {
    console.log(error)
  }
}

export const getAllNotes = async () => {
  try {
    const notes = await noteModel.find()
    if (!notes) {
      return {
        msg: 'no hay notas'
      }
    }
    return notes
  } catch (error) {
    console.log(error)
  }
}

export const getNoteById = async (id) => {
  try {
    const note = await noteModel.findById(id)
    if (!note) {
      return {
        msg: 'no hay nota con ese id'
      }
    }
    return note
  } catch (error) {
    console.log(error)
  }
}
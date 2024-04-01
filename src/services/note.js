import noteModel from "../model/NotesModel.js"

export const createNote = async (message, ticketId, userId) => {
  try {
    const newNote = await noteModel.create({ message, ticketId, userId })
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

export const updateNote = async (id, message, ticketId, userId) => {
  try {
    const noteUpdate = await noteModel.findByIdAndUpdate(id, { message, ticketId, userId }, { new: true })
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


export const deleteNote = async (id) => {
  try {
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
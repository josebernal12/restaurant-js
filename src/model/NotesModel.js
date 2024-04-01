import mongoose, { Schema } from 'mongoose'

const notesSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ticket'
  },
})

const noteModel = mongoose.model('note', notesSchema)

export default noteModel
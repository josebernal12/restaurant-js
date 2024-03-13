import mongoose from 'mongoose'
const { Schema } = mongoose

const bookSchema = new Schema({
  name: {
    type: String,
    require: true
  },
}, {
    timestamps: true
})

const bookModel = mongoose.model('Book', bookSchema)
export default bookModel 
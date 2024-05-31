import mongoose from 'mongoose'

const { Schema } = mongoose

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  idFather: {
    type: String,
    default: null
  }

}, {
  timestamps: true
})
const categoryModel = mongoose.model('category', categorySchema)
export default categoryModel

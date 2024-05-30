import mongoose from 'mongoose'

const { Schema } = mongoose

const categorySchema = new Schema({
  name: {
    type: String
  },
  description: {
    type: String,
  },
  color: {
    type: String,
  },

}, {
  timestamps: true
})
const categoryModel = mongoose.model('category', categorySchema)
export default categoryModel

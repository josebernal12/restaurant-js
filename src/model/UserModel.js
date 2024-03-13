import mongoose from 'mongoose'
const { Schema } = mongoose

const userSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
}, {
    timestamps: true
})

const userModel = mongoose.model('User', userSchema)
export default userModel 
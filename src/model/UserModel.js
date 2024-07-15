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
  havePassword: {
    type: Boolean,
    default: true
  },
  rol: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rol',
  },
  token: {
    type: String,
    default: null
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  haveCompany: {
    type: Boolean,
    trim: true,
    default: false
  }
}, {
  timestamps: true
})

const userModel = mongoose.model('User', userSchema)
export default userModel 
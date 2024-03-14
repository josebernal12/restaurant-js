// RolModel.js
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
const { Schema } = mongoose;

const permissionsSchema = new Schema({
  eliminarUsuario: { type: Boolean, default: false },
  agregarUsuario: { type: Boolean, default: false },
  actualizarUsuario: { type: Boolean, default: false }
});

const RolSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  permissions: {
    type: permissionsSchema,
    default: {
      eliminarUsuario: false,
      agregarUsuario: false,
      actualizarUsuario: false
    }
  }
});

const RolModel =  mongoose.models.Rol || mongoose.model('Rol', RolSchema);

export default RolModel;

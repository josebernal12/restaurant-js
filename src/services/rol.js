import RolModel from '../model/RolModel.js'
import userModel from '../model/UserModel.js'

export const createRol = async (name, permissions) => {
  try {
    if (!name || !permissions) {
      return {
        msg: 'todos los campos son obligatorios'
      }
    }
    const newRol = await RolModel.create({ name, permissions })
    if (!newRol) {
      return 'error a la creacion del rol'
    }
    return newRol
  } catch (error) {
    console.log(error)
  }
}

export const getRol = async () => {
  try {
    const rols = await RolModel.find()
    if (!rols) {
      return {
        rols: []
      }
    }
    return rols
  } catch (error) {
    console.log(error)
  }
}

export const updateRol = async (id, name, permissions) => {
  try {
    if (!id || !name || !permissions) {
      return {
        msg: 'todos los campos son obligatorios'
      }
    }
    const rol = await RolModel.findByIdAndUpdate(id, { name, permissions }, { new: true })
    if (!rol) {
      return {
        msg: 'error al actualizar'
      }
    }
    return rol
  } catch (error) {
    console.log(error)
  }
}


export const deleteRol = async (id) => {
  try {
    if (!id) {
      return {
        msg: 'error al mandar el id'
      }
    }
    const rol = await RolModel.findByIdAndDelete(id)
    const users = await userModel.find({ rol: id })
    if (users) {
      const userRol = await RolModel.findOne({ name: 'miembro' });
      console.log(userRol)
      users.forEach(user => {
        user.rol = userRol._id;
        user.save()
      })
      
    }
    if (!rol) {
      return {
        msg: 'error al eliminar'
      }
    }
    return rol
  } catch (error) {
    console.log(error)
  }
}
import { checkEmailInDB } from "../helpers/validate.js"
import userModel from "../model/UserModel.js"

export const getUsers = async (name) => {
  try {
    const users = await userModel.find(name).populate('rol')
    if (!users) {
      return 'no hay usuarios'
    }
    return users
  } catch (error) {
    console.log(error)
  }
}
export const getUserById = async (id) => {
  try {
    const user = await userModel.findById(id)
    if (!user) {
      return 'no hay nigun usuario para ese id'
    }
    return user
  } catch (error) {
    console.log(error)
  }
}
export const deleteUser = async (id) => {
  try {
    const user = await userModel.findByIdAndDelete(id)
    if (!user) {
      return 'no hay ningun usuario con ese id'
    }
    return 'usuario eliminado'
  } catch (error) {
    console.log(error)
  }
}
export const updateUser = async (id, name, lastName, email, rolId) => {
  try {
    const exist = await checkEmailInDB(email)
    console.log(exist)
    if (exist === null) {
      const userUpdate = await userModel.findByIdAndUpdate(id, { name, lastName, email, rol: rolId }, { new: true })
      if (!userUpdate) {
        return 'error en la actualizacion'
      }
      return userUpdate
    }
    return 'el email ya existe en la base de datos'

  } catch (error) {
    console.log(error)
  }
}

export const searchUser = async (name) => {
  try {
    const user = await userModel.find({ name: { $regex: new RegExp(name, 'i') } })
    if (!user) {
      return {
        msg: 'no hay usuarios con ese nombre'
      }
    }
    return user
  } catch (error) {
    console.log(error)
  }
}


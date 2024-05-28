import RolModel from '../model/RolModel.js'

export const createRol = async (name, permissions) => {
  try {
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
import RolModel from '../model/RolModel'

export const createRol = async (name, permissions) => {
  try {
    const newRol = await RolModel.create({ name, permissions })
    if(!newRol) {
      return 'error a la creacion del rol'
    }
    return newRol
  } catch (error) {
    console.log(error)
  }
}
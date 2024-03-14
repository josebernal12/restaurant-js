import rolModel from "../model/rolModel.js"

export const createRol = async (name, permissions) => {
  try {
    const newRol = await rolModel.create({ name, permissions })
    if(!newRol) {
      return 'error a la creacion del rol'
    }
    return newRol
  } catch (error) {
    console.log(error)
  }
}
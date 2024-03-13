import User from "../model/UserModel.js"

export const addUser = () => {
  try {

  } catch (error) {
    console.log(error)
  }
}

export const getUsers = async () => {
  try {
    const users = await User.findAll()
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
    const user = await User.findByPk(id)
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
    const user = await User.destroy({
      where: { id }
    });
    if (!user) {
      return 'no hay ningun usuario con ese id'
    }
    return 'usuario eliminado'
  } catch (error) {
    console.log(error)
  }
}
export const updateUser = async (id, name, lastName, email) => {
  try {
    const userUpdate = await User.update(
      { name, lastName, email },
      {
        where: {
          id
        },
        returning: true // Agregar la propiedad returning

      }
    );
    if (userUpdate.includes(0)) {
      return 'error en la actualizacion'
    }
    const user = await User.findByPk(id)

    return user
  } catch (error) {
    console.log(error)
  }
}
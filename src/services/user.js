import { checkEmailInDB } from "../helpers/validate.js"
import userModel from "../model/UserModel.js"
import RolModel from '../model/RolModel.js'
export const getUsers = async (query, page, showAll, quantity) => {
  const perPage = 10;
  const pageQuery = parseInt(page) || 1;
  const skip = perPage * (pageQuery - 1);
  try {
    if (showAll === "1") {
      const usersTotal = await userModel.countDocuments()
      const users = await userModel.find().populate('rol')
      return {
        usersTotal,
        users
      }
    }
    if (quantity) {
      const usersTotal = await userModel.countDocuments()
      const users = await userModel.find().limit(quantity).populate('rol')
      return {
        usersTotal,
        users
      }
    }
    if (query.rol) {
      const rol = await RolModel.findOne({ name: query.rol });
      if (!rol) {
        return {
          users: []
        };
      }
      const usersTotal = await userModel.countDocuments()
      const users = await userModel.find({ rol: rol._id }).limit(perPage).skip(skip).populate('rol').exec();
      if (!users || users.length === 0) {
        return {
          users: []
        };
      }
      return {
        users,
        usersTotal
      };
    }
    const usersTotal = await userModel.countDocuments()
    const users = await userModel.find(query).limit(perPage)
      .skip(skip)
      .populate('rol')
      .exec();;
    if (!users || users.length === 0) {
      return {
        users: []
      };
    }
    if (users.length === 0) {
      return {
        users: []
      }
    }
    return {
      users,
      usersTotal
    };
  } catch (error) {
    console.log(error);
    throw error; // Propagar el error para que sea manejado en el controlador
  }
}

export const getUserById = async (id) => {
  try {
    const user = await userModel.findById(id).populate('rol').select('-password')
    if (!user) {
      return {
        msg: 'no hay nigun usuario para ese id'
      }
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
      return {
        msg: 'no hay ningun usuario con ese id'
      }
    }
    return 'usuario eliminado'
  } catch (error) {
    console.log(error)
  }
}
export const updateUser = async (id, name, lastName, email, rolId) => {
  try {
    const user = await userModel.findById(id)
    if (user.email === email) {
      const userUpdate = await userModel.findByIdAndUpdate(id, { name, lastName, email, rol: rolId }, { new: true })
      if (!userUpdate) {
        return {
          msg: 'error en la actualizacion'
        }
      }
      return userUpdate

    }
    const exist = await checkEmailInDB(email)
    if (exist === null) {
      const userUpdate = await userModel.findByIdAndUpdate(id, { name, lastName, email, rol: rolId }, { new: true })
      if (!userUpdate) {
        return {
          msg: 'error en la actualizacion'
        }
      }
      return userUpdate
    }
    return {
      msg: 'el email ya existe en la base de datos'
    }

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





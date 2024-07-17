import { checkEmailInDB } from "../helpers/validate.js"
import userModel from "../model/UserModel.js"
import RolModel from '../model/RolModel.js'
import jwt from 'jsonwebtoken'
export const getUsers = async (query, page, showAll, quantity, companyId) => {
  const perPage = 10;
  const pageQuery = parseInt(page) || 1;
  const skip = perPage * (pageQuery - 1);
  try {
    if (showAll === "1") {
      const usersTotal = await userModel.countDocuments({ companyId })
      const users = await userModel.find({ companyId }).populate('rol').select('-password')
      return {
        usersTotal,
        users
      }
    }
    if (quantity) {
      const usersTotal = await userModel.countDocuments({ companyId })
      const users = await userModel.find({ ...query, companyId }).limit(quantity).skip(skip).populate('rol').select('-password')
      return {
        usersTotal,
        users
      }
    }
    if (query.rol) {
      const rol = await RolModel.findOne({ name: query.rol, companyId });
      if (!rol) {
        return {
          users: []
        };
      }
      const usersTotal = await userModel.countDocuments({ companyId })
      const users = await userModel.find({ rol: rol._id, companyId }).limit(perPage).skip(skip).populate('rol').select('-password').exec();
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
    const usersTotal = await userModel.countDocuments({ companyId });
    const users = await userModel.find({ ...query, companyId }).limit(perPage).select('-password')
      .skip(skip)
      .populate('rol')
      .exec();

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
    const usersTotal = await userModel.countDocuments()

    if (!user) {
      return {
        msg: 'no hay ningun usuario con ese id'
      }
    }
    return usersTotal
  } catch (error) {
    console.log(error)
  }
}
export const updateUser = async (id, name, lastName, email, rol, companyId) => {
  try {

    if (!name || !lastName || !email) {
      return {
        msg: 'todos los campos son necesarios'
      }
    }
    const user = await userModel.findById(id)


    if (user.email === email) {
      const userUpdate = await userModel.findByIdAndUpdate(id, { name, lastName, email, rol, companyId }, { new: true })
      if (!userUpdate) {
        return {
          msg: 'error en la actualizacion'
        }
      }
      return userUpdate

    }
    const exist = await checkEmailInDB(email)
    if (exist === null) {
      const userUpdate = await userModel.findByIdAndUpdate(id, { name, lastName, email, rol }, { new: true })
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

export const createUser = async (name, apellido, email, password, confirmPassword, companyId) => {
  try {
    if (password !== confirmPassword) {
      return {
        msg: 'los password no coiciden'
      }
    }
    if (!name || !apellido || !email) {
      return {
        msg: 'todos los campos son necesarios'
      }
    }
    const user = await (await userModel.create({ name, apellido, email, password, companyId })).populate('rol')
    user.haveCompany = true
    await user.save()
    if (!user) {
      return {
        msg: 'error al crear el usuario'
      }
    }
    if (!rol) {
      const rolMember = await RolModel.findOne({ name: 'miembro', companyId });
      const user = (await userModel.create({ name, lastName, email, password: hash, rol: rolMember, companyId })).populate('rol');

      user.haveCompany = true
      await user.save()
      const token = generateToken(user.id)
      return {
        user,
        token
      }
    }
    const userWithoutPassword = {
      ...user.toObject(), // Convertir el objeto Mongoose a un objeto plano
      password: undefined // Opcionalmente puedes utilizar null o eliminar esta línea si prefieres no incluir el campo
    };
    return userWithoutPassword
  } catch (error) {
    console.log(error)
  }
}

export const deleteManyUsers = async (ids) => {
  try {
    ids.forEach(async (id) => {
      const user = await userModel.findByIdAndDelete(id, { new: true })
      const usersTotal = await userModel.countDocuments()

      if (!user) {
        console.log(user)
        return {
          msg: 'error al eliminar el usuario'
        }
      }
      return {
        user,
        usersTotal
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export const manyUser = async (users) => {
  try {
    const usersArray = [];
    let usersTotal;
    if (!users.rol) {
      const rolMember = await RolModel.findOne({ name: 'miembro' });
      for (const value of users) {
        const exist = await checkEmailInDB(value.email)
        if (!exist) {
          const user = await userModel.create({ name: value.name, lastName: value.lastName, email: value.email, rol: rolMember, havePassword: false, companyId: value.companyId })
          const populatedUser = await userModel.findById(value._id).populate('rol').select('-password');
          usersTotal = await userModel.countDocuments()
          user.haveCompany = true
          await user.save()
          if (!user) {
            return { user: [] };
          }
          usersArray.push(user);
        }
      }
      return { usersArray, usersTotal };

    }
    for (const value of users) {
      const exist = await checkEmailInDB(value.email)
      if (!exist) {
        const user = await userModel.create(value);
        user.haveCompany = true
        await user.save()
        if (!user) {
          return { user: [] };
        }
        usersArray.push(user);
      }

    }
    return usersArray;
  } catch (error) {
    console.log(error);
    throw error; // Puedes elegir manejar el error aquí o dejarlo para que lo maneje el controlador.
  }
};

export const usersWithoutPassword = async () => {
  try {
    const users = await userModel.find();
    const usersWithoutPwd = users.filter(value => !value.password);
    return usersWithoutPwd.map(value => ({
      msg: `El usuario ${value.name} no tiene contraseña`
    }));
  } catch (error) {
    console.log(error);
    throw error;
  }
};


export const tokenIsValid = (token) => {
  try {
    if (!token) {
      return false
    }
    const decoded = jwt.verify(token, process.env.KEYSECRET);

    if (decoded.id) {
      return true
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

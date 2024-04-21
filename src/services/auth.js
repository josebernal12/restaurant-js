import generateToken from "../helpers/generateToken.js";
import { checkEmailInDB } from "../helpers/validate.js";
import userModel from "../model/UserModel.js";
import RolModel from '../model/RolModel.js';
import bcrypt from 'bcrypt'
import { uid } from 'uid'
export const register = async (name, lastName, email, password, confirmPassword, rol) => {
  const saltRounds = 10;

  try {
    const user = await checkEmailInDB(email)
    if (!user) {
      if (confirmPassword !== password) {
        return {
          msg: 'Los passwords no coinciden'
        };
      } else {
        const saltRound = bcrypt.genSaltSync(saltRounds)
        const hash = bcrypt.hashSync(password, saltRound)
        if (!rol) {
          const rolMember = await RolModel.findOne({ name: 'miembro' });
          const user = (await userModel.create({ name, lastName, email, password: hash, rol: rolMember })).populate('rol')
          const token = generateToken(user.id)
          return {
            user,
            token
          }
        }
        const user = (await userModel.create({ name, lastName, email, password: hash, rol })).populate('rol')
        const token = generateToken(user.id)
        return {
          user,
          token
        }
      }
    } else {
      return {
        msg: 'el email ya existe'
      }
    }

  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const user = await checkEmailInDB(email)

    if (!user) {
      console.log('entree-1')
      return 'email o password no son correctos'
    }
    console.log('entree')
    console.log(user)
    const match = await bcrypt.compare(password, user.password)
    if (match) {
      const token = generateToken(user.id)
      const userLogin = { user, token }
      return userLogin
    } else {
      return 'email o password no son correctos'
    }
  } catch (error) {
    console.log(error)
  }
}


export const restorePassword = async (email) => {
  try {
    const exist = await checkEmailInDB(email)
    if (!exist) {
      return {
        msg: 'el email no existe en la DB'
      }
    }
    exist.token = uid(16)
    exist.save()
    return exist
  } catch (error) {
    console.log(error)
  }
}

export const checkTokenEmail = async (token) => {
  try {
    const user = await userModel.findOne({ token })
    if (!user) {
      return {
        msg: 'token no valido'
      }
    }
    return user
  } catch (error) {
    console.log(error)
  }
}

export const changePassword = async (password, passwordRepit, token) => {
  try {
    const saltRounds = 10;
    if (password !== passwordRepit) {
      return {
        msg: 'los password no son iguales'
      }
    }
    const user = await userModel.findOne({ token })
    if (!user) {
      return {
        msg: 'el token no es valido'
      }
    }
    const saltRound = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(password, saltRound)
    user.password = hash
    user.token = null
    user.save()
    return user
  } catch (error) {
    console.log(error)
  }
}

export const authEmail = (token, user) => {
  try {
    
  } catch (error) {
    console.log(error)
  }
}
import generateToken from "../helpers/generateToken.js";
import { checkEmailInDB } from "../helpers/validate.js";
import userModel from "../model/UserModel.js";
import RolModel from '../model/RolModel.js';
import bcrypt from 'bcrypt'
import { sendEmail } from "../helpers/email.js";
export const register = async (name, lastName, email, password, confirmPassword, rol) => {
  const saltRounds = 10;

  try {
    const user = await checkEmailInDB(email)
    if (!user) {
      if (confirmPassword !== password) {
        return 'Los passwords no coinciden';
      } else {
        const saltRound = bcrypt.genSaltSync(saltRounds)
        const hash = bcrypt.hashSync(password, saltRound)
        if (!rol) {
          const rolMember = await RolModel.findOne({ name: 'miembro' });
          const user = await userModel.create({ name, lastName, email, password: hash, rol: rolMember })
          const token = generateToken(user.id)
          return {
            user,
            token
          }
        }
        const user = await userModel.create({ name, lastName, email, password: hash, rol })
        const token = generateToken(user.id)
        return {
          user,
          token
        }
      }
    } else {
      return 'el email ya existe'
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


export const restorePassword = async (email, subject, text) => {
  try {
    // const exist = await checkEmailInDB(email)
    // if(!exist) {
    //   return {
    //     msg : 'el email no existe en la DB'
    //   }
    // }
    sendEmail(email, subject, text)
  } catch (error) {
    console.log(error)
  }
}
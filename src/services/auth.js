import generateToken from "../helpers/generateToken.js";
import { checkEmailInDB } from "../helpers/validate.js";
import userModel from "../model/UserModel.js";
import bcrypt from 'bcrypt'
export const register = async (name, lastName, email, password, confirmPassword) => {
  const saltRounds = 10;

  try {
    const user = await checkEmailInDB(email)
    if (!user) {
      if (confirmPassword !== password) {
        return 'Los passwords no coinciden';
      } else {
        // Devuelve una promesa que resuelve con el nuevo usuario
        const saltRound = bcrypt.genSaltSync(saltRounds)
        const hash = bcrypt.hashSync(password, saltRound)
        const user = await userModel.create({ name, lastName, email, password: hash })
        const token = await generateToken(user.id)
        return {
          user,
          token
        }
      }
    }else {
      return  'el email ya existe'
    }

  } catch (error) {
    console.log(error);
    throw error; // Asegúrate de propagar el error para que sea manejado correctamente fuera de esta función
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
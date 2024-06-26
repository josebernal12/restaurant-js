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
          const newUser = await userModel.create({ name, lastName, email, password: hash, rol: rolMember });
          const populatedUser = await userModel.findById(newUser._id).populate('rol').select('-password');
          const token = generateToken(newUser.id);
          return {
            user: populatedUser,
            token
          };
        }
        const newUser = await userModel.create({ name, lastName, email, password: hash, rol });
        const userId = await userModel.findById(newUser._id).populate('rol').select('-password');
        const token = generateToken(userId.id);
        return {
          user: userId,
          token
        };

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
    const user = await checkEmailInDB(email);

    if (!user) {
      return 'email o password no son correctos';
    }

    const match = await bcrypt.compare(password, user.password);
    console.log(match);
    if (match) {
      // Crear un nuevo objeto user sin la contraseña
      const userWithoutPassword = {
        ...user.toObject(), // Convertir el objeto Mongoose a un objeto plano
        password: undefined // Opcionalmente puedes utilizar null o eliminar esta línea si prefieres no incluir el campo
      };

      const token = generateToken(user._id); // Supongo que el ID del usuario es user._id
      const userLogin = { user: userWithoutPassword, token }; // Construir el objeto userLogin
      return userLogin;
    } else {
      return 'email o password no son correctos';
    }
  } catch (error) {
    console.log(error);
  }
};


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
    user.havePassword = true
    user.save()
    return user
  } catch (error) {
    console.log(error)
  }
}

export const authGoogle = async (user) => {
  try {
    if (!user.rol) {
      const rolMember = await RolModel.findOne({ name: 'miembro' });
      const newUser = await (await userModel.create({ name: user.name, lastName: user.lastName, email: user.email, rol: rolMember._id })).populate('rol')
      const token = generateToken(newUser.id)

      return {
        user: newUser,
        token
      }
    }
    const newUser = await userModel.create(user)
    if (!newUser) {
      return {
        msg: 'error al crear el usuario'
      }
    }
    const token = generateToken(newUser.id)

    return { user: newUser, token }
  } catch (error) {
    console.log(error)
  }
}
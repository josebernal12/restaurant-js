import jwt from 'jsonwebtoken'
import RolModel from '../model/RolModel.js';
import userModel from '../model/UserModel.js';

const checkJwt = async (req, res, next) => {
  let token = "";
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.KEYSECRET || 'defaultSecret')
      const user = await userModel.findById(decoded.id)
      return user
    } catch (error) {
      console.log('error')
    }
  }
  if (!token) {
    console.log('tokeen')
    const error = new Error('Token no valid')
    return res.status(401).json({ msg: error.message })
  }
  next()
}
export const addUserPermission = async (req, res, next) => {
  const user = await checkJwt(req, res, next)
  if (user) {
    const rol = await RolModel.findById(user.rol)
    if (rol.permissions.agregarUsuario) {
      req.user = user
      return next()
    } else {
      return res.status(401).json({ msg: 'no tienes permisos para estas operaciones' })
    }
  }
}
export const updateUserPermission = async (req, res, next) => {
  const user = await checkJwt(req, res, next)
  if (user) {
    const rol = await RolModel.findById(user.rol)
    if (rol.permissions.actualizarUsuario) {
      req.user = user
      return next()
    } else {
      return res.status(401).json({ msg: 'no tienes permisos para estas operaciones' })
    }
  }
}
export const deleteUserPermission = async (req, res, next) => {
  const user = await checkJwt(req, res, next)
  if (user) {
    const rol = await RolModel.findById(user.rol)
    if (rol.permissions.eliminarUsuario) {
      req.user = user
      return next()
    } else {
      return res.status(401).json({ msg: 'no tienes permisos para estas operaciones' })
    }
  }
}
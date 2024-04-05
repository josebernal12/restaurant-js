import generateToken from "../helpers/generateToken.js";
import { deleteUser, getUserById, getUsers, searchUser, updateUser } from "../services/user.js";
export const getUsersController = async (req, res) => {

  const query = {}; // Inicializar el objeto de consulta
  let page;
  let showAll;
  let quantity;
  if (req.query.name) {
    query.name = { $regex: req.query.name, $options: 'i' }; // 'i' para hacer la búsqueda case-insensitive
  }
  if (req.query.rol) {
    query.rol = { $regex: req.query.rol, $options: 'i' }; // 'i' para hacer la búsqueda case-insensitive
  }
  if (req.query.email) {
    query.email = { $regex: req.query.email, $options: 'i' }; // 'i' para hacer la búsqueda case-insensitive
  }
  if (req.query.lastName) {
    query.lastName = { $regex: req.query.lastName, $options: 'i' }; // 'i' para hacer la búsqueda case-insensitive
  }
  if (req.query.page) {
    page = req.query.page
  }
  if (req.query.showAll) {
    showAll = req.query.showAll
  }
  if (req.query.quantity) {
    quantity = req.query.quantity
  }
  const users = await getUsers(query, page, showAll, quantity)
  res.json(users)
}

export const getUserByIdController = async (req, res) => {
  const { id } = req.params
  const users = await getUserById(id)
  res.json(users)
}

export const deleteUserController = async (req, res) => {
  const { id } = req.params
  const message = await deleteUser(id)
  res.json(message)
}

export const updateUserController = async (req, res) => {
  const { name, lastName, email, rolId } = req.body
  const { id } = req.params

  const user = await updateUser(id, name, lastName, email, rolId)
  res.json(user)
}

export const renewToken = (req, res) => {
  const { id } = req.params
  const token = generateToken(id)
  res.json(token)
}

export const userSearchController = async (req, res) => {
  const { name } = req.body
  const user = await searchUser(name)
  res.json(user)
}

export const logoutController = async (req, res) => {
  req.user = null
  const token = req.headers.authorization.split(' ')[1];
  res.json('logout exitoso')
}

export const obtainUserByToken = async (req, res) => {
  res.json(req.user)
}
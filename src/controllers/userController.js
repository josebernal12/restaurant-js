import generateToken from "../helpers/generateToken.js";
import { deleteUser, getUserById, getUsers, searchUser, updateUser } from "../services/user.js";

export const getUsersController = async (req, res) => {

  const query = {}; // Inicializar el objeto de consulta

  if (req.query.name) {
    query.name = { $regex: req.query.name, $options: 'i' }; // 'i' para hacer la búsqueda case-insensitive
  }   
   // if (req.query.age) query.age = req.query.age;
  // if (req.query.role) query.role = req.query.role;
  const users = await getUsers(query)
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
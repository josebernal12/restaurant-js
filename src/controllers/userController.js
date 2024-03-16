import generateToken from "../helpers/generateToken.js";
import { deleteUser, getUserById, getUsers, searchUser, updateUser } from "../services/user.js";

export const getUsersController = async (req, res) => {
  const users = await getUsers()
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
// import { deleteUser, getUserById, getUsers, updateUser } from "../services/user.js";

// export const getUsersController = async (req, res) => {
//   const users = await getUsers()
//   res.json(users)
// }

// export const getUserByIdController = async (req, res) => {
//   const { id } = req.params
//   const users = await getUserById(id)
//   res.json(users)
// }

// export const deleteUserController = async (req, res) => {
//   const { id } = req.params
//   const message = await deleteUser(id)
//   res.json(message)
// }

// export const updateUserController = async (req, res) => {
//   const { name, lastName, email } = req.body
//   const { id } = req.params

//   const user = await updateUser(id, name, lastName, email)
//   res.json(user)
// }
import generateToken from "../helpers/generateToken.js";
import { restorePassword } from "../services/auth.js";
import crypto from 'crypto'
import {
  createUser,
  deleteManyUsers,
  deleteUser,
  getUserById,
  getUsers,
  manyUser,
  searchUser,
  updateUser
} from "../services/user.js";
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
  if (users.msg) {
    res.status(404).json(users)
    return
  }
  res.json(users)
}

export const getUserByIdController = async (req, res) => {
  const { id } = req.params
  const users = await getUserById(id)
  if (users.msg) {
    res.status(404).json(users)
    return
  }
  res.json(users)
}

export const deleteUserController = async (req, res) => {
  const { id } = req.params
  const message = await deleteUser(id)
  if (message.msg) {
    res.status(404).json(message)
    return
  }
  res.json(message)
}

export const updateUserController = async (req, res) => {
  const { name, lastName, email, rolId } = req.body
  const { id } = req.params

  const user = await updateUser(id, name, lastName, email, rolId)
  if (user.msg) {
    res.status(404).json(user)
    return
  }
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

export const createUserController = async (req, res) => {
  const { name, apellido, email, password, confirmPassword } = req.body
  const user = await createUser(name, apellido, email, password, confirmPassword)
  if (user.msg) {
    return res.status(404).json(user)
  }
  res.json(user)
}

export const deleteManyUsersController = async (req, res) => {
  const { ids } = req.body
  const user = await deleteManyUsers(ids)
  console.log(user)
  res.json(user)

}


export const uploadExcelController = async (req, res) => {
  // Suponiendo que estás enviando el archivo Excel como un ArrayBuffer
  const buffer = req.body.buffer;
  const workbook = xlsx.read(buffer, { type: 'buffer' });

  // Puedes procesar el workbook aquí y extraer los datos que necesitas
  // Por ejemplo, puedes convertirlo a JSON
  const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

  res.json({ data: jsonData });
}

export const manyUsersController = async (req, res) => {
  const users = req.body;
  try {
    const user = await manyUser(users);
    res.json(user);
  } catch (error) {
    // Manejar el error aquí si es necesario
    console.log(error);
    res.status(500).json({ error: 'Ha ocurrido un error al procesar la solicitud.' });
  }
};
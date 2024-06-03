import { createRol, deleteRol, getRol, updateRol } from "../services/rol.js"

export const createRolController = async (req, res) => {
  const { name, permissions } = req.body

  const newRol = await createRol(name, permissions)

  res.json(newRol)
}

export const getRolController = async (req, res) => {

  const rols = await getRol()
  res.json(rols)
}

export const updateRolController = async (req, res) => {
  const { name, permissions } = req.body
  const { id } = req.params

  const rol = await updateRol(id, name, permissions)

  if (rol?.msg) {
    return res.status(400).json(rol)
  }
  res.json(rol)
}

export const deleteRolController = async (req, res) => {
  const { id } = req.params

  const rol = deleteRol(id)

  if (rol?.msg) {
    return res.status(400).json(rol)
  }
  res.json(rol)
}
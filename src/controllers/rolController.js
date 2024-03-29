import { createRol } from "../services/rol.js"

export const createRolController = async (req, res) => {
  const { name, permissions } = req.body

  const newRol = await createRol(name, permissions)

  res.json(newRol)
}
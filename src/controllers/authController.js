import { login, register } from '../services/auth.js'


export const registerController = async (req, res) => {
  const { name, lastName, email, password, confirmPassword, rol } = req.body
  const user = await register(name, lastName, email, password, confirmPassword, rol)
  res.json({
    user
  })
}

export const loginController = async (req, res) => {
  const { email, password } = req.body
  const user = await login(email, password)
  res.json(user)
}
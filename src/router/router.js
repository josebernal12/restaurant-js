import { Router } from 'express'
import bookModel from '../model/UserModel.js'
// // import { loginController, registerController } from '../controllers/userController.js'
// import { deleteUserController, getUserByIdController, getUsersController, updateUserController } from '../controllers/userController.js'

const router = Router()

// // router.post('/register', registerController)
// // router.post('/login', loginController)
// router.get('/users', getUsersController)
// router.get('/users/:id', getUserByIdController)
// router.put('/users/update/:id', updateUserController)
// router.delete('/users/delete/:id', deleteUserController)

router.post('/create', async (req, res) => {
  const user = await bookModel.create({ name: 'marito' })
  res.send(user)
})
export default router
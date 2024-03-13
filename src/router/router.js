import { Router } from 'express'

import { loginController, registerController } from '../controllers/authController.js'
import { deleteUserController, getUserByIdController, getUsersController, renewToken, updateUserController } from '../controllers/userController.js'

const router = Router()

router.get('/users', getUsersController)
router.get('/users/:id', getUserByIdController)
router.put('/users/update/:id', updateUserController)
router.delete('/users/delete/:id', deleteUserController)

router.post('/register', registerController)
router.post('/login', loginController)
router.post('/renew-token/:id', renewToken)
export default router
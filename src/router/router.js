import { Router } from 'express'

import { loginController, registerController } from '../controllers/authController.js'
import { deleteUserController, getUserByIdController, getUsersController, logoutController, renewToken, updateUserController, userSearchController } from '../controllers/userController.js'
import { isAdmin } from '../middleware/isAdmin.js'
import { addUserPermission, checkJwt, deleteUserPermission, updateUserPermission } from '../middleware/permission.js'

const router = Router()

router.get('/users', getUsersController)
router.get('/users/:id', getUserByIdController)
router.put('/users/update/:id', [checkJwt, updateUserPermission], updateUserController)
router.delete('/users/delete/:id', [checkJwt, deleteUserPermission], deleteUserController)
// router.post('/search', userSearchController)
router.post('/register', registerController)
router.post('/login', loginController)
router.post('/renew-token/:id', renewToken)
router.get('/logout', [checkJwt], logoutController)
export default router
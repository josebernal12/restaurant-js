import { Router } from 'express'

import { loginController, registerController } from '../controllers/authController.js'
import { deleteUserController, getUserByIdController, getUsersController, logoutController, obtainUserByToken, renewToken, restorePasswordController, updateUserController, userSearchController } from '../controllers/userController.js'
import { isAdmin } from '../middleware/isAdmin.js'
import { addUserPermission, checkJwt, deleteUserPermission, updateUserPermission } from '../middleware/permission.js'

const router = Router()

router.get('/users', [addUserPermission], getUsersController)
router.get('/users/:id', [addUserPermission], getUserByIdController)
router.put('/users/update/:id', [updateUserPermission], updateUserController)
router.delete('/users/delete/:id', [deleteUserPermission],deleteUserController)
// router.post('/search', userSearchController)
router.post('/register', registerController)
router.post('/login', loginController)
router.post('/renew-token/:id', renewToken)
router.get('/logout', logoutController)
router.get('/obtain-user', [checkJwt], obtainUserByToken)
router.post('/restore-password', restorePasswordController)
export default router
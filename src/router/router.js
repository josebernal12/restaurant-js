import { Router } from 'express'

import { changePasswordController, checkTokenEmailController, loginController, registerController,restorePasswordController } from '../controllers/authController.js'
import { deleteUserController, getUserByIdController, getUsersController, logoutController, obtainUserByToken, renewToken, updateUserController, userSearchController } from '../controllers/userController.js'
import { isAdmin } from '../middleware/isAdmin.js'
import { addUserPermission, checkJwt, deleteUserPermission, updateUserPermission } from '../middleware/permission.js'

const router = Router()

router.get('/users', [checkJwt, addUserPermission], getUsersController)
router.get('/users/:id', [checkJwt, addUserPermission], getUserByIdController)
router.put('/users/update/:id', [checkJwt, updateUserPermission], updateUserController)
router.delete('/users/delete/:id', [checkJwt, deleteUserPermission], deleteUserController)
// router.post('/search', userSearchController)
router.post('/register', registerController)
router.post('/login', loginController)
router.post('/renew-token/:id', renewToken)
router.get('/logout', logoutController)
router.get('/obtain-user', [checkJwt], obtainUserByToken)
router.post('/restore-password', restorePasswordController)
router.get('/check-token/:token', checkTokenEmailController)
router.post('/changePassword/:token', changePasswordController)
export default router
import { Router } from 'express'
import { createRolController } from '../controllers/rolController.js'
import { isAdmin } from '../middleware/isAdmin.js'
import { checkJwt } from '../middleware/permission.js'
const router = Router()

router.post('/', [checkJwt],createRolController)

export default router
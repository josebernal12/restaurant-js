import { Router } from 'express'
import { createRolController, getRolController } from '../controllers/rolController.js'
import { isAdmin } from '../middleware/isAdmin.js'
import { checkJwt } from '../middleware/permission.js'
const router = Router()

router.post('/', [checkJwt],createRolController)
router.get('/', [checkJwt], getRolController)
export default router
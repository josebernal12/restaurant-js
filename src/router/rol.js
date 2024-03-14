import { Router } from 'express'
import { createRolController } from '../controllers/rolController.js'
import { isAdmin } from '../middleware/isAdmin.js'
const router = Router()

router.post('/', createRolController)

export default router
import { Router } from 'express'
import { checkJwt } from '../middleware/permission.js'
import { createTableController, getTableByIdController, getTablesController } from '../controllers/tableController.js'

const router = Router()

router.post('/', [checkJwt], createTableController)
router.get('/', [checkJwt], getTablesController)
router.get('/:id', [checkJwt], getTableByIdController)

export default router
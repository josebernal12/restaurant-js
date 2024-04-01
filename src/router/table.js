import { Router } from 'express'
import { checkJwt } from '../middleware/permission.js'
import { createTableController, getTableByIdController, getTablesController } from '../controllers/tableController.js'

const router = Router()
//TODO AGREGAR [checkJwt] A LAS RUTAS
router.post('/',  createTableController)
router.get('/',  getTablesController)
router.get('/:id',  getTableByIdController)

export default router
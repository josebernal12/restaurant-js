import { Router } from 'express'
import {
    createMultipleSuppliersController,
    createSupplierController,
    deleteMultipleSuppliersController,
    deleteSupplierController,
    getSupplierByIdController,
    getSuppliersController,
    updateSupplierController
} from '../controllers/supplierController.js'


const router = Router()

router.post('/', createSupplierController)
router.get('/', getSuppliersController)
router.post('/createMultiple', createMultipleSuppliersController)
router.delete('/deleteMultiple', deleteMultipleSuppliersController)
router.put('/:id', updateSupplierController)
router.delete('/:id', deleteSupplierController)
router.get('/:id', getSupplierByIdController)

export default router
import { Router } from 'express'
import { addProductController, deleteProductController, getProductByIdController, getProductsController, updateProductController } from '../controllers/productController.js'
import { isAdmin } from '../middleware/isAdmin.js'

const router = Router()

router.get('/', getProductsController)
router.post('/', isAdmin, addProductController)
router.get('/:id', getProductByIdController)
router.put('/update/:id', isAdmin, updateProductController)
router.delete('/delete/:id', isAdmin, deleteProductController)



export default router
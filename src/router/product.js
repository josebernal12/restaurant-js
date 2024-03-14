import { Router } from 'express'
import { addProductController, deleteProductController, getProductByIdController, getProductsController, updateProductController } from '../controllers/productController.js'
import {
  addProductPermission,
  deleteProductPermission,
  updateProductPermission
} from '../middleware/productPermission.js'
import { checkJwt } from '../middleware/permission.js'

const router = Router()

router.get('/', getProductsController)
router.post('/', [checkJwt, addProductPermission], addProductController)
router.get('/:id', getProductByIdController)
router.put('/update/:id', [checkJwt, updateProductPermission], updateProductController)
router.delete('/delete/:id', [checkJwt, deleteProductPermission], deleteProductController)



export default router
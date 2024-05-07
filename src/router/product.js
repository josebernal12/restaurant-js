import { Router } from 'express'
import {
  addProductController,
  bestProductController,
  deleteManyProductsController,
  deleteProductController,
  getProductByIdController,
  getProductsController,
  manyProductsController,
  searchProductController,
  updateProductController
} from '../controllers/productController.js'
import {
  addProductPermission,
  deleteProductPermission,
  updateProductPermission
} from '../middleware/productPermission.js'
import { checkJwt } from '../middleware/permission.js'

const router = Router()

router.get('/', [checkJwt],getProductsController)
router.post('/', [checkJwt, addProductPermission], addProductController)
router.get('/bestSeller', [checkJwt],bestProductController)
router.put('/update/:id', updateProductController)
router.delete('/delete/:id', [checkJwt, deleteProductPermission], deleteProductController)
router.post('/search',[checkJwt], searchProductController)
router.delete('/delete-manyProducts', [checkJwt], deleteManyProductsController)
router.post('/many-products', manyProductsController)
router.get('/:id', [checkJwt, addProductPermission], getProductByIdController)

export default router
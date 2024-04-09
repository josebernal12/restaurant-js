import { Router } from 'express'
import { addProductController, bestProductController, deleteProductController, getProductByIdController, getProductsController, searchProductController, updateProductController } from '../controllers/productController.js'
import {
  addProductPermission,
  deleteProductPermission,
  updateProductPermission
} from '../middleware/productPermission.js'
import { checkJwt } from '../middleware/permission.js'

const router = Router()

router.get('/', getProductsController)
router.post('/',  addProductController)
router.get('/bestSeller', bestProductController)
router.get('/:id', getProductByIdController)
router.put('/update/:id',  updateProductController)
router.delete('/delete/:id',  deleteProductController)
router.post('/search', searchProductController)


export default router
import { addProducts, deleteProduct, getProducts, getProductsById, searchProduct, updateProduct } from "../services/products.js"

export const addProductController = async (req, res) => {
  const { name, description, price, stock, category, image } = req.body
  const newProduct = await addProducts(name, description, price, stock, category, image)
  res.json(newProduct)

}

export const getProductsController = async (req, res) => {
  const products = await getProducts()
  res.json(products)

}

export const getProductByIdController = async (req, res) => {
  const { id } = req.params
  const product = await getProductsById(id)
  res.json(product)
}

export const deleteProductController = async (req, res) => {
  const { id } = req.params
  const productDeleted = await deleteProduct(id)
  res.json(productDeleted)
}

export const updateProductController = async (req, res) => {
  const { id } = req.params
  const { name, description, price, stock, category } = req.body

  const productUpdate = await updateProduct(id, name, description, price, stock, category)
  res.json(productUpdate)
}

export const searchProductController = async (req, res) => {
  const { name, price, category } = req.body
  const productSearch = await searchProduct(name, price, category)
  res.json(productSearch)
}

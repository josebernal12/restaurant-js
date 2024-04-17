import {
  addProducts,
  bestProduct,
  deleteProduct,
  getProducts,
  getProductsById,
  searchProduct,
  updateProduct
} from "../services/products.js"

export const addProductController = async (req, res) => {
  const { name, description, price, stock, category, image, recipe } = req.body
  const newProduct = await addProducts(name, description, price, stock, category, image, recipe)
  if (newProduct.msg) {
    res.status(404).json(newProduct)
    return
  }
  res.json(newProduct)

}

export const getProductsController = async (req, res) => {
  const query = {}; // Inicializar el objeto de consulta
  let page;
  let showAll;
  let quantity;
  if (req.query.name) {
    query.name = { $regex: req.query.name, $options: 'i' }; // 'i' para hacer la búsqueda case-insensitive
  }
  if (req.query.category) {
    query.category = { $regex: req.query.category, $options: 'i' }; // 'i' para hacer la búsqueda case-insensitive
  }
  if (req.query.page) {
    page = req.query.page // 'i' para hacer la búsqueda case-insensitive
  }
  if (req.query.showAll) {
    showAll = req.query.showAll // 'i' para hacer la búsqueda case-insensitive
  }
  if (req.query.quantity) {
    quantity = req.query.quantity // 'i' para hacer la búsqueda case-insensitive
  }
  const products = await getProducts(query, page, showAll, quantity)
  if (products.msg) {
    res.status(404).json(products)
    return
  }
  res.json(products)
}

export const getProductByIdController = async (req, res) => {
  const { id } = req.params
  const product = await getProductsById(id)
  if (product.msg) {
    res.status(404).json(product)
    return
  }
  res.json(product)
}

export const deleteProductController = async (req, res) => {
  const { id } = req.params
  const productDeleted = await deleteProduct(id)
  if (productDeleted.msg) {
    res.status(404).json(productDeleted)
    return
  }
  res.json(productDeleted)
}

export const updateProductController = async (req, res) => {
  const { id } = req.params
  const { name, description, price, stock, category } = req.body

  const productUpdate = await updateProduct(id, name, description, price, stock, category)
  if (productUpdate.msg) {
    res.status(404).json(productUpdate)
    return
  }
  res.json(productUpdate)
}

export const searchProductController = async (req, res) => {
  const { name, price, category } = req.body
  const productSearch = await searchProduct(name, price, category)
  res.json(productSearch)
}

export const bestProductController = async (req, res) => {
  let range;
  if (req.query.range) {
    range = req.query.range
  }
  const bill = await bestProduct(range)
  res.json(bill)
}

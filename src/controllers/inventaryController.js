import {
  createProductInventory,
  deleteProductInventory,
  getProductByIdInventory,
  inventary,
  updateProductInventory
} from "../services/inventary.js";

export const inventaryController = async (req, res) => {
  const query = {}; // Inicializar el objeto de consulta
  let page;
  let showAll;
  let quantity;
  if (req.query.name) {
    query.name = { $regex: req.query.name, $options: 'i' }; // 'i' para hacer la búsqueda case-insensitive
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

  const products = await inventary(query, quantity, page, showAll)
  res.json(products)
}

export const createProductInventoryController = async (req, res) => {
  const { name, stock, max, min } = req.body
  console.log(name)
  console.log(stock)
  console.log(max)
  const product = await createProductInventory(name, stock, max, min)
  console.log(product )
  if (product.msg) {
    res.status(400).json(product)
    return
  }
  res.json(product)
}

export const updateProductInventoryController = async (req, res) => {
  const { id } = req.params
  const { name, stock, max, min } = req.body
  const product = await updateProductInventory(id, name, stock, max, min)
  if (product.msg) {
    res.status(400).json(product)
    return
  }
  res.json(product)
}

export const deleteProductInventoryController = async (req, res) => {
  const { id } = req.params
  const product = await deleteProductInventory(id)
  if (product.msg) {
    res.status(400).json(product)
    return
  }
  res.json(product)
}

export const getProducInventoryByIdController = async (req, res) => {
  const { id } = req.params

  const product = await getProductByIdInventory(id)
  if (product.msg) {
    res.status(400).json(product)
    return
  }
  res.json(product)
}
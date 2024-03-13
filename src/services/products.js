import productModel from "../model/ProductModel.js"

export const addProducts = async (name, description, price, stock, category) => {
  try {
    const newProduct = await productModel.create({ name, description, price, stock, category })
    return newProduct
  } catch (error) {
    console.log(error)
  }
}

export const getProducts = async () => {
  try {
    const products = await productModel.find()
    if (!products) {
      return 'no hay productos'
    }
    return products
  } catch (error) {
    console.log(error)
  }
}

export const getProductsById = async (id) => {
  try {
    const product = await productModel.findById(id)
    if (!product) {
      return 'no hay productos con ese id'
    }
    return product
  } catch (error) {
    console.log(error)
  }
}

export const deleteProduct = async (id) => {
  try {
    const product = await productModel.findByIdAndDelete(id)
    if (!product) {
      return 'no hay productos con ese id'
    }
    return product
  } catch (error) {
    console.log(error)
  }
}


export const updateProduct = async (id, name, description, stock, price, category) => {
  try {
    const productUpdate = await productModel.findByIdAndUpdate(id, { name, description, stock, price, category }, { new: true })
    if (!productUpdate) {
      return 'error en la actualizacion'
    }
    return productUpdate
  } catch (error) {
    console.log(error)
  }
}
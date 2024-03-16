
import productModel from "../model/ProductModel.js"

export const addProducts = async (name, description, price, stock, category, image) => {
  try {
    const newProduct = await productModel.create({ name, description, price, stock, category, image })
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

export const searchProduct = async (name, price, category,) => {
  try {
    const productSearch = await productModel.find(
      {
        name: { $regex: new RegExp(name, 'i') },
        // price: {
        //   $regex: new RegExp(price, 'i'),
        // },
        category: { $regex: new RegExp(category, 'i') }

      })

    if (!productSearch) {
      return {
        msg: 'error en la busqueda'
      }
    }
    return productSearch
  } catch (error) {
    console.log(error)
  }
}
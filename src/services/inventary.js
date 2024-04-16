import inventaryModel from "../model/Inventary.js";

export const inventary = async (name, quantity, page, showAll) => {
  try {
    const perPage = 10;
    const pageQuery = parseInt(page) || 1;
    const skip = perPage * (pageQuery - 1);

    let query = {}; // Inicializamos la consulta como vacía

    // Si se solicitan todos los productos
    if (showAll === "1") {
      const productTotal = await inventaryModel.countDocuments()
      const products = await inventaryModel.find(query).select('-image -description -price');
      return {
        productTotal,
        products
      }
    }

    // Si se solicita una cantidad específica de productos
    if (quantity) {
      const productTotal = await inventaryModel.countDocuments()
      const products = await inventaryModel.find(query).limit(quantity).select('-image -description -price');
      return {
        productTotal,
        products
      }
    }

    // Si se busca por nombre
    if (name && name.name) {
      query = name;
    }

    // Si se solicita una página específica de productos
    const productTotal = await inventaryModel.countDocuments(query)
    const products = await inventaryModel.find(query).select('-image -description -price').limit(perPage).skip(skip).exec();

    if (!products || products.length === 0) {
      return {
        products: []
      }
    }

    return {
      products,
      productTotal
    }
  } catch (error) {
    console.log(error)
  }
}


export const createProductInventory = async (name, stock, max, min) => {
  try {
    const exist = await inventaryModel.findOne({ name })
    if (exist) {
      return {
        msg: 'ya existe un producto con ese nombre'
      }
    }
    const newProduct = await inventaryModel.create({ name, stock, max, min })
    if (!newProduct) {
      return {
        msg: 'hubo un error al crear producto'
      }
    }
    return newProduct
  } catch (error) {
    console.log(error)
  }
}

export const updateProductInventory = async (id, name, stock, max, min) => {
  try {
    const product = await inventaryModel.findByIdAndUpdate(id, { name, stock, max, min }, { new: true })
    if (!product) {
      return {
        msg: 'no hay producto con ese id'
      }
    }
    return product
  } catch (error) {
    console.log(error)
  }
}

export const deleteProductInventory = async (id) => {
  try {
    const product = await inventaryModel.findByIdAndDelete(id, { new: true })
    if (!product) {
      return {
        msg: 'no hay id con ese producto'
      }
    }
    return product
  } catch (error) {
    console.log(error)
  }
}

export const getProductByIdInventory = async (id) => {
  try {
    const product = await inventaryModel.findById(id)
    if (!product) {
      return {
        msg: 'no hay id con ese producto'
      }
    }
    return product
  } catch (error) {
    console.log(error)
  }
}
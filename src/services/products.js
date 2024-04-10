
import billModel from "../model/BillModel.js"
import productModel from "../model/ProductModel.js"
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export const addProducts = async (name, description, price, stock, category, image) => {
  try {
    const newProduct = await productModel.create({ name, description, price, stock, category, image })
    return newProduct
  } catch (error) {
    console.log(error)
  }
}

export const getProducts = async (name, page, showAll, quantity) => {
  try {

    const perPage = 10;
    const pageQuery = parseInt(page) || 1;
    const skip = perPage * (pageQuery - 1);

    if (showAll === "1") {
      const productTotal = await productModel.countDocuments()
      const products = await productModel.find()
      return {
        productTotal,
        products
      }
    }
    if (quantity) {
      const productTotal = await productModel.countDocuments()
      const products = await productModel.find().limit(quantity)
      return {
        productTotal,
        products
      }
    }
    if (name.name) {
      const productTotal = await productModel.countDocuments()
      const products = await productModel.find(name)
      if (!products) {
        return 'no hay productos'
      }
      return {
        products,
        productTotal
      }
    }
    const productTotal = await productModel.countDocuments()
    const products = await productModel.find(name).limit(perPage).skip(skip).exec()
    if (!products) {
      return 'no hay productos'
    }
    return {
      products,
      productTotal
    }
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



export const TimeRange = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month'
};


export const bestProduct = async (range) => {
  try {
    let filter = {};

    // Si se proporciona un rango de tiempo, ajustar el filtro por fecha
    if (range) {
      const startDate = startOfDay(new Date());
      const endDate = endOfDay(new Date());
      filter = { createdAt: { $gte: startDate, $lte: endDate } };
    }

    // Obtener todas las facturas (o filtrar por fecha si se proporciona un rango)
    const bills = await billModel.find(filter).populate('ticketId');

    // Objeto para almacenar la cantidad total vendida de cada producto
    const soldProducts = {};

    // Recorrer todas las facturas
    bills.forEach(bill => {
      // Recorrer todos los productos de la factura
      bill.ticketId.products.forEach(product => {
        // Si el producto tiene un ID
        if (product._id) {
          // Si el producto ya está en el objeto, aumenta la cantidad vendida
          if (soldProducts[product._id]) {
            soldProducts[product._id].stock += product.stock;
          } else {
            // Si el producto no está en el objeto, inicializa la cantidad vendida
            soldProducts[product._id] = { stock: product.stock };
          }
        }
      });
    });

    // Obtener los nombres de los productos más vendidos
    const productIds = Object.keys(soldProducts);

    const productsInfo = await Promise.all(productIds.map(async productId => {
      const product = await productModel.findById(productId);
      return { name: product.name, stock: soldProducts[productId].stock };
    }));

    // Ordenar los productos por la cantidad vendida (de mayor a menor)
    const sortedProducts = productsInfo.sort((a, b) => b.stock - a.stock);

    // Devolver los nombres y cantidades de los productos más vendidos
    return sortedProducts;
  } catch (error) {
    console.log(error);
    throw new Error('Ocurrió un error al obtener los productos más vendidos.');
  }
};





import billModel from "../model/BillModel.js"
import inventaryModel from "../model/Inventary.js";
import productModel from "../model/ProductModel.js"
import moment from 'moment-timezone'

export const addProducts = async (name, description, price, category, image, discount, recipe, promotion, iva) => {
  try {

    if (!name || !description || !price  || !category) {
      return {
        msg: 'todos los campos son obligatorios'
      }
    }
    const newProduct = await (await productModel.create({ name, description, price, category, image, discount, recipe, promotion, iva })).populate('recipe')
    newProduct.recipe.forEach(async (value) => {
      const product = await inventaryModel.findById(value._id)
      const difference = product.stock - value.stock
      if (difference > 0) {
        await inventaryModel.findByIdAndUpdate(value._id, { $inc: { stock: - value.stock } })
      } else {
        return {
          msg: `no hay suficiente ${product.name} para el ${value.name} `
        }
      }
    })
    if (!newProduct) {
      return {
        msg: 'error al crear producto'
      }
    }
    return newProduct
  } catch (error) {
    console.log(error)
  }
}

export const getProducts = async (query, page, showAll, limit, skip) => {
  try {
    const productTotal = await productModel.countDocuments(query);

    let products;
    if (showAll === "1") {
      products = await productModel.find(query).populate('category');
    } else {
      products = await productModel.find(query)
        .limit(limit)
        .skip(skip)
        .populate('category');
    }

    return {
      products,
      productTotal
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving products from the database');
  }
};

export const getProductsById = async (id) => {
  try {
    const product = await productModel.findById(id).populate('category');
    if (!product) {
      return {
        msg: 'no hay productos con ese id'
      }
    }
    return product
  } catch (error) {
    console.log(error)
  }
}

export const deleteProduct = async (id) => {
  try {
    const product = await productModel.findByIdAndDelete(id)
    const productTotal = await productModel.countDocuments()

    if (!product) {
      return {
        msg: 'no hay productos con ese id'
      }
    }
    return { product, productTotal }
  } catch (error) {
    console.log(error)
  }
}

export const updateProduct = async (id, name, description, price, category, discount, recipe, promotion, iva) => {
  try {
    if (!name || !description || !price  || !category) {
      return {
        msg: 'todos los campos son obligatorios'
      }
    }
    // Obtener el producto antes de la actualización
    const productsBefore = await productModel.findById(id).populate('recipe');

    // Actualizar el producto con la nueva información
    const productUpdate = await productModel.findByIdAndUpdate(id,
      { name, description, stock, price, category, discount, recipe, promotion, iva },
      { new: true }).populate('recipe');

    if (!productUpdate) {
      return { msg: 'Error en la actualización' };
    }

    // Crear un map de los ingredientes antes de la actualización para un acceso más rápido
    const beforeRecipeMap = new Map(productsBefore.recipe.map(item => [item._id.toString(), item]));

    // Iterar sobre los ingredientes en la receta actualizada
    for (let value of productUpdate.recipe) {
      if (beforeRecipeMap.has(value._id.toString())) {
        // Si el ingrediente está en ambas recetas, ajustar el stock según la diferencia
        const oldProduct = beforeRecipeMap.get(value._id.toString());
        const stockDifference = value.stock - oldProduct.stock;
        const inventary = await inventaryModel.findById(value._id);

        await inventaryModel.findByIdAndUpdate(value._id,
          { stock: inventary.stock - stockDifference },
          { new: true });

        // Eliminar el ingrediente del mapa para marcarlo como procesado
        beforeRecipeMap.delete(value._id.toString());
      } else {
        // Si el ingrediente es nuevo en la receta, restar el stock del inventario
        const inventary = await inventaryModel.findById(value._id);

        await inventaryModel.findByIdAndUpdate(value._id,
          { stock: inventary.stock - value.stock },
          { new: true });
      }
    }

    // Los ingredientes restantes en beforeRecipeMap ya no están en la receta, restaurar su stock
    for (let [key, oldProduct] of beforeRecipeMap) {
      const inventary = await inventaryModel.findById(oldProduct._id);

      await inventaryModel.findByIdAndUpdate(oldProduct._id,
        { stock: inventary.stock + oldProduct.stock },
        { new: true });
    }

    return productUpdate;
  } catch (error) {
    console.log(error);
    return { msg: 'Error en la actualización' };
  }
};




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
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year'
};

export const bestProduct = async (range) => {
  try {
    let filter = {};

    // Si se proporciona un rango de tiempo, ajustar el filtro por fecha
    if (range) {
      let startDate, endDate;

      switch (range) {
        case TimeRange.DAY:
          // Rango para el día actual en la zona horaria de Mazatlán
          const timeZone = 'America/Mazatlan';
          startDate = moment.tz(timeZone).startOf('day').toDate();
          endDate = moment.tz(timeZone).endOf('day').toDate();
          break;
        case TimeRange.WEEK:
          // Rango para la semana actual
          const week = new Date();
          const dayOfWeek = week.getDay();
          startDate = new Date(week);
          startDate.setDate(week.getDate() - dayOfWeek); // Primer día de la semana
          endDate = new Date(week);
          endDate.setDate(week.getDate() + (6 - dayOfWeek)); // Último día de la semana
          break;
        case TimeRange.MONTH:
          // Rango para el mes actual
          const currentDate = new Date();
          startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Primer día del mes actual
          endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Último día del mes actual
          break;
        case TimeRange.QUARTER:
          // Rango para el trimestre actual
          const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3);
          startDate = new Date(new Date().getFullYear(), 3 * currentQuarter - 3, 1); // Primer día del trimestre actual
          endDate = new Date(new Date().getFullYear(), 3 * currentQuarter, 0); // Último día del trimestre actual
          break;
        case TimeRange.YEAR:
          // Rango para el año actual
          startDate = new Date(new Date().getFullYear(), 0, 1); // Primer día del año actual
          endDate = new Date(new Date().getFullYear(), 11, 31); // Último día del año actual
          break;
        default:
          throw new Error('Rango de tiempo no válido');
      }

      // Aplicar el filtro por fecha
      filter = { createdAt: { $gte: startDate, $lte: endDate } };
    }

    // Obtener todas las facturas (o filtrar por fecha si se proporciona un rango)
    const bills = await billModel.find(filter).populate('ticketId');

    // Objeto para almacenar la cantidad total vendida de cada producto
    const soldProducts = {};

    // Recorrer todas las facturas
    bills.forEach(bill => {
      // Verificar si bill.ticketId está definido
      bill.ticketId.forEach(value => {
        if (bill.ticketId && value.products) {
          // Recorrer todos los productos de la factura
          value.products.forEach(product => {
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
        }
      })
    });
    let product;
    const productIds = Object.keys(soldProducts);
    const productsInfo = await Promise.all(productIds.map(async productId => {
      product = await productModel.findById(productId);
      if (!product) {
        // Si el producto no existe en la base de datos, simplemente regresa null
        return null;
      }
      // Si el producto existe, regresa su información
      return { name: product.name, stock: soldProducts[productId].stock };
    }));

    // Filtrar los productos que son null (productos no encontrados en la base de datos)
    const validProductsInfo = productsInfo.filter(product => product !== null);

    // Ordenar los productos válidos por la cantidad vendida (de mayor a menor)
    const sortedProducts = validProductsInfo.sort((a, b) => b.stock - a.stock);

    if (sortedProducts.length === 0) {
      return {
        products: []
      };
    }

    // Obtener solo los nombres de los productos más vendidos
    const products = sortedProducts.map(product => ({ name: product.name, stock: product.stock }));

    // Devolver los nombres y cantidades de los productos más vendidos
    return { products };

  } catch (error) {
    console.log(error);
    throw new Error('Ocurrió un error al obtener los productos más vendidos.');
  }
};



export const deleteManyProducts = async (ids) => {
  try {
    ids.forEach(async (id) => {
      const product = await productModel.findByIdAndDelete(id, { new: true })
      const productTotal = await productModel.countDocuments()

      return { product, productTotal }
    })
  } catch (error) {
    console.log(error)
  }
}

export const manyProduct = async (products) => {
  try {
    const productsArray = [];
    let productTotal;
    for (const value of products) {
      const product = await productModel.create(value);
      productTotal = await productModel.countDocuments()

      if (!product) {
        return { product: [] };
      }
      productsArray.push(product);
    }
    return { productsArray, productTotal };
  } catch (error) {
    console.log(error);
    throw error; // Puedes elegir manejar el error aquí o dejarlo para que lo maneje el controlador.
  }
};




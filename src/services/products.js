
import billModel from "../model/BillModel.js"
import inventaryModel from "../model/Inventary.js";
import productModel from "../model/ProductModel.js"
import moment from 'moment-timezone'


const conversiones = {
  kg: 1000, // 1 kg = 1000 g
  gramos: 1, // 1 g = 1 g
  mg: 0.001, // 1 mg = 0.001 g
  litros: 1000, // 1 l = 1000 ml
  ml: 1, // 1 ml = 1 ml
  cl: 10, // 1 cl = 10 ml
  piezas: 1, // 1 pieza = 1 unidad
  uds: 1, // 1 unidad = 1 unidad
  m: 100, // 1 m = 100 cm
  cm: 1, // 1 cm = 1 cm
  mm: 0.1, // 1 mm = 0.1 cm
  botella: 1
};

export const addProducts = async (name, description, price, category, image, discount, recipe, promotion, iva, companyId) => {
  try {
    if (!name || !description || !price) {
      return {
        msg: 'Todos los campos son obligatorios'
      };
    }

    const exist = await productModel.findOne({ name, companyId });
    if (exist) {
      return {
        msg: 'Ya existe un producto con ese nombre'
      };
    }

    const newProduct = await (await productModel.create({ name, description, price, category, image, discount, recipe, promotion, iva, companyId })).populate('recipe');
    if (!newProduct) {
      return {
        msg: 'Error al crear producto'
      };
    }

    for (const value of newProduct.recipe) {
      const product = await inventaryModel.findById(value._id);
      if (!product) {
        return {
          msg: `No se encontró el producto ${value._id} en el inventario`
        };
      }

      const recipeUnitQuantity = value.unitQuantity !== undefined ? value.unitQuantity : 1;
      const inventoryUnitQuantity = product.unitQuantity !== undefined ? product.unitQuantity : 1;

      const recipeItemStockEnGramos = value.stock * conversiones[value.unit] * recipeUnitQuantity;
      const inventoryItemStockEnGramos = product.stock * conversiones[product.unit.name] * inventoryUnitQuantity;

      const difference = inventoryItemStockEnGramos - recipeItemStockEnGramos;

      if (difference >= 0) {
        const newStockEnGramos = inventoryItemStockEnGramos - recipeItemStockEnGramos;
        const newStock = newStockEnGramos / (conversiones[product.unit.name] * inventoryUnitQuantity);
        await inventaryModel.findByIdAndUpdate(value._id, { stock: newStock });
      } else {
        return {
          msg: `No hay suficiente ${product.name} para el ${value.name}`
        };
      }
    }

    return newProduct;
  } catch (error) {
    console.log(error);
    return {
      msg: 'Error del servidor'
    };
  }
};

export const getProducts = async (query, page, showAll, limit, skip, companyId, sortName, sortPrice, sortCategory) => {
  try {
    const productTotal = await productModel.countDocuments({ ...query, companyId });

    let sortOptions = {};

    // Ordenar por nombre si se especifica
    if (sortName) {
      sortOptions.name = sortName === 'asc' ? 1 : -1; // 1 para ascendente, -1 para descendente
    }
    // Ordenar por precio si se especifica
    if (sortPrice) {
      sortOptions.price = sortPrice === 'asc' ? 1 : -1; // 1 para ascendente, -1 para descendente
    }
    // Ordenar por nombre de categoría si se especifica
    if (sortCategory) {
      sortOptions['category.name'] = sortCategory === 'asc' ? 1 : -1; // 1 para ascendente, -1 para descendente
    }
    let products;
    if (showAll === "1") {
      products = await productModel.find({ ...query, companyId })
        .sort(sortOptions) // Aplicar el ordenamiento
        .populate('category'); // Asegúrate de que 'category' está correctamente referenciado
    } else {
      products = await productModel.find({ ...query, companyId })
        .limit(limit)
        .skip(skip)
        .sort(sortOptions) // Aplicar el ordenamiento
        .populate('category'); // Asegúrate de que 'category' está correctamente referenciado
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

export const updateProduct = async (id, name, description, price, category, discount, recipe, promotion, iva, companyId) => {
  try {
    if (!name || !description || !price || !category) {
      return {
        msg: 'todos los campos son obligatorios'
      }
    }
    const exist = await productModel.findOne({
      name,
      companyId,
      _id: { $ne: id } // Excluye el producto actual de la búsqueda
    });

    if (exist) {
      return {
        msg: 'ya existe un producto con ese nombre'
      };
    }

    // Obtener el producto antes de la actualización
    const productsBefore = await productModel.findById(id).populate('recipe');

    // Actualizar el producto con la nueva información
    const productUpdate = await productModel.findByIdAndUpdate(id,
      { name, description, price, category, discount, recipe, promotion, iva, companyId },
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

export const bestProduct = async (range, companyId) => {
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
    const bills = await billModel.find({ ...filter, companyId }).populate('ticketId');

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




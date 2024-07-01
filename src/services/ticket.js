import mongoose from "mongoose";
import ticketModel from "../model/TIcketModel.js"
import tableModel from "../model/TableModel.js"
import productModel from "../model/ProductModel.js";
import promotionModel from "../model/Promotion.js";
import inventaryModel from "../model/Inventary.js";

export const createTicket = async (products, subTotal, total, tableId, userId, waiter, waiterId, promotion) => {
  try {
    if (!products || !total) {
      return {
        msg: 'Todos los campos son obligatorios'
      };
    }

    const tableObjectId = mongoose.Types.ObjectId(tableId);
    const table = await tableModel.findById(tableObjectId);

    if (!table) {
      return {
        msg: 'No existen mesas con ese ID'
      };
    }

    let invalid = false; // Inicializamos la bandera como falsa

    if (promotion) {
      if (promotion.length > 0) {
        for (const value of promotion) {
          const promotion = await promotionModel.findById(value);
          for (const product of promotion.productsId) {
            const promoProduct = await productModel.findById(product);
            for (const recipe of promoProduct.recipe) {
              if (recipe._id) {
                await inventaryModel.findByIdAndUpdate(recipe._id, { $inc: { stock: -recipe.stock } });
              }
            }
          }
        }
      }
    }

    const lastBill = await ticketModel.findOne().sort({ folio: -1 });
    const newFolio = lastBill && lastBill.folio ? lastBill.folio + 1 : 1;
    // Verificación del stock de productos
    for (const product of products) {
      // if (product.type === true) {
      //   const promotion = await promotionModel.findById(product._id);
      //   for (const product of promotion.productsId) {
      //     const promoProduct = await productModel.findById(product);
      //     for (const recipe of promoProduct.recipe) {
      //       if (recipe._id) {
      //         await inventaryModel.findByIdAndUpdate(recipe._id, { $inc: { stock: -recipe.stock } });
      //       }
      //     }
      //   }
      // }
      const productUpdate = await productModel.findById(product._id);
      // if (!productUpdate) {
      //   invalid = true;
      //   break;
      // }
      
      for (const recipe of product.recipe) {
        const inventoryItem = await inventaryModel.findById(recipe._id);
        if (inventoryItem.stock < recipe.stock) {
          invalid = true;
          break;
        }
      }

      if (invalid) break;
    }

    if (invalid) {
      return {
        msg: 'La cantidad de al menos uno de los productos supera el stock disponible'
      };
    }

    // Si ninguno de los productos tiene una cantidad inválida, actualizamos el stock de cada producto y su receta
    for (const product of products) {
      await productModel.findByIdAndUpdate(product._id, { $inc: { stock: -product.stock } });

      for (const recipe of product.recipe) {
        await inventaryModel.findByIdAndUpdate(recipe._id, { $inc: { stock: -recipe.stock } });
      }
    }

    // Crear el nuevo ticket
    const newTicket = await ticketModel.create({
      products,
      subTotal,
      total,
      tableId,
      userId,
      waiter,
      waiterId,
      promotion,
      folio: newFolio
    });

    if (!newTicket) {
      return {
        msg: 'Error al crear el ticket'
      };
    }

    newTicket.status = 'proceso';
    await newTicket.save();

    return newTicket;

  } catch (error) {
    console.log(error);
    return {
      msg: 'Ocurrió un error al crear el ticket'
    };
  }
};
export const updateTicket = async (id, products, subTotal, total, tableId, userId, waiterId, promotion) => {
  try {
    // Encontrar el ticket actual
    const ticket = await ticketModel.findById(id);
    if (!ticket) {
      return {
        msg: 'El ticket no existe'
      };
    }
    if (!products || !subTotal || !total) {
      return {
        msg: 'Todos los campos son obligatorios'
      };
    }

    // Objeto para almacenar la diferencia de stock
    const stockDifference = {};

    // Verificar y calcular la diferencia de stock para los productos en el ticket
    for (const product of products) {
      const originalProduct = ticket.products.find(p => p._id.toString() === product._id.toString());
      if (!originalProduct) {
        // Si el producto no existe en el ticket original, considerarlo como un nuevo producto
        stockDifference[product._id] = product.stock;
      } else {
        // Calcular la diferencia de stock para los productos existentes en el ticket
        const diff = product.stock - originalProduct.stock;
        stockDifference[product._id] = diff;
      }

      const productData = await productModel.findById(product._id);
      if (!productData) {
        return {
          msg: `No se encontró el producto ${product._id}`
        };
      }
      if (productData.stock + stockDifference[product._id] < 0) {
        return {
          msg: `No hay suficiente stock disponible para el producto ${product._id}`
        };
      }
    }

    // Verificación del stock para los productos en la promoción
    let invalid = false;
    if (promotion.length > 0) {
      for (const value of promotion) {
        const promotionItem = await promotionModel.findById(value);
        for (const product of promotionItem.productsId) {
          const promoProduct = await productModel.findById(product);
          for (const recipe of promoProduct.recipe) {
            const inventoryItem = await inventaryModel.findById(recipe._id);
            if (inventoryItem.stock < recipe.stock) {
              invalid = true;
              break;
            }
          }
          if (invalid) break;
        }
        if (invalid) break;
      }
    }

    if (invalid) {
      return {
        msg: 'La cantidad de al menos uno de los productos de la promoción supera el stock disponible'
      };
    }

    // Agregar nuevos productos al ticket
    for (const productId in stockDifference) {
      if (stockDifference[productId] > 0) {
        const newProduct = products.find(p => p._id.toString() === productId);
        ticket.products.push(newProduct);
      }
    }

    // Actualizar el stock de los productos
    for (const productId in stockDifference) {
      await productModel.findByIdAndUpdate(productId, { $inc: { stock: -stockDifference[productId] } });

      // Actualizar el stock de los ingredientes en la receta del producto
      const product = products.find(p => p._id.toString() === productId);
      for (const recipe of product.recipe) {
        await inventaryModel.findByIdAndUpdate(recipe._id, { $inc: { stock: -recipe.stock } });
      }
    }

    // Actualizar el stock de los productos de la promoción
    if (promotion.length > 0) {
      for (const value of promotion) {
        const promotionItem = await promotionModel.findById(value);
        for (const product of promotionItem.productsId) {
          const promoProduct = await productModel.findById(product);
          for (const recipe of promoProduct.recipe) {
            if (recipe._id) {
              await inventaryModel.findByIdAndUpdate(recipe._id, { $inc: { stock: -recipe.stock } });
            }
          }
        }
      }
    }

    // Actualizar el ticket
    const ticketUpdate = await ticketModel.findByIdAndUpdate(id, { products: ticket.products, subTotal, total, tableId, userId, waiterId, promotion }, { new: true });
    if (!ticketUpdate) {
      return {
        msg: 'No se pudo actualizar el ticket'
      };
    }

    return ticketUpdate;
  } catch (error) {
    console.log(error);
    return {
      msg: 'Ocurrió un error al actualizar el ticket'
    };
  }
};

export const newUpdateTicket = async (id, products, subTotal, total, tableId, userId, type) => {
  try {
    const ticket = await ticketModel.findById(id);
    if (!ticket) {
      return {
        msg: 'El ticket no existe'
      };
    }
    // if (type) {
    //   ticket.products.forEach(async (product) => {
    //     const product = await productModel.findById(product._id)
    //   })

    //   const ticketUpdate = await ticketModel.findByIdAndUpdate(id, { products, subTotal, total, tableId, userId })
    //   return ticketUpdate
    // }

  } catch (error) {
    console.log(error)
  }
}

export const getTickets = async (name) => {
  try {
    if (name.waiter) {
      const tickets = await ticketModel.find(name)
      return tickets

    }
    const tickets = await ticketModel.find()
    if (!tickets) {
      return {
        tickets: []
      }
    }
    return tickets
  } catch (error) {
    console.log(error)
  }
}


export const getTicketById = async (id) => {
  try {

    const ticket = await ticketModel.findById(id)
    if (!ticket) {
      return {
        msg: 'no hay ticket con ese id'
      }
    }
    if (ticket.completed === false) {
      return ticket
    }
  } catch (error) {
    console.log(error)
  }
}

export const deleteTicket = async (id) => {
  try {
    const ticketDeleted = await ticketModel.findByIdAndDelete(id, { new: true })
    if (!ticketDeleted) {
      return {
        msg: 'no hay tickets con ese id'
      }
    }
    return ticketDeleted
  } catch (error) {
    console.log(error)
  }
}

export const joinTable = async (idsTables) => {
  try {
    const ticket = await ticketModel.create()
  } catch (error) {
    console.log(error)
  }
}

export const cancelAccount = async (id, tableId) => {
  try {
    const ticketCancel = await ticketModel.findByIdAndDelete(id, { new: true })
    await tableModel.findByIdAndUpdate(tableId, { available: true })
    if (!ticketCancel) {
      return {
        msg: "no hay ticket con ese id"
      }
    }
    for (const product of ticketCancel.products) {
      await productModel.findByIdAndUpdate(product._id, { $inc: { stock: + product.stock } });
    }
    for (const product of ticketCancel.products) {
      product.recipe.forEach(async (recipe) => {
        await inventaryModel.findByIdAndUpdate(recipe._id, { $inc: { stock: +recipe.stock } })
      })
    }
    for (const promotion of ticketCancel.promotion) {
      const promotions = await promotionModel.findById(promotion)
      promotions.productsId.forEach(async (product) => {
        const products = await productModel.findById(product)
        products.recipe.forEach(async (recipe) => {
          await inventaryModel.findByIdAndUpdate(recipe._id, { $inc: { stock: +recipe.stock } })
        });
      })
    }

    return 'producto cancelado'
  } catch (error) {
    console.log(error)
  }
}


export const receivedTicket = async (id) => {
  try {
    const ticket = await ticketModel.findById(id)
    if (!ticket) {
      return {
        msg: 'no hay ticket con ese id'
      }
    }
    ticket.status = 'completado'
    ticket.save()
    return ticket
  } catch (error) {
    console.log(error)
  }
}

export const finishedTicket = async (id) => {
  try {
    const ticket = await ticketModel.findById(id)
    if (!ticket) {
      return {
        msg: 'no hay tickets con ese id'
      }
    }
    ticket.status = 'finalizado'
    ticket.save()
    return ticket
  } catch (error) {
    console.log(error)
  }
}

export const completedProduct = async (id, idProduct) => {
  try {
    const ticket = await ticketModel.findById(id)
    if (!ticket) {
      return {
        msg: 'no hay id con ese tikcet'
      }
    }
    ticket.products.forEach(product => {
      if (product._id.toString() === idProduct.toString()) {
        product.completed = !product.completed
      }
    })
    ticket.save()
    return ticket
  } catch (error) {
    console.log(error)
  }
}

export const completedAllProductTicket = async (id) => {
  try {
    const ticket = await ticketModel.findById(id)
    if (!ticket) {
      return {
        msg: 'no hay id con ese tikcet'
      }
    }
    ticket.products.forEach(product => {
      product.completed = true
    })
    ticket.save()
    return ticket
  } catch (error) {
    console.log(error)
  }
}


export const joinAllProductsTicket = async (tableId) => {
  try {
    const ticket = await ticketModel.find({ tableId })
    if (!ticket) {
      return {
        msg: 'no hay ticket en esa mesa'
      }
    }
    return ticket
  } catch (error) {
    console.log(error)
  }
}
export const getAllTickets = async () => {
  const tickets = await ticketModel.find()

  if (!tickets || tickets.length === 0) {
    return {
      tickets: []
    };
  }

  // Crear un objeto para mapear tableId a arrays de tickets
  const ticketsGrouped = tickets.reduce((acc, ticket) => {
    const { tableId } = ticket;
    if (!acc[tableId]) {
      acc[tableId] = [ticket];
    } else {
      acc[tableId].push(ticket);
    }
    return acc;
  }, {});

  // Extraer los arrays de tickets agrupados en un solo array
  const groupedTickets = Object.values(ticketsGrouped);

  return {
    tickets: groupedTickets
  };
};





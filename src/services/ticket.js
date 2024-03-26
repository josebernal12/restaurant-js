import mongoose from "mongoose";
import ticketModel from "../model/TIcketModel.js"
import tableModel from "../model/TableModel.js"
import productModel from "../model/ProductModel.js";

export const createTicket = async (products, subTotal, total, tableId, userId) => {
  try {
    const tableObjectId = mongoose.Types.ObjectId(tableId);
    const table = await tableModel.findById(tableObjectId)
    const existTicket = await ticketModel.findOne({ tableId: tableObjectId })

    if (table && !existTicket) {
      let invalid = false; // Inicializamos la bandera como falsa
      for (const product of products) {
        const productUpdate = await productModel.findById(product._id)
        const newStock = productUpdate.stock - product.stock;
        if (newStock < 0) {
          invalid = true; // Establecemos la bandera como verdadera si encontramos un producto con cantidad inválida
          break; // Salimos del bucle ya que no es necesario seguir verificando los demás productos
        }
      }

      if (invalid) {
        return {
          msg: 'La cantidad de al menos uno de los productos supera el stock disponible'
        };
      }

      // Si ninguno de los productos tiene una cantidad inválida, actualizamos el stock de cada producto
      for (const product of products) {
        await productModel.findByIdAndUpdate(product._id, { $inc: { stock: -product.stock } });
      }

      await tableModel.findByIdAndUpdate(tableId, { available: false }, { new: true })
      const newTicket = await ticketModel.create({ products, subTotal, total, tableId, userId })
      if (!newTicket) {
        return 'Error al crear el ticket'
      }
      return newTicket;
    }

    return {
      msg: 'No existen mesas con ese ID'
    }
  } catch (error) {
    console.log(error)
  }
}
export const updateTicket = async (id, products, subTotal, total, tableId, userId) => {
  try {
    // Encontrar el ticket actual
    const ticket = await ticketModel.findById(id);
    if (!ticket) {
      return {
        msg: 'El ticket no existe'
      };
    }

    // Objeto para almacenar la diferencia de stock
    const stockDifference = {};

    // Verificar si hay suficiente stock para los productos en el ticket y calcular la diferencia
    for (const product of products) {
      const originalProduct = ticket.products.find(p => p._id.toString() === product._id.toString());
      if (!originalProduct) {
        return {
          msg: `El producto ${product._id} no está en el ticket original`
        };
      }

      const diff = product.stock - originalProduct.stock;
      stockDifference[product._id] = diff;

      const productData = await productModel.findById(product._id);
      if (!productData) {
        return {
          msg: `No se encontró el producto ${product._id}`
        };
      }
      if (productData.stock + diff < 0) {
        return {
          msg: `No hay suficiente stock disponible para el producto ${product._id}`
        };
      }
    }

    // Actualizar el stock de los productos
    for (const productId in stockDifference) {
      await productModel.findByIdAndUpdate(productId, { $inc: { stock: -stockDifference[productId] } });
    }

    // Actualizar el ticket
    const ticketUpdate = await ticketModel.findByIdAndUpdate(id, { products, subTotal, total, tableId, userId }, { new: true });
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




export const getTickets = async () => {
  try {
    const tickets = await ticketModel.find()
    if (!tickets) {
      return {
        msg: 'no hay tickets creados'
      }
    }
    return tickets
  } catch (error) {
    console.log(error)
  }
}


export const getTicketById = async (id) => {
  try {
    const tableObjectId = mongoose.Types.ObjectId(id);
    const ticket = await ticketModel.findOne({ tableId: tableObjectId })
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

export const cancelAccount = async (id) => {
  try {
    const ticketCancel = await ticketModel.findByIdAndDelete(id, { new: true })
    if (!ticketCancel) {
      return {
        msg: "no hay ticket con ese id"
      }
    }
    for (const product of ticketCancel.products) {
      await productModel.findByIdAndUpdate(product._id, { $inc: { stock: + product.stock } });
    }

    return 'producto cancelado'
  } catch (error) {
    console.log(error)
  }
}
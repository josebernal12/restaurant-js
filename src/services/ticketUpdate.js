import ticketModel from "../model/TIcketModel.js";

export const updateTableTicket = async (id, table) => {
  try {
    const ticket = await ticketModel.findById(id)
    ticket.tableId = table
    await ticket.save()
    if (!ticket) {
      return {
        msg: "error updating ticket",
      };
    }
    return ticket;
  } catch (error) {
    console.log(error);
  }
};

export const updateWaiterTicket = async (id, waiter) => {
  try {
    const ticket = await ticketModel.findById(id);
    ticket.waiterId = waiter;
    await ticket.save();
    if (!ticket) {
      return {
        msg: "error updating ticket",
      };
    }
    return ticket;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProductTicket = async (id, productId) => {
  try {
    const ticket = await ticketModel.findById(id);
    ticket.products = ticket.products.filter(
      (value) => value._id.toString() !== productId.toString()
    );
    await ticket.save();
    return ticket;
  } catch (error) {
    console.log(error);
  }
};

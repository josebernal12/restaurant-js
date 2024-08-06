import ticketModel from "../model/TIcketModel";

export const updateTableTicket = async (id, table) => {
  try {
    const ticket = await ticketModel.findByIdAndUpdate(
      id,
      { tableId: table },
      { new: true }
    );
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
    const ticket = await ticketModel.findByIdAndUpdate(
      id,
      { waiterId: waiter },
      { new: true }
    );
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
      (value) => value._id !== productId
    );
    await ticket.save()
    return ticket
  } catch (error) {
    console.log(error);
  }
};

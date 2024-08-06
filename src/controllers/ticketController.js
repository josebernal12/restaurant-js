import {
  cancelAccount,
  completedAllProductTicket,
  completedProduct,
  createMultipleTickets,
  createTicket,
  deleteTicket,
  finishedTicket,
  getAllTickets,
  getTicketById,
  getTickets,
  joinAllProductsTicket,
  newUpdateTicket,
  receivedTicket,
  updateTicket,
} from "../services/ticket.js";
import {
  deleteProductTicket,
  updateTableTicket,
  updateWaiterTicket,
} from "../services/ticketUpdate.js";

export const createTicketController = async (req, res) => {
  const {
    products,
    subtotal,
    total,
    userId,
    waiter,
    waiterId,
    promotion,
    companyId,
  } = req.body;
  const { id } = req.params;

  const ticket = await createTicket(
    products,
    subtotal,
    total,
    id,
    userId,
    waiter,
    waiterId,
    promotion,
    companyId
  );
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const updateTicketController = async (req, res) => {
  const {
    products,
    subTotal,
    total,
    tableId,
    userId,
    waiterId,
    promotion,
    companyId,
  } = req.body;
  const { id } = req.params;

  const ticket = await newUpdateTicket(
    id,
    products,
    subTotal,
    total,
    tableId,
    userId,
    waiterId,
    promotion,
    companyId
  );

  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const getTicketsController = async (req, res) => {
  const query = {}; // Inicializar el objeto de consulta
  if (req.query.waiter) {
    query.waiter = { $regex: req.query.waiter, $options: "i" }; // 'i' para hacer la búsqueda case-insensitive
  }
  const tickets = await getTickets(query, req.user.companyId.toString());
  if (tickets?.msg) {
    res.status(404).json(tickets);
    return;
  }
  res.json(tickets);
};

export const getTicketsByIdController = async (req, res) => {
  const { id } = req.params;

  const ticket = await getTicketById(id);

  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const deleteTicketController = async (req, res) => {
  const { id } = req.params;
  const ticket = await deleteTicket(id);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const cancelTicketController = async (req, res) => {
  const { id } = req.params;
  const { tableId } = req.body;
  const message = await cancelAccount(id, tableId);
  if (message?.msg) {
    res.status(404).json(message);
    return;
  }
  res.json(message);
};

export const receivedTicketController = async (req, res) => {
  const { id } = req.params;

  const ticket = await receivedTicket(id);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};
export const finishedTicketController = async (req, res) => {
  const { id } = req.params;

  const ticket = await finishedTicket(id);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const completedProductController = async (req, res) => {
  const { id } = req.params;
  const { idProduct } = req.body;
  const ticket = await completedProduct(id, idProduct);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const completedAllProductTicketController = async (req, res) => {
  const { id } = req.params;
  const ticket = await completedAllProductTicket(id);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const joinAllProductsTicketController = async (req, res) => {
  const { id } = req.params;
  console.log(req.user);
  const ticket = await joinAllProductsTicket(id, req.user.companyId.toString());
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const getAllTicketsController = async (req, res) => {
  const tickets = await getAllTickets(req.user.companyId.toString());
  if (tickets?.msg) {
    res.status(404).json(tickets);
    return;
  }
  res.json(tickets);
};

export const createMultipleTicketsControlller = async (req, res) => {
  const { tickets } = req.body;

  const response = await createMultipleTickets(tickets);

  res.json(response);
};

export const updateTableTicketController = async (req, res) => {
  const { id } = req.params;
  const { tableId } = req.body;
  const ticket = await updateTableTicket(id, tableId);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const updateWaiterTicketController = async (req, res) => {
  const { id } = req.params;
  const { waiterId } = req.body;
  const ticket = await updateWaiterTicket(id, waiterId);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

export const deleteProductTicketController = async (req, res) => {
  const { id } = req.params;
  const { productId } = req.body;

  const ticket = await deleteProductTicket(id, productId);
  if (ticket?.msg) {
    res.status(404).json(ticket);
    return;
  }
  res.json(ticket);
};

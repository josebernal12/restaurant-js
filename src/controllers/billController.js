import { bestWaiter, generateBill, getBIllById, getBills, sells } from "../services/bill.js"

export const generateBillController = async (req, res) => {
  const { ticketId, userId } = req.body
  const { id } = req.params
  const bill = await generateBill(ticketId, id, userId)
  if (bill.msg) {
    res.status(400).json(bill)
    return
  }
  res.json(bill)
}

export const getBillsController = async (req, res) => {
  let page;
  let type;
  let name;
  let showAll;
  let quantity;
  if (req.query.page) {
    page = req.query.page
  }
  if (req.query.type) {
    type = req.query.type
  }
  if (req.query.name) {
    name = req.query.name
  }
  if (req.query.showAll) {
    showAll = req.query.showAll
  }
  if (req.query.quantity) {
    quantity = req.query.quantity
  }
  const bills = await getBills(page, type, name, showAll, quantity)
  if (bills.msg) {
    res.status(400).json(bills)
    return
  }
  res.json(bills)
}

export const getBillByIdController = async (req, res) => {
  const { id } = req.params
  const bill = await getBIllById(id)
  if (bill.msg) {
    res.status(400).json(bill)
    return
  }
  res.json(bill)
}

export const bestWaiterController = async (req, res) => {
  let type;
  if (req.query.type) {
    type = req.query.type
  }
  const bill = await bestWaiter(type)
  if (bill.msg) {
    res.status(400).json(bill)
    return
  }
  res.json(bill)
}


export const sellsController = async (req, res) => {
  let date;
  if (req.query.date) {
    date = req.query.date
  }
  const sellsTotal = await sells(date)
  if (sellsTotal.msg) {
    res.status(400).json(sellsTotal)
    return
  }
  res.json(sellsTotal)
}
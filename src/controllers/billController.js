import { bestWaiter, generateBill, getBIllById, getBillLastWeek, getBills, sells } from "../services/bill.js"

export const generateBillController = async (req, res) => {
  const { ticketId, userId, methodOfPayment } = req.body
  const { id } = req.params
  const bill = await generateBill(ticketId, id, userId, methodOfPayment)
  if (bill?.msg) {
    res.status(404).json(bill)
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
  let firstDate;
  let secondDate;
  if (req.query.page) {
    page = req.query.page
  }
  if (req.query.firstDate) {
    firstDate = req.query.firstDate
  }
  if (req.query.secondDate) {
    secondDate = req.query.secondDate
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
  const bills = await getBills(page, type, name, showAll, quantity, firstDate, secondDate)
  if (bills?.msg) {
    res.status(404).json(bills)
    return
  }
  res.json(bills)
}

export const getBillByIdController = async (req, res) => {
  const { id } = req.params
  const bill = await getBIllById(id)
  if (bill?.msg) {
    res.status(404).json(bill)
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
  if (bill?.msg) {
    res.status(404).json(bill)
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
  if (sellsTotal?.msg) {
    res.status(404).json(sellsTotal)
    return
  }
  res.json(sellsTotal)
}

export const getBillLastWeekController = async (req, res) => {
  let type;
  let page;
  if (req.query.type) {
    type = req.query.type
  }
  if (req.query.page) {
    page = req.query.page
  }
  console.log(type)
  const response = await getBillLastWeek(type, page)
  res.json(response)
}
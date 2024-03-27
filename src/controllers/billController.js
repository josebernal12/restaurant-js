import { generateBill, getBIllById, getBills } from "../services/bill.js"

export const generateBillController = async (req, res) => {
  const { ticketId } = req.body
  const { id } = req.params
  const user = req.user
  const bill = await generateBill(ticketId, id, user)
  res.json(bill)
}

export const getBillsController = async (req, res) => {
  let page;
  let type;
  let name;
  if (req.query.page) {
    page = req.query.page
  }
  if (req.query.type) {
    type = req.query.type
  }
  if (req.query.name) {
    name = req.query.name
  }
  const bills = await getBills(page, type, name)
  res.json(bills)
}

export const getBillByIdController = async (req, res) => {
  const { id } = req.params
  const bill = await getBIllById(id)
  res.json(bill)
}
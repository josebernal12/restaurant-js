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
  if (req.query.page) {
    page = req.query.page
  }
  if (req.query.type) {
    type = req.query.type
  }
  const bills = await getBills(page, type)
  res.json(bills)
}

export const getBillByIdController = async (req, res) => {
  const { id } = req.params
  const bill = await getBIllById(id)
  res.json(bill)
}
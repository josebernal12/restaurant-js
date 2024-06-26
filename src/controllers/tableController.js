import { availableTable, createTable, getTableById, getTables } from "../services/table.js"

export const availableTableController = async (req, res) => {
  const { available } = req.body
  const { id } = req.params

  const table = await availableTable(id, available)
  res.json(table)
}

export const createTableController = async (req, res) => {
  const { available, quantity } = req.body

  // const user = req.user
  const table = await createTable(available, quantity)
  res.json(table)
}

export const getTablesController = async (req, res) => {
  const { number } = req.query
  const tables = await getTables(number)
  res.json(tables)
}

export const getTableByIdController = async (req, res) => {
  const { id } = req.params
  const table = await getTableById(id)
  res.json(table)
}
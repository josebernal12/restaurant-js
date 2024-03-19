import tableModel from "../model/TableModel.js"


export const createTable = async (available) => {
  try {
    const table = await tableModel.create({ available })
    if (!table) {
      return 'error al crear la tabla'
    }
    return table
  } catch (error) {
    console.log(error)
  }
}

export const getTables = async () => {
  try {
    const table = await tableModel.find()
    if (!table) {
      return 'no hay mesas'
    }
    return table
  } catch (error) {
    console.log(error)
  }
}

export const getTableById = async (id) => {
  try {
    const table = await tableModel.findById(id)
    if (!table) {
      return 'no hay mesas con ese id'
    }
    return table
  } catch (error) {
    console.log(error)
  }
}

export const availableTable = async (id, available) => {
  try {
    const table = await tableModel.findByIdAndUpdate(id, { available }, { new: true })
    if (!table) {
      return 'error en la seleccion de la mesa'
    }
    return table
  } catch (error) {
    console.log(error)
  }
}



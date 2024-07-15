import tableModel from "../model/TableModel.js"

export const createTable = async (available, quantity, companyId) => {
  try {
    // Obtener el número máximo actual de mesa
    const maxNumberTable = await tableModel.findOne({ companyId }, {}, { sort: { number: -1 } }).select('number');

    // Si no hay mesas existentes, asignar 0 como número máximo
    const maxNumber = maxNumberTable ? maxNumberTable.number : 0;

    const tables = [];
    if (quantity) {
      for (let index = 0; index < Number(quantity); index++) {
        const number = maxNumber + index + 1; // Incrementar el número basado en el número máximo actual y la iteración
        const table = await tableModel.create({ available, number, companyId });
        tables.push(table);
      }
    } else {
      const table = await tableModel.create({ available, companyId });
      tables.push(table);
    }
    if (!tables.length) {
      return 'error al crear las tablas';
    }
    return tables;
  } catch (error) {
    console.log(error);
    throw error; // Re-lanzar el error para manejarlo en un contexto superior si es necesario
  }
};




export const getTables = async (number, companyId) => {
  try {

    if (number) {
      if (isNaN(number)) {
        return []
      }
      const table = await tableModel.find({ number, companyId })
      if (!table) {
        return 'no hay mesas con ese id'
      }
      return table
    }
    const table = await tableModel.find({ companyId })
    if (!table) {
      return []
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

export const availableTable = async (id, available, companyId) => {
  try {
    const table = await tableModel.findByIdAndUpdate(id, { available, companyId }, { new: true })
    if (!table) {
      return 'error en la seleccion de la mesa'
    }
    return table
  } catch (error) {
    console.log(error)
  }
}



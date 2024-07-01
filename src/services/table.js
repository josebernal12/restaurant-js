import tableModel from "../model/TableModel.js"

export const createTable = async (available, quantity) => {
  try {
    // Obtener el número máximo actual de mesa
    const maxNumberTable = await tableModel.findOne({}, {}, { sort: { number: -1 } }).select('number');

    // Si no hay mesas existentes, asignar 0 como número máximo
    const maxNumber = maxNumberTable ? maxNumberTable.number : 0;

    const tables = [];
    if (quantity) {
      for (let index = 0; index < Number(quantity); index++) {
        const number = maxNumber + index + 1; // Incrementar el número basado en el número máximo actual y la iteración
        const table = await tableModel.create({ available, number });
        tables.push(table);
      }
    } else {
      const table = await tableModel.create({ available });
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




export const getTables = async (number) => {
  try {
    if (isNaN(number)) {
      return {
        table: []
      }
    }
    if (number) {
      const table = await tableModel.find({ number })
      if (!table) {
        return 'no hay mesas con ese id'
      }
      return {table}
    }
    const table = await tableModel.find()
    if (!table) {
      return {
        table: []
      }
    }
    return {
      table
    }
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



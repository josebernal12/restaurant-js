import promotionModel from "../model/Promotion.js"

export const createPromotion = async (name, description, type, date, time, discount) => {
  try {
    if (!name || !description || !type) {
      return {
        msg: 'todos los campos son obligatorios'
      }
    }
    const promotion = await promotionModel.create({ name, description, type, date, time, discount })
    if (!promotion) {
      return {
        msg: 'error al crear la promocion'
      }
    }
    return promotion
  } catch (error) {
    console.log(error)
  }
}

export const updatePromotion = async (id, name, description, type, date, time, discount) => {
  try {
    if (!name || !description || !type) {
      return {
        msg: 'todos los campos son obligatorios'
      }
    }
    const promotion = await promotionModel.findByIdAndUpdate(id, { name, description, type, date, time, discount }, { new: true })
    if (!promotion) {
      return {
        msg: 'error al actualizar'
      }
    }
    return promotion
  } catch (error) {
    console.log(error)
  }
}

export const deletePromotion = async (id) => {
  try {
    const promotion = await promotionModel.findByIdAndDelete(id, { new: true })
    if (!promotion) {
      return {
        msg: 'no existe promocion con ese id'
      }
    }
    return promotion
  } catch (error) {
    console.log(error)
  }
}


export const getAllPromotion = async () => {
  try {
    const promotions = await promotionModel.find()
    if (!promotions) {
      return {
        promotions: []
      }
    }
    return promotions
  } catch (error) {
    console.log(error)
  }
}


export const getPromotionById = async (id) => {
  try {
    const promotion = await promotionModel.findById(id)
    if (!promotion) {
      return {
        msg: 'no existe promocion con ese id'
      }
    }
    return promotion
  } catch (error) {
    console.log(error)
  }
}
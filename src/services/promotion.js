import promotionModel from "../model/Promotion.js"

export const createPromotion = async (name, description, days, startHour, endHour, startDate, endDate, type, discount, active, image) => {
  try {
    if (!name || !description || !type) {
      return {
        msg: 'todos los campos son obligatorios'
      }
    }
    const promotion = await promotionModel.create({ name, description, days, startHour, endHour, startDate, endDate, type, discount, active, image })
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

export const updatePromotion = async (name, description, days, startHour, endHour, startDate, endDate, type, discount, active, image) => {
  try {
    if (!name || !description || !type) {
      return {
        msg: 'todos los campos son obligatorios'
      }
    }
    const promotion = await promotionModel.findByIdAndUpdate(id, { name, description, days, startHour, endHour, startDate, endDate, type, discount, active, image }, { new: true })
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
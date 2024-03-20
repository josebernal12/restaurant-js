import activitiesModel from "../model/ActivitiesRecently.js"

export const addActivities = async (message, date, description) => {
  try {
    const newActivitie = await activitiesModel.create({ activities: { message, date, description } })
    if (!newActivitie) {
      return {
        msg: 'error al crear la actividad'
      }
    }
    return newActivitie
  } catch (error) {
    console.log(error)
  }
}

export const getActivities = async () => {
  try {
    const activities = await activitiesModel.find().limit(10)
    if (!activities) {
      return {
        msg: 'no hay actividades recientes'
      }
    }

    return activities
  } catch (error) {
    console.log(error)
  }
}
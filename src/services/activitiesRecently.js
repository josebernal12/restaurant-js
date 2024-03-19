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
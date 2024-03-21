import { generateDate } from "../helpers/generateDate.js";
import activitiesModel from "../model/ActivitiesRecently.js"

export const addActivities = async (id, message, date, description) => {
  try {
    const activitie = await activitiesModel.findById(id)
    if (activitie) {
      const currentDate = new Date();
      const formattedDate = generateDate(currentDate)
      activitie.activities.push({ message, date, description, timestamp: formattedDate })
      activitie.save()
      const flattenedActivities = [].concat(...activitie.activities); // Aplanar el array de arrays

      const activitiesOrder = flattenedActivities.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp); // Orden descendente
      });
      return activitiesOrder
    } else {
      const currentDate = new Date();
      const formattedDate = generateDate(currentDate)
      const newActivitie = await activitiesModel.create({ activities: { message, date, description, timestamp: formattedDate } })
      if (!newActivitie) {
        return {
          msg: 'error al crear la actividad'
        }
      }
    
      return activitie
    }

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
    const activitiesMap = activities.map(value => value.activities);

    const flattenedActivities = [].concat(...activitiesMap); // Aplanar el array de arrays

    const activitiesOrder = flattenedActivities.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp); // Orden descendente
    });


    return activitiesOrder
  } catch (error) {
    console.log(error)
  }
}
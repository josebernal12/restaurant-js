import activitiesModel from "../model/ActivitiesRecently.js"

export const addActivities = async (id, message, date, description) => {
  try {
    const activitie = await activitiesModel.findById(id)
    if (activitie) {
      const currentDate = new Date();

      const year = currentDate.getFullYear();
      const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
      const day = ("0" + currentDate.getDate()).slice(-2);

      const hours = ("0" + currentDate.getHours()).slice(-2);
      const minutes = ("0" + currentDate.getMinutes()).slice(-2);
      const seconds = ("0" + currentDate.getSeconds()).slice(-2);

      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      activitie.activities.push({ message, date, description, timestamp: formattedDate })
      activitie.save()
      return activitie
    } else {
      const currentDate = new Date();

      const year = currentDate.getFullYear();
      const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
      const day = ("0" + currentDate.getDate()).slice(-2);

      const hours = ("0" + currentDate.getHours()).slice(-2);
      const minutes = ("0" + currentDate.getMinutes()).slice(-2);
      const seconds = ("0" + currentDate.getSeconds()).slice(-2);

      const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      const newActivitie = await activitiesModel.create({ activities: { message, date, description, timestamp: formattedDate } })

      if (!newActivitie) {
        return {
          msg: 'error al crear la actividad'
        }
      }
      return newActivitie
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

    // const date1 = new Date(dateString1);
    // const date2 = new Date(dateString2);

    // if (date1 < date2) {
    //   console.log(`${dateString1} es anterior a ${dateString2}`);
    // } else if (date1 > date2) {
    //   console.log(`${dateString1} es posterior a ${dateString2}`);
    // } else {
    //   console.log(`${dateString1} es igual a ${dateString2}`);
    // }
    return activitiesOrder
  } catch (error) {
    console.log(error)
  }
}
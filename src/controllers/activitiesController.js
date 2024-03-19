import { addActivities } from "../services/activitiesRecently.js"

export const addActivitiesController = async (req, res) => {
  const { message, date, description } = req.body
  const activitie = await addActivities(message, date, description)
  res.json(activitie)
}
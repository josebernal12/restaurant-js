import userModel from "../model/UserModel.js";


export const checkEmailInDB = async (email) => {
  try {
    console.log(email)
    const existEmail = await userModel.findOne({ email });
    console.log(existEmail)
    if (!existEmail) {
      return null;
    }
    return existEmail;
  } catch (error) {
    console.log(error);
    throw new Error("Error al buscar el usuario por correo electrónico.");
  }
}
// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs'
// import { root } from '../imagenes/imagenes.js';
// export default cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET,
//   secure: true
// });

// export function guardarImagen(imagePath, imagen) {
//   // Construir la ruta completa donde se guardará la imagen
//   const rutaCompleta = root + imagePath;
//   console.log(rutaCompleta)
//   // Guardar la imagen en el sistema de archivos
//   fs.writeFile(rutaCompleta, imagen, (error) => {
//     if (error) {
//       console.error('Error al guardar la imagen:', error);
//     } else {
//       console.log('Imagen guardada exitosamente:', rutaCompleta);
//     }
//   });
// }


// export const uploadImage = async (imagePath) => {
//   const options = {
//     use_filename: true,
//     unique_filename: false,
//     overwrite: true,

//   };
//   try {
//     // Upload the image
//     // const imagenBase64 = '...'; // Base64 de la imagen
//     // guardarImagen(imagePath, Buffer.from(imagenBase64, 'base64'))
//     const result = await cloudinary.uploader.upload(imagePath, options);
//     // console.log(result);
//     return result;
//   } catch (error) {
//     console.error(error);
//   }
// }


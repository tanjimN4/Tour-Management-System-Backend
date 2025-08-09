import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";

cloudinary.config({
    cloud_name:envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key:envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret:envVars.CLOUDINARY.CLOUDINARY_API_SECRET
})

export const deleteImageFromCloudinary = async (url:string) => {
     const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
     const match = url.match(regex);
     if (match && match[1]) {
       const publicId = match[1];
       await cloudinary.uploader.destroy(publicId);
     }
}

export const cloudinaryUpload=cloudinary

import { v2 as cloudinary } from "cloudinary";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload function for image uploads with transformations
export const uploadImageToCloudinary = async (
  file,
  folder,
  transformations = []
) => {
  try {
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary with the transformations
    const result = await new Promise((resolve, reject) => {
      const uploadOptions = {
        folder,
        resource_type: "image",
        transformation: transformations, // Apply transformations
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    return result;
  } catch (error) {
    throw new Error("Error uploading image to Cloudinary: " + error.message);
  }
};
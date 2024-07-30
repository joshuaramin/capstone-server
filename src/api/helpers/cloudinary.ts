import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_APIKEY,
  api_secret: process.env.CLOUD_SECRETKEY,
});

export const uploader = async (createReadStream: any) => {
  let result;
  return new Promise((resolve, reject) => {
    const image_uploader = cloudinary.uploader.upload_stream((err, result) => {
      if (err) throw new Error(err.message);
      resolve(result.url);
    });

    createReadStream.pipe(image_uploader);
  }).then((data: string) => {
    return (result = data);
  });
};

export const deleteCloudinaryImage = async () => {
  return new Promise((resolve, reject) => {
    const delete_image = cloudinary;
  });
};

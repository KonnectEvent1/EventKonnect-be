import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

export const CloudinaryStorageConfig = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async () => ({
    folder: 'EventKonnect_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  }),
});

'use server';

import { v2 as cloudinary } from 'cloudinary';

console.log('Cloudinary Config Check:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
    api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export async function uploadImage(fileBase64: string) {
    try {
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (!cloudName) {
            throw new Error('Cloudinary Cloud Name is missing from environment variables');
        }

        const result = await cloudinary.uploader.upload(fileBase64, {
            folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'parfum_antique',
        });
        return result.secure_url;
    } catch (error: any) {
        console.error('Cloudinary upload error:', error.message || error);
        throw new Error(error.message || 'Failed to upload image to Cloudinary');
    }
}

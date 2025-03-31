require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("node:fs");
// IIFE
// (() => {

// })();

class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async uploadFile(filepath, folder = "") {
        try {
            const response = await cloudinary.uploader.upload(filepath, {
                unique_filename: true,
                folder: "/boundles-moments/" + folder,
            });
            fs.unlinkSync(filepath);

            return {
                secure_url: response.secure_url,
                optimized_url: cloudinary.url(response.public_id, {
                    fetch_format: "auto",
                    quality: "auto",
                }),
            };
        } catch (exception) {
            throw {
                code: 500,
                message: "Cloudinary File upload error",
                status: "SERVER_ERROR",
                detail: null,
            };
        }
    }
}
const cloudinarySvc = new CloudinaryService();
module.exports = cloudinarySvc;

import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: 'CLOUDINARY_CLOUD_NAME', 
    api_key: 'CLOUDINARY_API_KEY', 
    api_secret: 'CLOUDINARY_API_SECRET' 
});

const uploadToCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        //upload file to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
        //file has been uploaded successfully
        console.log("File has been uploaded to cloudinary", response.url);
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // removes the file as the operation got failed
        return null
    }
}


export {uploadToCloudinary}
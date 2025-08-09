import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js"

const registerUser = asyncHandler( async (req, res) => {
    const { fullName, email, username, password } = req.body
    console.log("email:" ,email);

    if([fullName, email, username, password].some((field) => field?.trim() === "")){
        throw new apiError(400, "All fields are required") 
    }

    const existingUser = User.findOne({
        $or: [{username},{email}]
    })

    if(existingUser){
        throw new apiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath) throw new apiError(400, "Avatar is required")
    
    const avatar = await uploadToCloudinary(avatarLocalPath)
    const coverImage = await uploadToCloudinary(coverImageLocalPath)

    if(!avatar) throw new apiError(400, "Avatar is required")

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new apiError(500, "Something went wrong while registering")
    }

    return res.status(201).json(
        new apiResponse(201, createdUser, "User created successfully")
    )
})


export {registerUser}
const User = require('../models/userSchema');
const { uploadFileToCloudinary } = require('../utils/fileUpload');

exports.getAllusers = async (req, res) => {
    try {
        const id = req.user.id;
        const allUsers = await User.find({ _id: { $ne: id } });
        return res.status(200).json({
            success: true,
            message: "All Users fetched",
            allUsers
        })
    } catch (error) {
        return res.status(500).json({
            succes: false,
            message: "Internal Sever Error in Fetching Users",
            Error: error.message
        })
    }
}

exports.getMyProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);
        user.password = undefined;
        return res.status(200).json({
            success: true,
            message: "user details fetched",
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in User details fetching",
            Error: error.message
        })
    }
}

exports.updateProfilePic = async (req, res) => {
    try {
        const { id } = req.user;
        if (!req.files || !req.files.file) {
            return res.status(400).json({
                success: false,
                message: "Please select an image ..."
            })
        }

        const file = req.files.file;
        const imageResponse = await uploadFileToCloudinary(file, 'chatApp', 40);

        const response = await User.findByIdAndUpdate(id,
            {
                profilePic: imageResponse.url
            },
            { new: true }
        )

        return res.status(200).json({
            success: true,
            response
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server Error in Updating Image",
            Error: error.message
        })
    }
}
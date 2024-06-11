const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
        },
        attachment: {
            fileUrl: {
                type: String,
            },
            fileType: {
                type: String,
                enum: ['image', 'audio', 'video', 'pdf', 'none']
            }
        }
    },
    { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
module.exports=Message;
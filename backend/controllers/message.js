const Conversation = require('../models/conversationSchema');
const User = require('../models/userSchema');
const Message = require('../models/messageSchema');
const { getReceiverSocketId, io } = require('../socket/socket');
const { uploadFileToCloudinary } = require('../utils/fileUpload');


exports.sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Please Enter message to Send"
            })
        }
        if (!senderId || !receiverId) {
            return res.status(400).json({
                succes: false,
                message: "Add sender and receiver Id"
            })
        }
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);
        if (!sender || !receiver) {
            return res.status(401).json({
                success: false,
                message: "Sender or Receiver DoesNot Exits"
            })
        }
        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            attachment: {
                fileUrl: null,
                fileType: 'none'
            }
        });
        await newMessage.save();
        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
        }
        await gotConversation.save();

        //socket io code form here...
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        // console.log(receiverSocketId);

        return res.status(200).json({
            success: true,
            message: "Message Sent successfully",
            newMessage
        })

    } catch (error) {
        return res.status(500).json({
            succes: false,
            message: "Internal Sever Error in Sending Message",
            Error: error.message
        })
    }
}

exports.getMessage = async (req, res) => {
    try {
        const senderId = req.params.id;
        const receiverId = req.user.id;
        const getConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages");

        return res.status(200).json({
            success: true,
            message: "All conversation fetched",
            allConversation: getConversation
        })

    } catch (error) {
        return res.status(500).json({
            succes: false,
            message: "Internal Sever Error in Receiving Message",
            Error: error.message
        })
    }
}

exports.sendAttachment = async (req, res) => {
    try {
        const senderId = req.user.id;
        const receiverId = req.params.id;

        if (!req.files || !req.files.file) {
            return res.status(403).json({
                success: false,
                message: "Please Choose a file to Send"
            })
        }
        let file = req.files.file;

        if (file.length > 1) {
            file = file[0];
        }
        let fileType = file.name.split('.');
        fileType = (fileType[fileType.length - 1]).toString();
        const supportedFileType = ['jpg', 'jpeg', 'png', 'mp3', 'mp4'];

        if (!supportedFileType.includes(fileType)) {
            return res.status(404).json({
                success: false,
                message: "File Type does not Supported"
            })
        }
        let incomingFileType = 'none';
        if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png') {
            incomingFileType = "image";
        } else if (fileType === 'mp3') {
            incomingFileType = "audio"
        } else if (fileType === 'mp4') {
            incomingFileType = "video";
        }

        if (file.size / (1024 * 1024) >= 10) {
            return res.status(405).json({
                success: false,
                message: "File Should be less then 10MB"
            })
        }

        if (!senderId || !receiverId) {
            return res.status(400).json({
                succes: false,
                message: "Add sender and receiver Id"
            })
        }
        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        if (!sender || !receiver) {
            return res.status(401).json({
                success: false,
                message: "Sender or Receiver DoesNot Exits"
            })
        }

        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        const attachment = await uploadFileToCloudinary(file, 'Sout-Chat', 80);

        const newMessage = new Message({
            senderId,
            receiverId,
            message: null,
            attachment: {
                fileUrl: attachment.url,
                fileType: incomingFileType
            }
        });
        await newMessage.save();
        if (newMessage) {
            gotConversation.messages.push(newMessage._id);
        }
        await gotConversation.save();

        //socket io code form here...
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(200).json({
            success: true,
            message: "Message Sent Successfully",
            newMessage
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in file handling",
            Error: error.message
        })
    }
}
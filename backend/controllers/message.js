const Conversation = require('../models/conversationSchema');
const User = require('../models/userSchema');
const Message = require('../models/messageSchema');
const { getReceiverSocketId, io } = require('../socket/socket');


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
            message
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
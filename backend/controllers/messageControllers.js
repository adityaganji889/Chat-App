const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = async(req,res) => {
    try{
       const user = await User.findOne({ _id: req.body.userid });
       if(user){
         const { content, chatId } = req.body;
         if(!content || !chatId){
            return res.send({
                data: null,
                message: "Invalid data passed into request",
                success: false
            })
         }
         
         try{
            var newMessage = {
                sender: user._id,
                content: content,
                chat: chatId
             }
    
             var message = await Message.create(newMessage);
             message = await message.populate("sender","name profilePicture");
             message = await message.populate("chat");
             message = await User.populate(message,{
                path: 'chat.users',
                select: 'name profilePicture email'
             })
    
             await Chat.findByIdAndUpdate(req.body.chatId, {
                latestMessage: message
             })
    
             res.send({
                data: message,
                message: "Your Message Sent Successfully",
                success: true
             })
         }
         catch(error){
            res.send({
                data: error,
                message: error.message,
                success: false
            })       
         }
       }
       else{
        res.send({
            data: null,
            message: "Not logged in user",
            success: false
        })    
       }
    }
    catch(error){
        res.send({
            data: error,
            message: error.message,
            success: false
        })
    }
}

const allMessages = async(req,res) => {
    try{
      const user = await User.findOne({ _id: req.body.userid });
      if(user){
         const messages = await Message.find({chat: req.params.chatId}).populate("sender","name profilePicture email").populate("chat");
         if(messages.length>0){
            res.send({
                data: messages,
                message: "All messages of the selected chat fetched successfully.",
                success: true
            })
         }
         else{
            res.send({
                data: null,
                message: "No conversations yet in the selected chat.",
                success: false
            })
         }
      }
    }
    catch(error){
        res.send({
            data: error,
            message: error.message,
            success: false
        })
    }
}

module.exports = { sendMessage, allMessages }
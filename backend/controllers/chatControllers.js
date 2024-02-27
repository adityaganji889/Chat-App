const Chat = require("../models/chatModel");
const User = require("../models/userModel");



const allUsers = async(req,res) => {
    try{
       //i -> case insensitive 
       const keyword = req.query.search ? {
         $or: [
            { name: { $regex: req.query.search, $options: "i"}}, 
            { email: {$regex: req.query.search, $options: "i"}},
         ]
       } : {};
       const user = await User.findOne({ _id: req.body.userid })
       const users = await User.find(keyword).find({ _id: { $ne: user._id }});
       if(users.length!=0){
          res.send({
            data: users,
            message: "Searched users fetched successfully",
            success: true
          })
       }
       else{
          res.send({
            data: null,
            message: "No users present with searched query",
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


const accessChat = async(req,res) => {
   try{
     const user = await User.findOne({ _id: req.body.userid });
     if(user){
        var isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                {users:{$elemMatch:{$eq:user._id}}},
                {users:{$elemMatch:{$eq:req.body._id}}},
            ]
        }).populate("users","-password").populate("latestMessage");
        isChat = await User.populate(isChat, {
            path: "latestMessage.sender",
            select: "name profilePicture email"
        });

        if(isChat.length>0){
            res.send({
                data: isChat[0],
                message: "Chat already exists.",
                success: true
            })
        }
        else{
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [user._id,req.body._id]
            };
            try{
                const createdChat = await Chat.create(chatData);
                const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users","-password");
                res.send({
                    data: FullChat,
                    message: "New Chat Created Successfully",
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
     }

   } catch(error){
        res.send({
            data: error,
            message: error.message,
            success: false
        })
    }
}

const fetchChats = async(req,res) => {
    try{
     const user = await User.findOne({ _id: req.body.userid });
     if(user){
        var chats = await Chat.find({users:{$elemMatch:{$eq:user._id}}}).populate("users","-password").populate("latestMessage").populate("groupAdmin","-password").sort({updatedAt: -1});
        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name pic email",
        });
        if(chats.length>0){
            res.send({
                data: chats,
                message: "All Your Chats Fetched Successfully",
                success: true
            })
        }
        else{
            res.send({
                data: null,
                message: "You have no chats",
                success: false
            }) 
        }
     }
    } catch(error){
        res.send({
            data: error,
            message: error.message,
            success: false
        })
    }
}

const createGroupChat = async(req,res) => {
    try{
      const user = await User.findOne({ _id: req.body.userid });
      if(user){
        if(!req.body.users || !req.body.name)
        {
            res.send({
                data: null,
                message: "Please fill all the fields",
                success: false
            })
        }
        else{
            var users = JSON.parse(req.body.users);
            if(users.length>2){
                return res.send({
                    data: null,
                    message: "More than 2 users are required to form a group chat",
                    success: false
                })
            }
            users.push(user._id);
            const adminsList = [];
            adminsList.push(user._id);
            try{
                const groupChat = await Chat.create({
                    chatName: req.body.name,
                    users: users,
                    isGroupChat: true,
                    groupAdmin: adminsList
                });

                const FullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users","-password").populate("groupAdmin","-password");
                res.send({
                    data: FullGroupChat,
                    message: "New Group Chat Created Successfully",
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
      }
    } catch(error){
        res.send({
            data: error,
            message: error.message,
            success: false
        })
    }
}

const renameGroup = async(req,res) => {
    try{
       const user = await User.findOne({ _id: req.body.userid });
       if(user){
         const  { chatId, chatName } = req.body;
         const chat = await Chat.findOne({ _id: chatId, isGroupChat: true, groupAdmin:{$elemMatch:{$eq:user._id}}}).populate("users","-password").populate("groupAdmin","-password");
         if(chat){
            const updatedChat = await Chat.findByIdAndUpdate(
                chatId,
                {
                    chatName,
                },
                {new: true}
             ).populate("users","-password").populate("groupAdmin","-password");
             if(!updatedChat){
                res.send({
                    data: null,
                    message: "Chat doesnot exists.",
                    success: false
                })
             }
             else{
                res.send({
                    data: updatedChat,
                    message: "Group Chat Name updated Successfully",
                    success: true
                })
             }
         }
         else{
            res.send({
                data: null,
                message: "Not a Group Chat/ Not a Group Admin trying to change the Group Name",
                success: false
            })
         }
       }
    } catch(error){
        res.send({
            data: error,
            message: error.message,
            success: false
        })
    }
}

const removeFromGroup = async(req,res) => {
    try{
        const user = await User.findOne({ _id: req.body.userid });
        if(user){
          const  { chatId, userId } = req.body;
          const chat = await Chat.findOne({ _id: chatId, isGroupChat: true, groupAdmin:{$elemMatch:{$eq:user._id}}}).populate("users","-password").populate("groupAdmin","-password");
          if(chat){
            const alreadyRemoved = await Chat.findOne({ _id: chatId, users:{$elemMatch:{$eq:userId}}});
            if(!alreadyRemoved){
               return res.send({
                   data: null,
                   message: "Selected User already removed from the group",
                   success: false
               })
            }
            const alreadyRemovedAdmin = chat.groupAdmin.filter((u)=>u._id==userId);
            var deleted;
            if(alreadyRemovedAdmin.length>0){
                deleted = await Chat.findByIdAndUpdate(
                    chatId,
                    { $pull: { users: userId, groupAdmin: userId }},
                    {new: true}
                 ).populate("users","-password").populate("groupAdmin","-password");
            }
            else {
                deleted = await Chat.findByIdAndUpdate(
                    chatId,
                    { $pull: { users: userId }},
                    {new: true}
                 ).populate("users","-password").populate("groupAdmin","-password");
            }
              if(!deleted){
                 res.send({
                     data: null,
                     message: "Chat doesnot exists.",
                     success: false
                 })
              }
              else{
                 res.send({
                     data: deleted,
                     message: "Selected User removed from group successfully",
                     success: true
                 })
              }
          }
          else{
             res.send({
                 data: null,
                 message: "Not a Group Chat/ Not a Group Admin trying to remove the existing user from the Group",
                 success: false
             })
          }
        }
     } catch(error){
         res.send({
             data: error,
             message: error.message,
             success: false
         })
     }
}

const addToGroup = async(req,res) => {
    try{
        const user = await User.findOne({ _id: req.body.userid });
        if(user){
          const  { chatId, userId } = req.body;
          const chat = await Chat.findOne({ _id: chatId, isGroupChat: true, groupAdmin:{$elemMatch:{$eq:user._id}}}).populate("users","-password").populate("groupAdmin","-password");
          if(chat){
            const alreadyAdded = await Chat.findOne({ _id: chatId, users:{$elemMatch:{$eq:userId}}});
             if(alreadyAdded){
                return res.send({
                    data: null,
                    message: "Selected User already present in the group",
                    success: false
                })
             }
             const added = await Chat.findByIdAndUpdate(
                 chatId,
                 { $push: { users: userId }},
                 {new: true}
              ).populate("users","-password").populate("groupAdmin","-password");
              if(!added){
                 res.send({
                     data: null,
                     message: "Chat doesnot exists.",
                     success: false
                 })
              }
              else{
                 res.send({
                     data: added,
                     message: "Selected User added to group successfully",
                     success: true
                 })
              }
          }
          else{
             res.send({
                 data: null,
                 message: "Not a Group Chat/ Not a Group Admin trying to add the new user in Group",
                 success: false
             })
          }
        }
     } catch(error){
         res.send({
             data: error,
             message: error.message,
             success: false
         })
     }
}


const addNewAdminToGroup = async(req,res) => {
    try{
        const user = await User.findOne({ _id: req.body.userid });
        if(user){
          const  { chatId, userId } = req.body;
          const chat = await Chat.findOne({ _id: chatId, isGroupChat: true, groupAdmin:{$elemMatch:{$eq:user._id}}}).populate("users","-password").populate("groupAdmin","-password");
          const isUserThereInGroup = chat.users.filter((u)=>u._id==userId);
          if(isUserThereInGroup.length===0){
                return res.send({
                    data: null,
                    message: "No such user present in the group",
                    success: false
                })
          }
          if(chat && user._id.toString()!= userId.toString()){
             const isPresent = chat.users.filter((u)=>u._id==userId);
             const alreadyAdmin = chat.groupAdmin.filter((u)=>u._id==userId);
             if(alreadyAdmin.length>0){
                return res.send({
                    data: null,
                    message: "Already an admin user",
                    success: false
                })
             }
             if(isPresent.length>0){
             const addedNewAdmin = await Chat.findByIdAndUpdate(
                 chatId,
                 { $push: { groupAdmin: userId }},
                 {new: true}
              ).populate("users","-password").populate("groupAdmin","-password");
              if(!addedNewAdmin){
                return res.send({
                     data: null,
                     message: "Chat doesnot exists.",
                     success: false
                 })
              }
              else{
                 res.send({
                     data: addedNewAdmin,
                     message: "Selected User added to group admin successfully",
                     success: true
                 })
              }
            }
          }
          else{
             res.send({
                 data: null,
                 message: "Not a Group Chat/ Not a Group Admin trying to add the new Admin to Group",
                 success: false
             })
          }
        }
     } catch(error){
         res.send({
             data: error,
             message: error.message,
             success: false
         })
     }
}

const removeExistingAdminFromGroup = async(req,res) => {
    try{
        const user = await User.findOne({ _id: req.body.userid });
        if(user){
          const  { chatId, userId } = req.body;
          const chat = await Chat.findOne({ _id: chatId, isGroupChat: true, groupAdmin:{$elemMatch:{$eq:user._id}}}).populate("users","-password").populate("groupAdmin","-password");
          if(chat && user._id.toString()!= userId.toString()){
             const isPresent = chat.users.filter((u)=>u._id==userId);
             const alreadyRemovedAdmin = chat.groupAdmin.filter((u)=>u._id==userId);
             if(alreadyRemovedAdmin.length==0){
                return res.send({
                    data: null,
                    message: "Already removed admin user",
                    success: false
                })
             }
             if(isPresent.length>0){
             const removeExistingAdmin = await Chat.findByIdAndUpdate(
                 chatId,
                 { $pull: { groupAdmin: userId }},
                 {new: true}
              ).populate("users","-password").populate("groupAdmin","-password");
              if(!removeExistingAdmin){
                 res.send({
                     data: null,
                     message: "Chat doesnot exists.",
                     success: false
                 })
              }
              else{
                 res.send({
                     data: removeExistingAdmin,
                     message: "Selected User removed from group admin successfully",
                     success: true
                 })
              }
          }
          else{
             res.send({
                 data: null,
                 message: "Not a Group Chat/ Not a Group Admin trying to remove the existing admin from Group",
                 success: false
             })
          }
        }
      } 
     } catch(error){
         res.send({
             data: error,
             message: error.message,
             success: false
         })
     }
}

const LeaveFromGroup = async(req,res) => {
    try{
        const user = await User.findOne({ _id: req.body.userid });
        if(user){
          const  { chatId } = req.body;
          const chat = await Chat.findOne({ _id: chatId, isGroupChat: true, users:{$elemMatch:{$eq:user._id}}}).populate("users","-password").populate("groupAdmin","-password");
          if(chat){
            const alreadyLeft = chat.users.filter((u)=>u._id.toString()==user._id.toString());
            const alreadyAdmin = chat.groupAdmin.filter((u)=>u._id.toString()==user._id.toString());
            if(alreadyLeft.length == 0){
               return res.send({
                   data: null,
                   message: "You already left the group",
                   success: false
               })
            }
            var deleted;
             if(alreadyAdmin.length>0 && chat.groupAdmin.length>1){
                deleted = await Chat.findByIdAndUpdate(
                    chatId,
                    { $pull: { users: user._id, groupAdmin: user._id }},
                    {new: true}
                 ).populate("users","-password").populate("groupAdmin","-password");
             }
             else if(alreadyAdmin.length>0 && chat.groupAdmin.length<2){
                return res.send({
                    data: null,
                    message: "You cannot leave the group before assigning more admins",
                    success: false
                })
             }
             else{
                deleted = await Chat.findByIdAndUpdate(
                    chatId,
                    { $pull: { users: user._id }},
                    {new: true}
                 ).populate("users","-password").populate("groupAdmin","-password");
             }
              if(!deleted){
                 res.send({
                     data: null,
                     message: "Chat doesnot exists.",
                     success: false
                 })
              }
              else{
                 res.send({
                     data: deleted,
                     message: "You left from group successfully",
                     success: true
                 })
              }
          }
          else{
             res.send({
                 data: null,
                 message: "Not a Group Chat/ Not a Group Admin trying to remove the existing user from the Group",
                 success: false
             })
          }
        }
     } catch(error){
         res.send({
             data: error,
             message: error.message,
             success: false
         })
     }
}


module.exports = { allUsers, accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup, addNewAdminToGroup, removeExistingAdminFromGroup, LeaveFromGroup }
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetSelectedChat, SetNotification } from "../redux/chatsSlice";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import UpdateGroupAdminModal from "./UpdateGroupAdminModal";
import { message } from "antd";
import { allMessagesOfChat, sendNewMessage } from "../apicalls/messages";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "https://chat-app-krc2.onrender.com/";
// const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

function SingleChat({
  fetchAgain,
  setFetchAgain,
  onlineUsers,
  setOnlineUsers,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const { selectedChat, notification } = useSelector((state) => state.chats);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const response = await allMessagesOfChat(selectedChat._id);
      if (response.success) {
        setTimeout(() => {
          setLoading(false);
          message.success(response.message);
          setMessages(response.data);
          socket.emit("join chat", selectedChat._id);
        }, 500);
      } else {
        setTimeout(() => {
          setLoading(false);
          message.info(response.message);
          setMessages([]);
          socket.emit("join chat", selectedChat._id);
        }, 500);
      }
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        message.error(error.message);
      }, 500);
    }
  };
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const payload = {
          content: newMessage,
          chatId: selectedChat._id,
        };
        setNewMessage("");
        const response = await sendNewMessage(payload);
        if (response.success) {
          setTimeout(() => {
            message.success(response.message);
            socket.emit("new message", response.data);
            setMessages([...messages, response.data]);
          }, 500);
        } else {
          setTimeout(() => {
            message.info(response.message);
          }, 500);
        }
      } catch (error) {
        setTimeout(() => {
          message.error(error.message);
        }, 500);
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    socket.emit("came-online", user._id);
    socket.on("online-users-updated", (users) => {
      setOnlineUsers(users);
    });
    return () => {
      // socket.disconnect();
      // Remove event listeners when component unmounts
      socket.emit("went-offline", user._id);
      socket.on("online-users-updated", (users) => {
        setOnlineUsers(users);
      });
    };
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // Give Notification received message from other chat than the currently selected chat
        if (!notification.includes(newMessageReceived)) {
          dispatch(SetNotification([newMessageReceived, ...notification]));
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    //Typing indicator logic
    if (!socketConnected) {
      return;
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "1.5rem", md: "2rem" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => {
                dispatch(SetSelectedChat(null));
                setFetchAgain(!fetchAgain);
              }}
            />
            {!selectedChat.isGroupChat ? (
              <>
                <Box display="flex" alignItems="center" gap={2}>
                  {getSender(user, selectedChat.users)}
                  {onlineUsers.includes(getSenderFull(user, selectedChat.users)._id) && <Text fontSize="xs" pt={3}>🟢</Text>}
                </Box>
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <div className="d-flex gap-2">
                  <UpdateGroupAdminModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </div>
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <lottie-player
                    src="https://lottie.host/0dcc5be7-9f6a-4226-b918-5aed19d4ff13/sOC5a0Z4Qr.json"
                    background="##FFFFFF"
                    speed="1"
                    style={{ width: "30%", height: "20%" }}
                    loop
                    autoplay
                  ></lottie-player>
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="white"
                placeholder="Enter a message.."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;

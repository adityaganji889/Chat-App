import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HideChatLoading,
  SetListChats,
  SetSelectedChat,
  ShowChatLoading,
} from "../redux/chatsSlice";
import { fetchChats } from "../apicalls/chats";
import { message } from "antd";
import { Flex, Box, Button, Avatar, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import GroupChatModal from "./GroupChatModal";
import {
  getSender,
  getSenderFull,
  latestMessageSender,
} from "../config/ChatLogics";
import moment from 'moment';

function MyChats({ fetchAgain }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const { selectedChat, chatLoading, listChats } = useSelector(
    (state) => state.chats
  );
  //   const getSender = (users) => {
  //         return users[0]._id === user._id ? users[1].name : users[0].name;
  //   }
  //   const [chats, setChats] = useState([]);
  const fetchChatsData = async () => {
    try {
      dispatch(ShowChatLoading());
      message.loading("Getting Your Chats...", 0.5);
      const response = await fetchChats();
      if (response.success) {
        setTimeout(() => {
          dispatch(HideChatLoading());
          dispatch(SetListChats(response.data));
          // setChats(response.data);
          message.success(response.message);
        }, 500);
      } else {
        setTimeout(() => {
          dispatch(HideChatLoading());
          message.info(response.message);
        }, 500);
      }
    } catch (error) {
      setTimeout(() => {
        dispatch(HideChatLoading());
        message.error(error.message);
      }, 500);
    }
  };
  useEffect(() => {
    fetchChatsData();
  }, [fetchAgain]);
  return (
    <Flex
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "45%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Flex
        pb={3}
        fontSize={{ base: "1.5rem", md: "2rem" }}
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "1rem", md: "0.75rem", lg: "1rem" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Flex>
      {listChats &&
        listChats.map((chat) => {
          return (
            <Box
              display="flex"
              onClick={() => {
                // dispatch(SetSelectedChat(null));
                dispatch(SetSelectedChat(chat));
              }}
              key={chat._id}
              cursor="pointer"
              bg={selectedChat === chat ? "#1d4fce" : "#E8E8E8"}
              color={selectedChat === chat ? "white" : "black"}
              _hover={{
                background: "#1d4fce",
                color: "white",
              }}
              w="100%"
              alignItems="center"
              px={3}
              py={2}
              mb={2}
              borderRadius="lg"
            >
              <Avatar
                mr={2}
                size="sm"
                cursor="pointer"
                name={chat.chatName}
                src={
                  !chat.isGroupChat
                    ? getSenderFull(user, chat.users).profilePicture
                    : chat.chatName
                }
              />
              <Box>
                <Text>
                  {!chat.isGroupChat
                    ? getSender(user, chat.users)
                    : chat.chatName}
                </Text>
                {chat?.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender?.name} : </b>
                    {chat.latestMessage.content?.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
              <Box m={2}>
                <Text></Text>
                <Text></Text>
                <Text fontSize="xs">
                  {moment(chat.latestMessage.createdAt).format("DD/MM/YYYY hh:mm A")}
                </Text>
              </Box>
            </Box>
          );
        })}
    </Flex>
  );
}

export default MyChats;

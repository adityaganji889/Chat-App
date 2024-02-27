import { Box, Tooltip, Button, Text, Menu, MenuButton, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, MenuList, MenuItem } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {BellIcon} from "@chakra-ui/icons";
import {useDisclosure} from "@chakra-ui/hooks"
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { accessParticularChat, allUsers } from "../apicalls/chats";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { SetSelectedChat, ShowChatLoading, HideChatLoading, SetListChats, SetNotification } from "../redux/chatsSlice";
import { latestMessageSender } from "../config/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
// import Loader from './Loader';

function SideDrawer({ fetchAgain, setFetchAgain }) {
  const dispatch = useDispatch();
  const {chatLoading,selectedChat,listChats,notification} = useSelector(state=>state.chats);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleSearch = async() => {
   if(!search){
     setSearchResult([]);
     message.info("Please Enter something in search",2);
   }
   else{
    try{
        dispatch(ShowChatLoading());
        const response = await allUsers(search);
        if(response.success){
          setTimeout(()=>{
              dispatch(HideChatLoading());
              message.success(response.message);
              setSearchResult(response.data);
          },500)
        }
        else{
          setTimeout(()=>{
              HideChatLoading();
              message.info(response.message);
              // setSearchResult(response.data);
          },500)
        }
  
     }catch(error){
      setTimeout(()=>{
          HideChatLoading();
          message.error(error.message);
          // setSearchResult(response.data);
      },500)
     }
   }
  }
  const accessChat = async(payload) => {
    try{
      const obj = {
        _id: payload
      }
      dispatch(ShowChatLoading());
      const response = await accessParticularChat(obj);
      if(response.success){
        setTimeout(()=>{
          message.success(response.message);
          dispatch(SetSelectedChat(response.data));
          dispatch(HideChatLoading());
          setFetchAgain(true);
        //   if(!listChats?.find((c)=> c._id === response.data._id)) {
        //     SetListChats([response.data, ...listChats]);
        //   }
          onClose();
        //   window.location.href="/home";
        //   setFetchAgain(false);
        },500)
      }
      else{
        setTimeout(()=>{
            message.info(response.message);
            dispatch(HideChatLoading());
          },500)
      }
    }
    catch(error){ 
        setTimeout(()=>{
            message.error(error.message);
            dispatch(HideChatLoading());
          },500)
    }
  }
//   useEffect(()=>{
//     handleSearch();
//   },[search]);
  return (
    <>
    <div className="d-flex align-items-center justify-content-between">
      <Box>
        <Tooltip label="Search Users to chat" hasArrow>
          <Button variant="ghost" onClick={onOpen}>
            <i class="ri-search-line"></i>
            <Text my="2" px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
      </Box>
      <Text fontSize="2xl">We Chat</Text>
      <div>
        <Menu>
          <MenuButton p={1}>
            <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
            <BellIcon fontSize="2xl" m={1}/>
          </MenuButton>
          <MenuList pl={2}>
            {!notification.length && "No New Messages"}
            {notification&&notification.map((notif) => (
              <MenuItem key={notif._id} onClick={()=>{
                dispatch(SetSelectedChat(notif.chat));
                dispatch(SetNotification(notification.filter((n) => n !== notif)));
              }}>
                {notif.chat.isGroupChat?`New Message in ${notif.chat.chatName}`:`New Message from ${latestMessageSender(notif.sender,notification.chat.users)}`}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </div>
    </div>
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
     <DrawerOverlay/>
     <DrawerContent>
        <DrawerHeader borderBottomWidth="1px">
            Search Users
        </DrawerHeader>
        <DrawerBody>
            <div className="d-flex pb-2">
                <Input placeholder="Search by name or email" mr={2} value={search} onChange={(e)=> {
                    setSearch(e.target.value)
                }}/>
                  <Button onClick={handleSearch}>Go</Button>
            </div>
            {(searchResult.length==0) ? (
              <ChatLoading/>
            ): (
              searchResult?.map(user=>(
                <UserListItem 
                    key={user._id}
                    user={user}
                    handleFunction={()=>accessChat(user._id)}
                />
              ))
            )}
        </DrawerBody>
     </DrawerContent>
    </Drawer>
    </>
  );
}

export default SideDrawer;

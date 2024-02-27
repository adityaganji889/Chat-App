import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    Input,
    useToast,
    Box,
  } from "@chakra-ui/react";
  import axios from "axios";
  import { useState } from "react";
//   import { ChatState } from "../../Context/ChatProvider";
  import UserBadgeItem from "./UserBadgeItem";
  import UserListItem from "./UserListItem";
import { useDispatch, useSelector } from "react-redux";
import { SetListChats } from "../redux/chatsSlice";
import { allUsers, createGroupChat } from "../apicalls/chats";  
import { message } from "antd";

  const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const dispatch = useDispatch();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const {user} = useSelector(state=>state.users);
    const { listChats } = useSelector(state=>state.chats);
  
    const handleGroup = (userToAdd) => {
      if (selectedUsers.includes(userToAdd)) {
        toast({
          title: "User already added",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      setSelectedUsers([...selectedUsers, userToAdd]);
    };
  
    const handleSearch = async (query) => {
      setSearch(query);
      if (!query) {
        return;
      }
  
      try {
        setLoading(true);
        const response = await allUsers(search);
        if(response.success){
            setTimeout(()=>{
                setLoading(false);
                message.success(response.message);
                setSearchResult(response.data);
            },500)
        }
        else{
            setTimeout(()=>{
                setLoading(false);
                message.info(response.message);
            },500)
        }
      } catch (error) {
        // toast({
        //   title: "Error Occured!",
        //   description: "Failed to Load the Search Results",
        //   status: "error",
        //   duration: 5000,
        //   isClosable: true,
        //   position: "bottom-left",
        // });
        setTimeout(()=>{
            setLoading(false);
            message.error(error.message);
        },500)
      }
    };
  
    const handleDelete = (delUser) => {
      setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };
  
    const handleSubmit = async () => {
      if (!groupChatName || !selectedUsers) {
        toast({
          title: "Please fill all the feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
  
      try {
        const payload = {
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)),
          }
        const response = await createGroupChat(payload);
       if(response.success){
        setTimeout(()=>{
            dispatch(SetListChats([response.data, ...listChats]));
            onClose();
        },500)
        toast({
            title: response.message,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
       }
       else{
        setTimeout(()=>{
            onClose();
        },500)
        toast({
            title: response.message,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
       }
      } catch (error) {
        // setTimeout(()=>{
            toast({
                title: "Failed to Create the Chat!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
        // },500)
      }
    };
  
    return (
      <>
        <span onClick={onOpen}>{children}</span>
  
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
              fontSize="35px"
              d="flex"
              justifyContent="center"
            >
              Create Group Chat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody d="flex" flexDir="column" alignItems="center">
              <FormControl>
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Input
                  placeholder="Add Users eg: John, Piyush, Jane"
                  mb={1}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>
              <Box w="100%" d="flex" flexWrap="wrap">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </Box>
              {loading ? (
                // <ChatLoading />
                <div>Loading...</div>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={handleSubmit} colorScheme="blue">
                Create Chat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default GroupChatModal;
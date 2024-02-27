import { ViewIcon } from "@chakra-ui/icons";
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
  IconButton,
  Spinner,
  Text,
} from "@chakra-ui/react";
// import axios from "axios";
import { useState } from "react";
// import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "./UserBadgeItem";
import UserListItem from "./UserListItem";
import { useDispatch, useSelector } from "react-redux";
import { SetSelectedChat } from "../redux/chatsSlice";
import {
  allUsers,
  addUserToGroup,
  renameGroup,
  removeUserFromGroup,
  LeaveFromGroup
} from "../apicalls/chats";
import { message } from "antd";
import moment from "moment";


const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const { selectedChat } = useSelector((state) => state.chats);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const response = await allUsers(search);
      if (response.success) {
        setTimeout(() => {
          setLoading(false);
          message.success(response.message);
          setSearchResult(response.data);
        }, 500);
      } else {
        setTimeout(() => {
          setLoading(false);
          message.info(response.message);
        }, 500);
      }
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
        message.error(error.message);
      }, 500);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const payload = {
        chatId: selectedChat._id,
        chatName: groupChatName,
      };

      const response = await renameGroup(payload);
      if (response.success) {
        setTimeout(() => {
          dispatch(SetSelectedChat(response.data));
          message.success(response.message);
          setFetchAgain(!fetchAgain);
          setRenameLoading(false);
        }, 500);
      } else {
        setTimeout(() => {
          message.info(response.message);
          setRenameLoading(false);
        }, 500);
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User Already in group!",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    // if (selectedChat.groupAdmin.find((u) => u._id === user._id)) {
    //   toast({
    //     title: "Only admins can add someone!",
    //     status: "error",
    //     duration: 5000,
    //     isClosable: true,
    //     position: "bottom",
    //   });
    //   return;
    // }

    try {
      setLoading(true);
      const payload = {
        chatId: selectedChat._id,
        userId: user1._id,
      };

      const response = await addUserToGroup(payload);
      if (response.success) {
        setTimeout(() => {
          dispatch(SetSelectedChat(response.data));
          message.success(response.message);
          setFetchAgain(!fetchAgain);
          setLoading(false);
        }, 500);
      } else {
        setTimeout(() => {
          message.info(response.message);
          setLoading(false);
        }, 500);
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    try {
      setLoading(true);
      const payload = {
        chatId: selectedChat._id,
        userId: user1._id,
      };

      const response = await removeUserFromGroup(payload);
      if (response.success) {
        setTimeout(() => {
          user1._id === user._id
            ? dispatch(SetSelectedChat(null))
            : dispatch(SetSelectedChat(response.data));
          setFetchAgain(!fetchAgain);
          message.success(response.message);
        //   fetchMessages();
          setLoading(false);
        }, 500);
      }
      else{
        setTimeout(() => {
            message.info(response.message);
            setLoading(false);
          }, 500);
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleLeave = async (user1) => {
    try {
      setLoading(true);
      const payload = {
        chatId: selectedChat._id,
        userId: user1._id,
      };

      const response = await LeaveFromGroup(payload);
      if (response.success) {
        setTimeout(() => {
          user1._id === user._id
            ? dispatch(SetSelectedChat(null))
            : dispatch(SetSelectedChat(response.data));
          setFetchAgain(!fetchAgain);
          message.success(response.message);
          fetchMessages();
          setLoading(false);
        }, 500);
      }
      else{
        setTimeout(() => {
            message.info(response.message);
            setLoading(false);
          }, 500);
      }
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
           <Text fontSize="xs">
            Created At : {moment(selectedChat.createdAt).format("DD/MM/YYYY hh:mm A")}
            </Text>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleLeave(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;

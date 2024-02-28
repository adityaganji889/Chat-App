import { Box } from "@chakra-ui/layout";
// import "./styles.css";
import SingleChat from "./SingleChat";
import { useSelector } from "react-redux";
// import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain, onlineUsers, setOnlineUsers }) => {
//   const { selectedChat } = ChatState();
  const {selectedChat} = useSelector(state=>state.chats);

  return (
    <Box
      display={{ base: selectedChat? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} onlineUsers={onlineUsers} setOnlineUsers={setOnlineUsers} />
    </Box>
  );
};

export default Chatbox;
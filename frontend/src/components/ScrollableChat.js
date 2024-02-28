import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { useSelector } from "react-redux";
import moment from "moment";
import { Text } from "@chakra-ui/react";

const ScrollableChat = ({ messages }) => {
  const { user } = useSelector(state=>state.users);
  const { selectedChat } = useSelector(state=>state.chats);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.profilePicture}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {selectedChat.isGroupChat && <Text fontSize="xs" className="d-flex justify-content-start">{m.sender.name}</Text>}
              {m.content}
              <Text fontSize="xs" className="d-flex justify-content-end">
              {moment(m.createdAt).format("DD/MM/YYYY hh:mm A")}
            </Text>
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
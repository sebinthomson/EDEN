/* eslint-disable react/prop-types */
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import { Flex, Text } from "@chakra-ui/react";
import moment from "moment";
import { useEffect } from "react";

const ScrollableChat = ({ messages, user }) => {
  useEffect(() => {}, [user]);
  return (
    user && (
      <Flex
        flexDirection={"column"}
        overflowY={"scroll"}
        h={300}
        my={3}
        w={400}
      >
        {!messages.length && <Text>No Biddings Found</Text>}
        {messages &&
          messages.map((m, i) => (
            <Flex alignItems={"center"} key={m._id}>
              <Tooltip
                label={m?.sender?.name}
                placement="bottom-start"
                hasArrow
              >
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m?.sender?.name}
                />
              </Tooltip>

              {/* {(isSameSender(messages, m, i, user?._id) ||
                isLastMessage(messages, i, user?._id)) && (
                <Tooltip
                  label={m.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    name={m.sender.name}
                  />
                </Tooltip>
              )} */}
              <Text
                my={2}
                bgColor={"#B9F5D0"}
                borderRadius={10}
                style={{
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
              >
                Rs.{m.content} at{" "}
                {moment(m.createdAt).format(" h:mm:ss a, MMMM Do YYYY")}
              </Text>
            </Flex>
          ))}
      </Flex>
    )
  );
};

export default ScrollableChat;

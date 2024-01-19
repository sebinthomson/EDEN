/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { Input } from "@chakra-ui/input";
import {
  Flex,
  Box,
  Text,
  Stack,
  Heading,
  Link,
  HStack,
} from "@chakra-ui/layout";
// import "./styles.css";
import Logo from "../Logo.jsx";
import { Button, Spinner, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
// import Lottie from "react-lottie";
// import animationData from "../../animations/typing.json";
import io from "socket.io-client";
import { ChatState } from "../../context/ChatProvider.jsx";
import { RepeatIcon } from "@chakra-ui/icons";
// const ENDPOINT = "https://eden-kerala.online/"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
const ENDPOINT = "http://localhost:8000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const SingleChatReverse = ({ AuctionId }) => {
  const [auctioneer, setAuctioneer] = useState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState(0);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [biddingsId, setBiddingsId] = useState();
  const [bidCaller, setBidCaller] = useState(false);
  const [changePH, setChangePH] = useState(true);
  const [startingBid, setStartingBid] = useState();
  const toast = useToast();
  const navigate = useNavigate();
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();
  const fetchMessages = async () => {
    if (user && AuctionId) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };
        setLoading(true);
        const { data } = await axios.get(`/api/bids/${AuctionId}`, config);
        if (data.noBidHistory) {
          setAuctioneer(data.auction.user._id);
          setMessages(false);
          setBiddingsId(data.bidding?._id);
          setStartingBid(false);
          data.bidding?.users.map((BC) => {
            if (BC == user?._id) setBidCaller(true);
          });
        } else {
          setAuctioneer(data.auction.user._id);
          setStartingBid(data.bidsHistory[data.bidsHistory.length - 1].content);
          setMessages(data.bidsHistory);
          setBiddingsId(data.bidsHistory[0].biddings._id);
          socket.emit("join chat", data.bidsHistory[0].biddings._id);
          data.bidsHistory[0]?.biddings?.users?.map((BC) => {
            if (BC == user?._id) setBidCaller(true);
          });
          setNewMessage(data.bidsHistory[data.bidsHistory.length - 1].content);
        }
        setLoading(false);
      } catch (error) {
        console.log(error.message, error);
        setLoading(false);
        toast({
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const sendMessage = async () => {
    if (!startingBid || newMessage < messages[messages.length - 1]?.content) {
      if (newMessage && user && AuctionId) {
        socket.emit("stop typing", AuctionId);
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          setNewMessage("");
          const { data } = await axios.post(
            "/api/bids/",
            {
              sender: user._id,
              content: newMessage,
              auctionId: AuctionId,
            },
            config
          );
          socket.emit("new message", data);
          fetchMessages();
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      }
    } else {
      toast({
        title: "Error placing bid!",
        description: `Enter an amount lesser than ${
          messages[messages.length - 1]?.content || startingBid
        }`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [user]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      newMessageRecieved?.biddings?.users.forEach((usersInChat) => {
        if (usersInChat == user._id) {
          fetchMessages();
        }
      });
    });
  });

  const typingHandler = (e) => {
    setNewMessage(Number(e.target.value));
    setChangePH(false);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", AuctionId);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", AuctionId);
        setTyping(false);
      }
    }, timerLength);
  };

  const handleAddBidCaller = async (event) => {
    if (user && AuctionId) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/bids/auctionbiddingadd",
          {
            userId: user?._id,
            auctionId: AuctionId,
          },
          config
        );
        setBiddingsId(data.auctionId);
        fetchMessages();
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to enter the auction",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  useEffect(() => {
    fetchMessages();
  }, [AuctionId]);
  return (
    <Box
      d="flex"
      flexDir="column"
      bg="#E8E8E8"
      borderRadius="lg"
      px={3}
      h={420}
      w={450}
    >
      {bidCaller && user ? (
        <Flex flexDirection={"column"}>
          {loading ? (
            <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
          ) : (
            <ScrollableChat messages={messages} user={user} />
          )}
          {auctioneer != user?._id ? (
            <>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder={
                  changePH
                    ? startingBid
                      ? `Enter an amount lesser than ${
                          messages[messages.length - 1]?.content
                        }`
                      : "Enter an amount"
                    : ""
                }
                value={!changePH ? newMessage : ""}
                onChange={typingHandler}
              />
              <Flex alignItems={"center"} justifyContent={"space-between"}>
                <HStack mt={2}>
                  <Button
                    isDisabled={
                      messages[messages.length - 1]?.content <= 200 ||
                      newMessage - 200 < 200
                    }
                    size={"sm"}
                    onClick={() => {
                      setNewMessage(
                        (messages
                          ? newMessage
                          : !changePH
                          ? newMessage
                          : startingBid) - 200
                      );
                      setChangePH(false);
                    }}
                    _hover={{ bgColor: "#B9F5D0" }}
                  >
                    -200
                  </Button>
                  <Button
                    isDisabled={
                      messages[messages.length - 1]?.content <= 500 ||
                      newMessage - 500 < 500
                    }
                    size={"sm"}
                    onClick={() => {
                      setNewMessage(newMessage - 500);
                      setChangePH(false);
                    }}
                    _hover={{ bgColor: "#B9F5D0" }}
                  >
                    -500
                  </Button>
                  <Button
                    isDisabled={
                      messages[messages.length - 1]?.content <= 1000 ||
                      newMessage - 1000 < 1000
                    }
                    size={"sm"}
                    onClick={() => {
                      setNewMessage(newMessage - 1000);
                      setChangePH(false);
                    }}
                    _hover={{ bgColor: "#B9F5D0" }}
                  >
                    -1000
                  </Button>
                  <Button
                    size={"sm"}
                    onClick={() => {
                      setNewMessage(messages[messages.length - 1].content);
                      setChangePH(true);
                    }}
                    _hover={{ bgColor: "#B9F5D0" }}
                  >
                    <RepeatIcon />
                  </Button>
                </HStack>
                <Button
                  ml={2}
                  size={"sm"}
                  onClick={() => {
                    sendMessage();
                    setChangePH(true);
                  }}
                  width={40}
                  mt={2}
                  bgColor={"#B9F5D0"}
                  _hover={{ bgColor: "blue.400", color: "white" }}
                >
                  Place Bid
                </Button>
              </Flex>
            </>
          ) : (
            <Flex>
              <Text>
                You cannot participate in the auction as you are the Auctioneer
              </Text>
            </Flex>
          )}
        </Flex>
      ) : (
        <Flex>
          {user?._id ? (
            <Flex flexDirection={"column"}>
              {loading ? (
                <Spinner
                  size="xl"
                  w={2}
                  h={2}
                  alignSelf="center"
                  margin="auto"
                />
              ) : (
                <ScrollableChat messages={messages} user={user} />
              )}
              {auctioneer != user?._id ? (
                <Button
                  size={"sm"}
                  _hover={{ bgColor: "#B9F5D0" }}
                  onClick={handleAddBidCaller}
                >
                  Click here to participate in the Auction
                </Button>
              ) : (
                <Flex>
                  <Text>
                    You cannot participate in the auction as you are the
                    Auctioneer
                  </Text>
                </Flex>
              )}
            </Flex>
          ) : (
            <Stack
              alignItems="center"
              h={300}
              w={400}
              display={"flex"}
              justifyContent={"flex-end"}
            >
              <Stack
                spacing={{
                  base: "",
                  md: "",
                }}
                textAlign="center"
              >
                <Heading
                  size={{
                    base: "xs",
                    md: "sm",
                  }}
                >
                  <Link
                    textColor="blue"
                    fontWeight="500"
                    _hover={{
                      textDecoration: "none",
                      fontWeight: "bold",
                      color: "darkblue",
                    }}
                    onClick={() => navigate("/userLogin")}
                  >
                    Login
                  </Link>{" "}
                  to your account to view Biddings
                </Heading>
                <Text color="fg.muted">
                  Don't have an account?{" "}
                  <Link
                    textColor="blue"
                    fontWeight="500"
                    _hover={{
                      textDecoration: "none",
                      fontWeight: "bold",
                      color: "darkblue",
                    }}
                    onClick={() => navigate("/userRegister")}
                  >
                    Sign up
                  </Link>
                </Text>
              </Stack>
              <Logo />
            </Stack>
          )}
        </Flex>
      )}
    </Box>
  );
};

export default SingleChatReverse;

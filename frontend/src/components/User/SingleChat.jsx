/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Flex, Box, Text, Stack, Heading, Link } from "@chakra-ui/layout";
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
const ENDPOINT = "http://localhost:8000"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const SingleChat = ({ AuctionId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [biddingsId, setBiddingsId] = useState();
  const [bidCaller, setBidCaller] = useState(false);
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
          setMessages(false);
          setBiddingsId(data.bidding?._id);
          data.bidding?.users.map((BC) => {
            if (BC == user?._id) setBidCaller(true);
          });
        } else {
          setMessages(data);
          setBiddingsId(data[0].biddings._id);
          socket.emit("join chat", data[0].biddings._id);
          data[0]?.biddings?.users?.map((BC) => {
            if (BC == user?._id) setBidCaller(true);
          });
        }
        setLoading(false);
      } catch (error) {
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
    debugger;
    console.log(newMessage, user, AuctionId);
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
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat, AuctionId]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          // setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
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
        console.log(data);
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
  return (
    <Box
      d="flex"
      flexDir="column"
      bg="#E8E8E8"
      borderRadius="lg"
      px={3}
      h={400}
      w={450}
    >
      {bidCaller && user ? (
        <Flex flexDirection={"column"}>
          {loading ? (
            <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
          ) : (
            <ScrollableChat messages={messages} user={user} />
          )}
          <Input
            variant="filled"
            bg="#E0E0E0"
            placeholder="Enter a message.."
            value={newMessage}
            onChange={typingHandler}
          />
          <Button onClick={sendMessage}>Place Bid</Button>
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
              <Button
                size={"sm"}
                _hover={{ bgColor: "#B9F5D0" }}
                onClick={handleAddBidCaller}
              >
                Click here to participate in the Auction
              </Button>
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

export default SingleChat;

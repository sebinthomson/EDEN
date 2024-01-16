/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { Text, useToast, Flex, Button, Input, Heading } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider.jsx";
import { useEffect, useState } from "react";
import styled from "styled-components";
import RazorPay from "../../components/User/RazorPay.jsx";
const AuctionOver = ({ AuctionId, englishAuction }) => {
  const [rate, setRate] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [winner, setWinner] = useState(false);
  const [amount, setAmount] = useState(false);
  const [showReveiw, setShowReview] = useState(false);
  const { user } = ChatState();
  const toast = useToast();
  const fetchMessages = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const { data } = await axios.get(`/api/bids/${AuctionId}`, config);
      if (!data.noBidHistory) {
        setAmount(data.bidsHistory[data.bidsHistory.length - 1]?.content * 2);
        setWinner(data.bidsHistory[data.bidsHistory.length - 1]?.sender?._id);
      }
    } catch (error) {
      toast({
        description: "Failed to Load the Successfull Bidder",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleSubmitReview = async () => {
    if (rate > 0 || title.length > 0 || content.length > 0) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        };
        const { data } = await axios.post(
          `/api/users/review`,
          {
            rate: rate,
            title: title,
            content: content,
            auctionId: AuctionId,
            englishAuction: englishAuction,
            userId: user._id,
          },
          config
        );
        if(data.message == "success"){
          toast({
            description: "Review Submitted",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      } catch (error) {
        console.log(error.message)
        toast({
          description: "Failed to Submit the Review",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    } else {
      toast({
        description: "Please enter atleast one field",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    if (user && AuctionId) fetchMessages();
  }, [fetchMessages]);
  const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
  `;
  const Radio = styled.input`
    display: none;
  `;
  const Rating = styled.div`
    cursor: pointer;
  `;

  return (
    <Flex
      justifyContent={"space-around"}
      p={10}
      bg="#E8E8E8"
      borderRadius="lg"
      px={3}
      h={420}
      w={450}
      flexDirection={"column"}
      alignItems={"center"}
    >
      {showReveiw ? (
        <>
          <Heading mb={10}>Review and Rating</Heading>
          <Flex flexDirection={"column"}>
            <Container>
              {[...Array(5)].map((item, index) => {
                const givenRating = index + 1;
                return (
                  <label key={index}>
                    <Radio
                      type="radio"
                      value={givenRating}
                      onClick={() => {
                        setRate(givenRating);
                      }}
                    />
                    <Rating>
                      <FaStar
                        color={
                          givenRating < rate || givenRating === rate
                            ? "#5a89c8"
                            : "gray"
                        }
                      />
                    </Rating>
                  </label>
                );
              })}
            </Container>
          </Flex>
          <Flex flexDirection={"column"}>
            <Text>Title</Text>
            <Input
              type="String"
              bgColor={"blue.50"}
              w={96}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </Flex>
          <Flex flexDirection={"column"}>
            <Text>Content</Text>
            <Input
              type="String"
              bgColor={"blue.50"}
              w={96}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            />
          </Flex>
          <Button size={"sm"} onClick={handleSubmitReview}>
            Submit
          </Button>
        </>
      ) : user?._id == winner ? (
        <>
          <Text fontWeight={"bold"}>
            Congratulations on being the successful bidder
          </Text>
          <Text>
            Pay Now using
            <RazorPay amount={amount} AuctionId={AuctionId} />
          </Text>
          <Button onClick={() => setShowReview(true)}>review</Button>
        </>
      ) : (
        <Text>Auction Expired</Text>
      )}
    </Flex>
  );
};

export default AuctionOver;

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Image,
  Button,
  Flex,
  useToast,
  Text,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { useNewEnglishAuctionUserMutation } from "../../slices/userApiSlice.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { differenceInSeconds } from "date-fns";

const EnglishAuctionCreateForm = () => {
  const [item, setItem] = useState();
  const [quantity, setQuantity] = useState();
  const [startingBid, setStartingBid] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [images, setImages] = useState([]);
  const [imagesData, setImagesData] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();
  const [newEnglishAuctionApiCall] = useNewEnglishAuctionUserMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const hiddenFileInput = useRef(null);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    Promise.allSettled(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          if (file?.size >= 102400) {
            reject("Please upload an image less than 100kb in size");
          } else if (
            !(file.type === "image/png" || file.type === "image/jpeg")
          ) {
            reject("Please upload an image of png or jpeg type");
          } else {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
              setImages([...images, file]);
              setImagesData([...imagesData, reader.result]);
              resolve(reader.result);
            };
          }
        });
      })
    ).then((results) => {
      results.filter((result) => {
        if (result.status === "rejected") {
          console.log("hell");
          toast({
            title: `${result.reason}`,
            status: `error`,
            duration: 2000,
            isClosable: true,
          });
        }
      });
    });
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  const handlePublish = async () => {
    if (
      item &&
      quantity &&
      startingBid &&
      startDate &&
      endDate &&
      imagesData.length > 0
    ) {
      if (differenceInSeconds(endDate, startDate) >= 24 * 60 * 60) {
        try {
          toast({
            title: "Please wait",
            status: `loading`,
            duration: 3000,
            isClosable: true,
          });
          const res = await newEnglishAuctionApiCall({
            user: userInfo._id,
            item: item,
            quantity: quantity,
            startingBid: startingBid,
            startsOn: startDate,
            endsOn: endDate,
            images: imagesData,
          }).unwrap();
          navigate("/userEnglishAuctions/details", {
            state: { data: res.newEnglishAuction },
          });
        } catch (err) {
          console.log(err);
          toast({
            title: `${err?.data?.message || err.error}`,
            status: `error`,
            duration: 9000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title:
            "There should be a minimum gap of 24 hours between the start date and end date",
          status: `error`,
          duration: 9000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Empty fields, Please enter values",
        status: `error`,
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box display={"flex"} flexDirection={{ md: "row", base: "column" }}>
        <Box
          p={{ md: "10", base: "10" }}
          pb={{ base: "0" }}
          width={{ md: "4xl" }}
        >
          <FormControl>
            <FormLabel fontWeight={"700"}>Item</FormLabel>
            <Input
              type="String"
              bgColor={"#8080802e"}
              onChange={(e) => setItem(e.target.value)}
            />
            <FormLabel fontWeight={"700"}>Quantity</FormLabel>
            <Input
              type="number"
              bgColor={"#8080802e"}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <FormLabel fontWeight={"700"}>Starting Bid</FormLabel>
            <Input
              type="number"
              bgColor={"#8080802e"}
              onChange={(e) => setStartingBid(e.target.value)}
            />
            <FormControl
              display={"flex"}
              flexDirection={{ md: "row", base: "column" }}
              justifyContent={{ md: "space-between" }}
            >
              <Box width={{ md: "47%" }}>
                <FormLabel fontWeight={"700"}>Bidding Start Date</FormLabel>
                <Input
                  min={new Date().toISOString().slice(0, 16)}
                  type="datetime-local"
                  bgColor={"#8080802e"}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Box>
              <Box width={{ md: "47%" }}>
                <FormLabel fontWeight={"700"}>Bidding End Date</FormLabel>
                <Input
                  type="datetime-local"
                  bgColor={"#8080802e"}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Box>
            </FormControl>
          </FormControl>
        </Box>
        <Box
          p={{ md: "10", base: "10" }}
          pt={{ base: "0" }}
          ml={"0"}
          width={{ md: "md" }}
        >
          <FormLabel fontWeight={"700"} display={"flex"}>
            Images
          </FormLabel>
          <Button
            size={"sm"}
            onClick={() => {
              hiddenFileInput.current.click();
            }}
          >
            Upload Images
          </Button>
          <Input
            ref={hiddenFileInput}
            type="file"
            display={"none"}
            border={"none"}
            ml={{ md: "-4" }}
            onChange={handleImageChange}
            accept=".png, .jpeg, .jpg"
          />
          <Flex
            display={"flex"}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            {images.length > 0 && (
              <FormLabel fontWeight={"700"} flexDirection={"row"}>
                Preview
                {images.length > 1 &&
                  `  (${currentImageIndex + 1}/${images.length})`}
              </FormLabel>
            )}
            {images.length > 1 && <FiArrowRight onClick={handleNextImage} />}
          </Flex>
          {images.length > 0 && (
            <>
              {images[currentImageIndex] && (
                <Image
                  borderRadius={"lg"}
                  src={URL.createObjectURL(images[currentImageIndex])}
                  width={{ md: "96", base: "md" }}
                  height={{ md: "48", base: "48" }}
                />
              )}
            </>
          )}
        </Box>
      </Box>
      <Button
        ml={"10"}
        mb={"10"}
        width={"40"}
        bg={"#8080802e"}
        _hover={{ backgroundColor: "grey", color: "white" }}
        onClick={handlePublish}
      >
        Publish Auction
      </Button>
    </Box>
  );
};

export default EnglishAuctionCreateForm;

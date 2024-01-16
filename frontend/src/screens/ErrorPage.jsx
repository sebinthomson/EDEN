import { Flex, Image, Text } from "@chakra-ui/react";

const ErrorPage = () => {
  return (
    <Flex m={10} alignItems={"center"} flexDirection={"column"}>
      <Text>Oops! You seem to be lost.</Text>
      <Image src="https://imgs.search.brave.com/J5Au4-WEfSmdcUWfiSzSW1jMHajdmujj6tTrUiVUvVc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC85OS81NC80/MDQtb29wcy13b3Jk/LWZvci1pbnRlcm5l/dC13ZWJzaXRlLXBh/Z2Utbm90LWZvdW5k/LXZlY3Rvci0xNDQ0/OTk1NC5qcGc" boxSize={"md"} />
    </Flex>
  );
};

export default ErrorPage;

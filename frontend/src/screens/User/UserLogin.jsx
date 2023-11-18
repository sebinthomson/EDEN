import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  Link,
  Stack,
  Text,
  useDisclosure,
  useMergeRefs,
  useToast,
} from "@chakra-ui/react";
import { useRef } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import Logo from "../../components/Logo";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  useLoginUserMutation,
  useOAuthLoginUserMutation,
} from "../../slices/userApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../slices/userAuthSlice";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const mergeRef = useMergeRefs(inputRef);
  const toast = useToast();
  const [loginUserApi, { isLoadingLoginUserApi }] = useLoginUserMutation();
  const [oAuthLoginUserApi, { isLoadingOAuthLoginUserApi }] =
    useOAuthLoginUserMutation();
  const onClickReveal = () => {
    onToggle();
    if (inputRef.current) {
      inputRef.current.focus({
        preventScroll: true,
      });
    }
  };
  const handleSignIn = async () => {
    if (!email && !password) {
      toast({
        title: "Empty fields, Please enter values",
        status: `error`,
        duration: 9000,
        isClosable: true,
      });
    } else {
      try {
        const res = await loginUserApi({ email, password }).unwrap();
        console.log(res);
        if (res.user) {
          dispatch(setCredentials({ ...res }));
          navigate("/");
        }
      } catch (err) {
        toast({
          title: `${err?.data?.message || err.error}`,
          status: `error`,
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };
  const handleOAuth = async (credentials) => {
    try {
      const res = await oAuthLoginUserApi({
        name: credentials.given_name + credentials.family_name,
        email: credentials.email,
        oAuthLogin: true,
      });
      console.log("res:", res);
      if (res.data.user) {
        dispatch(setCredentials({ ...res.data }));
        navigate("/");
      }
    } catch (err) {
      toast({
        title: `${err?.data?.message || err.error}`,
        status: `error`,
        duration: 9000,
        isClosable: true,
      });
    }
  };
  return (
    <div>
      <Container
        maxW="lg"
        pt={{
          base: "5",
          md: "10",
        }}
        px={{
          base: "0",
          sm: "8",
        }}
      >
        <Stack spacing="4">
          <Stack spacing="3" alignItems="center">
            <Logo />
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
                Log in to your account
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
          </Stack>
          <Box
            py={{
              base: "0",
              sm: "8",
            }}
            px={{
              base: "4",
              sm: "10",
            }}
            bg={{
              base: "transparent",
              sm: "bg.surface",
            }}
            boxShadow={{
              base: "none",
              sm: "md",
            }}
            borderRadius={{
              base: "none",
              sm: "xl",
            }}
          >
            <Stack spacing="3">
              <Stack spacing="2">
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <InputGroup>
                    <InputRightElement>
                      <IconButton
                        variant="text"
                        aria-label={
                          isOpen ? "Mask password" : "Reveal password"
                        }
                        icon={isOpen ? <HiEyeOff /> : <HiEye />}
                        onClick={onClickReveal}
                      />
                    </InputRightElement>
                    <Input
                      id="password"
                      ref={mergeRef}
                      name="password"
                      type={isOpen ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>
              </Stack>
              {/* <HStack justify="space-between">
                <Button variant="text" size="sm">
                  Forgot password?
                </Button>
              </HStack> */}
              <Stack spacing="2">
                <Button onClick={handleSignIn}>Sign in</Button>
                <HStack>
                  <Divider />
                  <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
                    or
                  </Text>
                  <Divider />
                </HStack>
                <Flex justifyContent={"space-around"}>
                  <GoogleOAuthProvider clientId="125796492188-9o7hh2f1pin40qa2v4bltacu3kgo204g.apps.googleusercontent.com">
                    <GoogleLogin
                      onSuccess={(credentialResponse) => {
                        const decoded = jwtDecode(
                          credentialResponse.credential
                        );
                        handleOAuth(decoded);
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                    />
                  </GoogleOAuthProvider>
                </Flex>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </div>
  );
};

export default UserLogin;

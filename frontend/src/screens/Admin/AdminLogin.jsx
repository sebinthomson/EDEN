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
  Heading,
  Stack,
  useDisclosure,
  useMergeRefs,
  useToast,
} from "@chakra-ui/react";
import { useRef } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import Logo from "../../components/Logo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLoginAdminMutation } from "../../slices/adminApiSlice";
import { useDispatch } from "react-redux";
import { setAdminCredentials } from "../../slices/adminAuthSlice";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const mergeRef = useMergeRefs(inputRef);
  const toast = useToast();
  const [loginAdminApi] = useLoginAdminMutation();
  const onClickReveal = () => {
    onToggle();
    if (inputRef.current) {
      inputRef.current.focus({
        preventScroll: true,
      });
    }
  };
  const handleLogin = async () => {
    if (!email && !password) {
      toast({
        title: "Empty fields, Please enter values",
        status: `error`,
        duration: 9000,
        isClosable: true,
      });
    } else {
      try {
        const res = await loginAdminApi({ email, password }).unwrap();
        if (res.admin) {
          dispatch(setAdminCredentials({ ...res }));
          navigate("/admin/listUsers");
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
            <Heading
              size={{
                base: "xs",
                md: "sm",
              }}
            >
              Admin Account Login
            </Heading>
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
                      aria-label={isOpen ? "Mask password" : "Reveal password"}
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
              <Button onClick={handleLogin}>Login</Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </div>
  );
};

export default AdminLogin;

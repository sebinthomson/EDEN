import { useState, useEffect, useRef } from "react";
import { Form, Button, Image, ButtonGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import {
  useUpdateUserMutation,
  useUpdateProfileImageMutation,
} from "../slices/userAdminApiSlice";
import { setCredentials } from "../slices/authSlice";

const ProfileScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatedProfileImage, setUpdatedProfileImage] = useState();

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading }] = useUpdateUserMutation();
  // eslint-disable-next-line no-unused-vars
  const [profileImageUpdate, { isUpdating }] = useUpdateProfileImageMutation();

  const hiddenFileInput = useRef(null);

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
    setUpdatedProfileImage(userInfo.profileImage)
  }, [userInfo.email, userInfo.name, userInfo.profileImage]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials(res));
        toast.success("Profile updated successfully");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = async () => {
    const formData = new FormData();
    formData.append("image", updatedProfileImage);
    formData.append("id", userInfo._id);
    const res = await profileImageUpdate(formData).unwrap();
    setUpdatedProfileImage(res.profileImage)
  };

  useEffect(() => {
    if (updatedProfileImage && updatedProfileImage != "default.png") {
      handleChange();
    }
  }, [updatedProfileImage]);

  return (
    <FormContainer>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <h1>Update Profile</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Image
            src={`../public/Images/${updatedProfileImage}`}
            roundedCircle
            style={{ height: "100px", paddingBottom: "10px" }}
          />
          <ButtonGroup aria-label="Basic example" size="sm">
            <Button variant="secondary" onClick={handleClick}>
              Update Profile Image
            </Button>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                setUpdatedProfileImage(file);
              }}
              ref={hiddenFileInput}
              style={{ display: "none" }}
              name="image"
            ></input>
          </ButtonGroup>
        </div>
      </div>
      <Form onSubmit={submitHandler}>
        <Form.Group className="my-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className="my-2" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Save Changes
        </Button>

        {isLoading && <Loader />}
      </Form>
    </FormContainer>
  );
};

export default ProfileScreen;

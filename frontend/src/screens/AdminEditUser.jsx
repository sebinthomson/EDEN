import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import {
  useEditUserMutation,
  useGetUserMutation,
} from "../slices/userAdminApiSlice";

const AdminEditUser = () => {
  const { user } = useParams();

  const [getUserApi, { userLoading }] = useGetUserMutation();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // eslint-disable-next-line no-unused-vars
  const [updateProfile, { isLoading }] = useEditUserMutation();
  const navigate = useNavigate();

  const submitHandler = async () => {
    updateProfile({
      _id: user,
      name,
      email,
    }).unwrap();
    navigate("/admin/");
  };

  useEffect(() => {
    const getUser = async () => {
      const res = await getUserApi({ user }).unwrap();
      setName(res.user[0].name);
      setEmail(res.user[0].email);
    };
    getUser();
  }, []);

  return (
    <>
      {userLoading ? <h1>hello word</h1>:
        <FormContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <h1>Edit Profile</h1>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          ></div>
        </div>
        <Form>
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

          <Button onClick={submitHandler} variant="primary" className="mt-3">
            Save Changes
          </Button>
        </Form>
      </FormContainer>}
    </>
  );
};

export default AdminEditUser;

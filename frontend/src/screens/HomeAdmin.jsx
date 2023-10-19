import {
  Toast,
  Table,
  Image,
  Button,
  ButtonGroup,
  Modal,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import {
  useListUsersMutation,
  useSearchUsersMutation,
  useDeleteUserMutation,
} from "../slices/userAdminApiSlice";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const HomeAdmin = () => {
  const [listUsersApiCall] = useListUsersMutation();
  const [searchUser] = useSearchUsersMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState(false);
  const [userIdToDeleteOrEdit, setUserIdToDeleteOrEdit] = useState("");

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await listUsersApiCall().unwrap();
      setData(res.users);
    } catch (error) {
      Toast.error("Error fetching users data");
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    const res = await searchUser({ search }).unwrap();
    setData(res);
    res.length
      ? toast.success(`${res.length} matching users found`, {
          autoClose: 500,
        })
      : toast.error("No users found", {
          autoClose: 500,
        });
  };

  const clearSearch = async () => {
    setSearch("");
    fetchData();
  };

  const handleDelete = async () => {
    const { message, task } = await deleteUser({
      userId: userIdToDeleteOrEdit,
    }).unwrap();
    task ? toast.success(message, { autoClose: 500 }) : toast.error(message);
    setShow(false);
    setUserIdToDeleteOrEdit("");
    fetchData();
  };
  const handleClose = () => setShow(false);
  const handleShow = (userId) => {
    setShow(true);
    setUserIdToDeleteOrEdit(userId);
  };

  const handleEdit = (user) => {
    navigate(`/admin/edit-user/${user._id}`);
  };

  const createUser = () => {
    navigate("/admin/create-user");
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1>Users</h1>
          <ButtonGroup size="sm" className="mb-3">
            <Button
              style={{
                display: "flex",
                fontSize: "13px,",
              }}
              onClick={clearSearch}
            >
              List All Users
            </Button>
            <Button
              variant="success"
              style={{ display: "flex", fontSize: "13px" }}
              onClick={createUser}
            >
              New User
            </Button>
          </ButtonGroup>
        </div>
        <div style={{ display: "flex" }}>
          <input
            type="text"
            placeholder="Search user"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          ></input>
          <Button style={{ display: "flex" }} onClick={handleSearch}>
            <FaSearch />
          </Button>
        </div>
      </div>
      {data ? (
        <Table>
          <thead>
            <tr className="text-center">
              <th>User Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user) => (
              <tr key={user._id} className="text-center">
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Image
                    src={`../public/Images/${user.profileImage}`}
                    roundedCircle
                    style={{ width: "50px" }}
                  ></Image>
                </td>
                <td>
                  <ButtonGroup size="sm">
                    <Button onClick={() => handleEdit(user)}>Edit</Button>
                    <Button
                      variant="danger"
                      onClick={() => handleShow(user._id)}
                    >
                      Delete
                    </Button>
                    <Modal
                      show={show}
                      onHide={handleClose}
                      backdrop="static"
                      keyboard={false}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Delete Confirmation</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        Are you sure you want to delete this User
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>
                        <Button variant="primary" onClick={handleDelete}>
                          Delete User
                        </Button>
                      </Modal.Footer>
                    </Modal>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Image
          style={{ width: "255px", marginLeft: "39%" }}
          src="../public/Images/Loading.gif"
        ></Image>
      )}
    </>
  );
};

export default HomeAdmin;

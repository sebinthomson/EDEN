import { Toast, Table, Image, Button, ButtonGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import {
  useListUsersMutation,
  useSearchUsersMutation,
} from "../slices/userAdminApiSlice";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const HomeAdmin = () => {
  const [listUsersApiCall] = useListUsersMutation();
  const [searchUser] = useSearchUsersMutation();
  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");

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

  const handleDelete = async (userId) => {

    console.log(userId);
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
          <Button
            style={{ display: "flex", fontSize: "13px" }}
            onClick={clearSearch}
          >
            List All Users
          </Button>
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
                    {/* <Button onClick={()=>handleDelete(user._id)}>Edit</Button> */}
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
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

import { Toast, Table, Image, Button, ButtonGroup } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import {
  useListUsersMutation,
  useSearchUsersMutation,
} from "../slices/userAdminApiSlice";
import { useState, useEffect } from "react";

const HomeAdmin = () => {
  const [listUsersApiCall] = useListUsersMutation();
  const [searchUser] = useListUsersMutation();
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

  useEffect(() => {
    console.log(search, "search");
  }, [search]);

  const handleSearch = async () => {
    const res = await searchUser({ search }).unwrap();
  };

  const clearSearch = async () => {
    fetchData()
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
        <h1>Users</h1>
        <div style={{ display: "flex" }}>
          <input
            type="text"
            placeholder="Search user"
            onChange={(e) => setSearch(e.target.value)}
          ></input>
          <Button style={{ display: "flex" }} onClick={handleSearch}>
            <FaSearch />
          </Button>
          <Button style={{ display: "flex", fontSize:"13px" }} onClick={clearSearch}>
            Clear Search
          </Button>
        </div>
      </div>
      {data ? (
        <Table>
          <thead>
            <tr className="text-center">
              <th>Name</th>
              <th>Email</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user, index) => (
              <tr key={user._id} className="text-center">
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
                    <Button>Edit</Button>
                    <Button variant="danger">Delete</Button>
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

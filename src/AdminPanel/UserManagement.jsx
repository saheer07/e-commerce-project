import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  // Fetch users
  useEffect(() => {
    axios.get("/api/users").then((response) => {
      setUsers(response.data);
    });
  }, []);

  const handleDeleteUser = (id) => {
    axios
      .delete(`/api/users/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <h1>User Management</h1>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - {user.email}
            <button onClick={() => handleDeleteUser(user.id)}>Delete User</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;

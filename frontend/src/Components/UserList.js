import React, { useEffect, useState } from 'react';
import './UserList.css';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import UserListCard from './UserListCard';
import { CiSearch } from "react-icons/ci";
import { clearSelectedUser, setSelectedUser } from '../redux/selectedUserSlice';
import { clearMessages } from '../redux/messagesSlice';

function UserList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const receiverId = useSelector(store => store.selectedUser);
  const [serchbox, setSearchBox] = useState('');
  const { token } = useSelector(state => state.auth);
  const [users, setUsers] = useState(null);
  async function fetchUserList() {
    const load = toast.loading("Please Wait");
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/allUsers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }).then((res) => {
      // console.log(res.data.allUsers);
      setUsers(res.data.allUsers);
    }).catch((error) => {
      toast.error("Something Went Wrong")
      console.log(error);
    }).finally(() => toast.dismiss(load));
  }

  useEffect(() => {
    fetchUserList();
  }, [])
  function logoutHandler() {
    const load = toast.loading("Please Wait");
    axios.post(`${process.env.REACT_APP_SERVER_URL}/logout`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }).then(res => {
      console.log("Logout Successfully");
      window.localStorage.removeItem("chatToken");
      window.localStorage.removeItem("userId");
      dispatch(logout());
      dispatch(clearMessages());
      dispatch(clearSelectedUser());
      toast.success("Logout Successfully");
      navigate('/login');
    }).catch((error) => {
      toast.error("Something Went Wrong")
      console.log(error);
    }).finally(() => toast.dismiss(load));
  }
  function searchSubmitHandler(e) {
    e.preventDefault();
    if (serchbox === '') {
      return;
    }
    console.log(serchbox);
    setSearchBox('');
  }
  function selectedUserChangeHandler(user) {
    console.log(user);
    dispatch(setSelectedUser(user));
  }
  return (
    <div className='user-list-container'>
      <h2>Sout Chat</h2>
      <form onSubmit={(e) => searchSubmitHandler(e)}>
        <input type="text" onChange={(e) => setSearchBox(e.target.value)} value={serchbox} placeholder='Search' />
        <button type="submit"><CiSearch /></button>
      </form>
      <div className='user-list'>
        {users === null
          ?
          <h1>Please Wait</h1>
          :
          (users.length <= 0
            ?
            <h1>No User Found</h1>
            :
            users.map((user) => {
              return <div key={user._id} className='user-box'>
                <input type="radio" name="user" id={user._id} onChange={() => selectedUserChangeHandler(user)} />
                <label htmlFor={user._id}>
                  <UserListCard user={user} />
                </label>
              </div>
            })
          )
        }
      </div>
      <div className="setting-container">
        <button onClick={logoutHandler}>Logout</button>
        <button onClick={()=>navigate('/profile')}>Profile</button>
      </div>
    </div>
  );
}

export default UserList;
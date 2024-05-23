import React, { useEffect } from 'react'
import UserList from '../Components/UserList';
import Message from '../Components/Message';
import './Chats.css';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Chats() {
  const { isLoggedIn } = useSelector(state => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, []);
  return (
    <div className='chat-container'>
      <UserList />
      <Message />
    </div>
  );
}

export default Chats;
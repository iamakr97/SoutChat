import React, { useEffect, useState, useRef } from 'react'
import './Message.css';
import { MdSend } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { clearMessages, setMessages, setNewMessage } from '../redux/messagesSlice';

function Message() {
  const dispatch = useDispatch();
  const { socket } = useSelector(store => store.socket);
  const { allMessage } = useSelector(store => store.messages);
  const { token } = useSelector(store => store.auth);
  const { receiverId, name, profilePic } = useSelector(store => store.selectedUser);
  const [message, setMessage] = useState('');
  const messageEndRef = useRef(null);
  function messageInputHandler(e) {
    setMessage(e.target.value);
  }
  async function msgSubmitHandler(e) {
    e.preventDefault();
    if (message === '') {
      return;
    }
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/sendMessage/${receiverId}`,
      { message, token },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }).then((res) => {
        // console.log(res.data.newMessage);
        setMessage('');
        dispatch(setNewMessage(res.data.newMessage));
      }).catch((error) => {
        console.log(error);
      })
  }

  async function fetchMessages() {
    if (!receiverId) {
      return;
    }
    // console.log(receiverId);
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/getMessage/${receiverId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }).then((res) => {
        // console.log(res.data.allConversation.messages);
        dispatch(setMessages(res.data.allConversation.messages));

      }).catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    dispatch(clearMessages());
    fetchMessages();
    // console.log(allMessage);
  }, [receiverId]);

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      console.log('New message received:', newMessage);
      dispatch(setNewMessage(newMessage));
    };
    socket?.on("newMessage", handleNewMessage);
    return () => {
      socket?.off("newMessage", handleNewMessage);
    };
  }, [socket, dispatch]);

  useEffect(() => {
    messageEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessage]);
  return (
    <div className='message-container'>
      {!receiverId
        ?
        <div className='no-user-selected'>
          <h1>Select an user to <br /> Start Conversation</h1>
        </div>
        :
        <div className="message-header">
          <div className="header-image">
            <img src={profilePic} alt="User Image" />
            <h3>{name}</h3>
          </div>
          <div className="message-box">
            <div className="message-box-container">
              {(allMessage && allMessage.length > 0) &&
                allMessage.map((mess) => {
                  return <div key={mess._id}>
                    {(mess.receiverId === receiverId)
                      ?
                      <div className="right-align">
                        <span>{mess.message}</span>
                      </div>
                      :
                      <div className="left-align">
                        <span>{mess.message}</span>
                      </div>
                    }
                  </div>
                })
              }
              <div ref={messageEndRef} />
            </div>
            <div className="send-msg-box">
              <form onSubmit={msgSubmitHandler}>
                <input
                  type="text"
                  placeholder='message...'
                  name='message'
                  onChange={messageInputHandler}
                  value={message}
                />
                <button type="submit"><MdSend id='send-btn' /></button>
              </form>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default Message;
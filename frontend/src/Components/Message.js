import React, { useEffect, useState, useRef } from 'react'
import './Message.css';
import { MdSend } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { clearMessages, setMessages, setNewMessage } from '../redux/messagesSlice';
import ButtonLoader from '../Components/ButtonLoader';
import { clearSelectedUser } from '../redux/selectedUserSlice';
import { FiPaperclip } from "react-icons/fi";
import Attachment from './Attachment';
import toast from 'react-hot-toast';

function Message() {
  const dispatch = useDispatch();
  const attachmentRef = useRef();
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(true);
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
    setLoading(false);
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/sendMessage/${receiverId}`,
      { message, token },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }).then((res) => {
        setMessage('');
        dispatch(setNewMessage(res.data.newMessage));
      }).catch((error) => {
        console.log(error);
      }).finally(() => setLoading(true));
  }

  async function fetchMessages() {
    if (!receiverId) {
      return;
    }
    setChatLoading(true);
    await axios.get(`${process.env.REACT_APP_SERVER_URL}/getMessage/${receiverId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }).then((res) => {
        dispatch(setMessages(res.data.allConversation.messages));
        console.log(res.data.allConversation.messages);
      }).catch((error) => {
        console.log(error);
      }).finally(() => setChatLoading(false));
  }

  useEffect(() => {
    dispatch(clearMessages());
    fetchMessages();
  }, [receiverId]);

  useEffect(() => {
    dispatch(clearSelectedUser());
  }, [])

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

  const attachmentHandler = () => {
    attachmentRef.current.click();
  };
  async function attachmentChangeHandler(e) {
    const myfile = e.target.files[0];
    const formData = new FormData();
    formData.append('file', myfile);
    console.log("formData: ", formData);
    setLoading(false);
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/sendAttachment/${receiverId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      }).then((res) => {
        e.target.value = null;
        dispatch(setNewMessage(res.data.newMessage));
        console.log(res);
      }).catch((error) => {
        console.log(error);
        if (error.response.status === 403) {
          toast.error("Please Selcet file to send");
          return;
        }
        if (error.response.status === 404) {
          toast.error("File Type not supported");
          return;
        }
        if (error.response.status === 405) {
          toast.error("File should be less then 10MB");
          return;
        }
        if (error.response.status === 400) {
          toast.error("Missing Sender or Receiver");
          return;
        }
        if (error.response.status === 401) {
          toast.error("Sender or Receiver DoesNot Exits");
          return;
        }
        if (error.response.status === 500) {
          toast.error("Internal Server Error");
          return;
        }
      }).finally(() => setLoading(true));
  }
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
            {chatLoading
              ?
              <h1 className='loading-chats'>Loading Chats...</h1>
              :
              <div className="message-box-container">
                {(allMessage && allMessage.length > 0) &&
                  allMessage.map((mess) => {
                    return <div key={mess._id}>
                      {(mess.receiverId === receiverId)
                        ?
                        <div className="right-align">
                          {mess.message
                            ?
                            <span>{mess.message}</span>
                            :
                            <Attachment attachment={mess.attachment} />
                          }
                        </div>
                        :
                        <div className="left-align">
                          {mess.message
                            ?
                            <span>{mess.message}</span>
                            :
                            <Attachment attachment={mess.attachment} />
                          }
                        </div>
                      }
                    </div>
                  })
                }
                <div ref={messageEndRef} />
              </div>
            }
            <div className="send-msg-box">
              <form onSubmit={msgSubmitHandler} autocomplete="off">
                <input
                  type="text"
                  placeholder='message...'
                  name='message'
                  onChange={messageInputHandler}
                  value={message}
                  readOnly={!loading}
                />
                <div id='message-attachment'>
                  <FiPaperclip onClick={attachmentHandler} />
                  <input
                    type="file"
                    name="attachment"
                    id="attachment"
                    ref={attachmentRef}
                    style={{ display: 'none' }}
                    onChange={attachmentChangeHandler}
                    disabled={!loading}
                    autocomplete="off"
                  />
                </div>
                <button type="submit">
                  {loading
                    ?
                    <MdSend id='send-btn' />
                    :
                    <div className='send-btn-loader'><ButtonLoader /></div>
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default Message;
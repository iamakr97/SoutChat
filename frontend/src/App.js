import './App.css';
import Chats from './Pages/Chats';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './redux/authSlice';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import io from 'socket.io-client';
import { setOnlienUsers } from './redux/onlienUserSlice';
import { clearSocket, setSocket } from './redux/socketSlice';
import Profile from './Pages/Profile';


function App() {
  const { socket } = useSelector(store => store.socket);
  const { isLoggedIn, userId } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    const chatToken = window.localStorage.getItem("chatToken");
    const userId = window.localStorage.getItem("userId");
    if (chatToken) {
      const decodedToken = jwtDecode(chatToken);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem('chatToken');
        localStorage.removeItem("userId");
      } else {
        const data = {
          token: chatToken,
          _id: userId
        }
        dispatch(login(data));
      }
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      const socket = io(`${process.env.REACT_APP_SERVER_DOMAIN}`, {
        query: {
          userId: userId,
        },
      })
      socket.on("getOnlineUsers", (user) => {
        dispatch(setOnlienUsers(user));
      })
      dispatch(setSocket(socket));
      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        dispatch(clearSocket());
      }
    }
  }, [isLoggedIn])


  return (
    <div className="App">
      <Routes>
        <Route exact path='/' element={<Chats />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/profile' element={<Profile/>} />
      </Routes>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ButtonLoader from '../Components/ButtonLoader';
import { login } from '../redux/authSlice';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function Login() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, []);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [loginData, setLogindata] = useState({
    username: "",
    password: ""
  });

  function changeHandler(e) {
    setLogindata(prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    });
  }
  async function loginHandler(e) {
    e.preventDefault();
    if (buttonLoading) {
      return;
    }
    if ((loginData.username) === '' || (loginData.password) === '') {
      toast.error("Fill all the Details");
      return;
    }
    setButtonLoading(true);
    const load = toast.loading("Please Wait...");
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/login`,
      {
        username: loginData.username,
        password: loginData.password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      .then((response) => {
        dispatch(login(response.data.user))
        window.localStorage.setItem("chatToken", response.data.token);
        window.localStorage.setItem("userId", response.data.user._id);
        toast.success("LoggedIn Successfully");
        setLogindata(
          {
            username: "",
            password: "",
          }
        );
        navigate('/');
      })
      .catch((err) => {
        console.log(err)
        if (err.response.status === 400) {
          toast.error("Please fill all the details... ");
          return;
        }
        if (err.response.status === 401) {
          toast.error("User not found");
          return;
        }
        if (err.response.status === 403) {
          toast.error("Password Incorrect");
          return;
        }
        if (err.response.status === 500) {
          toast.error("Something Went Wrong, Please try again");
          return;
        }
      }).finally(() => {
        toast.dismiss(load);
        setButtonLoading(false);
      })
  }
  return (
    <>
      <div className='sout-chat-ball'>
        <h2>Sout-Chat</h2>
      </div>
      <div className='signupFormContainer'>
        <form onSubmit={loginHandler} className='form-container'>
          <h2 className='form-heading'>Enter Details for Login</h2>
          <input
            type="text"
            name="username"
            id="username"
            placeholder='Enter Your Username'
            value={loginData.username}
            onChange={changeHandler}
            autoComplete='off'
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder='Enter Password'
            value={loginData.password}
            onChange={changeHandler}
            autoComplete='off'
          />
          <button type="submit" className='signup-btn'  >
            {buttonLoading
              ?
              <ButtonLoader />
              :
              <span>Login</span>
            }
          </button>
          <Link to='/signup' className='btn2 signup-btn'>Signup</Link>
        </form>
      </div>
    </>


  )
}

export default Login;
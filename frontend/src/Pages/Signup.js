import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import './Signup.css';
import ButtonLoader from '../Components/ButtonLoader';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function Signup() {

    const { isLoggedIn } = useSelector(state => state.auth);
    const navigate = useNavigate();
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, []);
    const [buttonLoading, setButtonLoading] = useState(false);

    const [signupData, setSignupData] = useState({
        name: "",
        username: "",
        password: "",
        confirmPassword: ""
    });
    function changeHandler(e) {
        setSignupData(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        });
    }

    function signupHandler(e) {
        e.preventDefault();
        if (buttonLoading) {
            return;
        }
        // console.log(signupData);
        if (signupData.name === '' || signupData.email === '' || signupData.password === '' || signupData.confirmPassword === '') {
            toast.error("Please fill all details");
            return;
        }
        if (signupData.password !== signupData.confirmPassword) {
            toast.error("Password and confirm password does not match")
            return;
        }

        const load = toast.loading("Please Wait...");
        const email = signupData.email;
        setButtonLoading(true);
        axios.post(`${process.env.REACT_APP_SERVER_URL}/signup`,
            {
                name: signupData.name,
                username: signupData.username,
                password: signupData.password
            },
            {
                withCredentials: true
            })
            .then((response) => {
                // console.log(response);
                toast.success("User Registered Successfully");
                navigate('/');
            })
            .catch((err) => {
                console.log("err message :", err)
                if (err.response.status === 401) {
                    toast.error("User already exits ");
                    return;
                }
                if (err.response.status === 500) {
                    toast.error("Something Went Wrong, Please try again");
                    return;
                }
            }).finally(() => {
                toast.dismiss(load);
                setButtonLoading(false);
            });

    }
    return (
        <>
            <div className='sout-chat-ball'>
                <h2>Sout-Chat</h2>
            </div>
            <div className='signupFormContainer'>
                <form onSubmit={signupHandler} className='form-container'>
                    <h2 className='form-heading'>Enter Details for Registration</h2>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        placeholder='Enter Your Name'
                        value={signupData.name}
                        onChange={changeHandler}
                        autoComplete='off'
                    />
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder='Enter Your Username'
                        value={signupData.username}
                        onChange={changeHandler}
                        autoComplete='off'
                    />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder='Enter Password'
                        value={signupData.password}
                        onChange={changeHandler}
                        autoComplete='off'
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder='confirm Password'
                        value={signupData.confirmPassword}
                        onChange={changeHandler}
                        autoComplete='off'
                    />
                    <button type="submit" className='signup-btn'>
                        {buttonLoading
                            ?
                            <ButtonLoader />
                            :
                            <span>Register</span>
                        }
                    </button>
                    <p className='form-heading'>Already have an Account <Link to='/login'>Login</Link></p>
                </form>
            </div>
        </>
    )
}

export default Signup;
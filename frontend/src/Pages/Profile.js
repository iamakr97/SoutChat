import axios from 'axios';
import { FaEdit } from "react-icons/fa";
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
    const imageRef = useRef(null);
    const { isLoggedIn, token } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
    async function fetchMyProfile() {
        const load = toast.loading("Please Wait")
        await axios.get(`${process.env.REACT_APP_SERVER_URL}/myProfile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }).then((res) => {
            console.log(res.data);
            setUserDetails(res.data.user);
        }).catch((error) => {
            console.log(error);
        }).finally(() => toast.dismiss(load))
    }
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
        fetchMyProfile();
    }, [])
    function imageInputHandler() {
        imageRef.current.click();
    }
    async function updateProfilePicHandler(e) {
        const file = e.target.files[0];
        if (!file) {
            toast.error("Please select an image.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        const load = toast.loading("Uploading...");
        await axios.post(`${process.env.REACT_APP_SERVER_URL}/updateProfilePic`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
        }).then(() => {
            toast.success("Profile Pic Updated Successfully");
        }).catch((error) => {
            toast.error("Internal Server Error")
        }).finally(() => {
            toast.dismiss(load);
        })
        fetchMyProfile();
    }
    return (
        <div className='profile-container'>
            {userDetails &&
                <div className="profile">
                    <div className='profile-image-container'>
                        <img src={userDetails.profilePic} alt="User Pic" />
                        <FaEdit onClick={imageInputHandler} id='edit-btn-pic' />
                        <input type="file" name="profilePic" id="profilePic" ref={imageRef} onChange={updateProfilePicHandler} />
                    </div>
                    <h3>{userDetails.name}</h3>
                    <p><span>Username: </span>{userDetails.username}</p>
                </div>
            }
        </div>
    );
}

export default Profile;
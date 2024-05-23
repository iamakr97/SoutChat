import React from 'react';
import './UserListCard.css';
import { useSelector } from 'react-redux';

function UserListCard({ user }) {
    const { allOnlineUser } = useSelector(store => store.onlineUser);
    function isOnline(id) {
        return allOnlineUser.includes(id);
    }
    return (
        <div className="user" key={user._id}>
            <div className='user-image-container'>
                <img src={user.profilePic} alt="User Image" />
                {isOnline(user._id) &&
                    <div className="green-dot"></div>
                }
            </div>
            <div className='user-details'>
                <h3>{user.name}</h3>
                <p>last message</p>
            </div>
        </div>
    );
}

export default UserListCard;
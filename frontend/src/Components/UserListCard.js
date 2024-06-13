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
                {user.name.length < 18
                    ?
                    <h3>{user.name}</h3>
                    :
                    <h3>{user.name.substring(0, 18)}</h3>
                }
                {isOnline(user._id)
                    ?
                    <p>Online</p>
                    :
                    <p>last seen recently</p>
                }
            </div>
        </div>
    );
}

export default UserListCard;
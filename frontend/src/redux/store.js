import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import selectedUserSlice from './selectedUserSlice';
import messagesSlice from './messagesSlice';
import onlienUserSlice from './onlienUserSlice';
import socketSlice from './socketSlice';


export const store = configureStore({
    reducer: {
        auth: authSlice,
        selectedUser: selectedUserSlice,
        messages: messagesSlice,
        onlineUser: onlienUserSlice,
        socket: socketSlice
    }
})
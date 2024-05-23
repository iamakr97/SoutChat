import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    receiverId: null,
    name: null,
    profilePic: null
};

export const selectedUserSlice = createSlice({
    name: "selectedUser",
    initialState,
    reducers: {
        setSelectedUser: (state, action) => {
            state.receiverId = action.payload._id;
            state.name = action.payload.name;
            state.profilePic = action.payload.profilePic;
        },
        clearSelectedUser: (state, action) => {
            state.receiverId = null;
            state.name = null;
            state.profilePic = null;
        }
    }
})

export const { setSelectedUser, clearSelectedUser } = selectedUserSlice.actions;
export default selectedUserSlice.reducer;
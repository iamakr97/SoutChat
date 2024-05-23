import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allOnlineUser: []
}

export const onlineUserSlice = createSlice({
    name: "onlineUser",
    initialState,
    reducers: {
        setOnlienUsers: (state, actions) => {
            state.allOnlineUser = actions.payload;
        },
        clearOnlineUsers: (state, actions) => {
            state.allOnlineUser = [];
        }
    }
})

export const { setOnlienUsers, clearOnlineUsers } = onlineUserSlice.actions;
export default onlineUserSlice.reducer;
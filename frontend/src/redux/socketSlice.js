import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    socket: null
};

export const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setSocket: (state, actions) => {
            state.socket = actions.payload;
        },
        clearSocket: (state, actions) => {
            state.socket = null;
        }
    }
})

export const { setSocket, clearSocket } = socketSlice.actions;
export default socketSlice.reducer;
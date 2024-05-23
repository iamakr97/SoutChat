import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    token: null,
    userId: null
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, actions) => {
            state.isLoggedIn = true;
            state.token = actions.payload.token;
            state.userId = actions.payload._id;
        },
        logout: (state, actions) => {
            state.isLoggedIn = false;
            state.token = null;
            state.userId = null;
        }
    }
})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
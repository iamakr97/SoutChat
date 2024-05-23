import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allMessage: []
};

export const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setMessages: (state, action) => {
            state.allMessage = action.payload;
        },
        clearMessages: (state, action) => {
            state.allMessage = [];
        },
        setNewMessage: (state, action)=>{
            state.allMessage.push(action.payload);
        }
    }
})

export const { setMessages, clearMessages, setNewMessage } = messagesSlice.actions;
export default messagesSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

export const chatsSlice = createSlice({
    name: "chats",
    initialState: {
        chatLoading: false,
        selectedChat: null,
        listChats: [],
        notification: []
    },
    reducers: {
        ShowChatLoading(state){
            state.chatLoading=true;
        },
        HideChatLoading(state){
            state.chatLoading=false;
        },
        SetSelectedChat(state,action){
            state.selectedChat = action.payload;
        },
        SetListChats(state,action){
            state.listChats = action.payload;
        },
        SetNotification(state,action){
            state.notification = action.payload;
        },
    },
})

export const { SetSelectedChat, ShowChatLoading, HideChatLoading, SetListChats, SetNotification } = chatsSlice.actions

export default chatsSlice.reducer
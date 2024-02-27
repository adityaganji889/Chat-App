import usersSlice from "./usersSlice";
import loaderSlice from "./loaderSlice";
import { configureStore } from "@reduxjs/toolkit";
import chatsSlice from "./chatsSlice";

const store = configureStore({
    reducer: {
        users: usersSlice,
        loaders: loaderSlice,
        chats: chatsSlice
    }
})

export default store
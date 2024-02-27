import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../apicalls/users";
import { message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import { SetUser } from "../redux/usersSlice";
import { fetchChats } from "../apicalls/chats";
import { SetListChats, ShowChatLoading, HideChatLoading } from "../redux/chatsSlice";


function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
//   const getSongsData = async () => {
//     try {
//       dispatch(showLoading());
//       message.loading("Getting Songs...", 0.5);
//       const response = await getAllSongs();
//       if (response.success) {
//         setTimeout(() => {
//           dispatch(hideLoading());
//           dispatch(setAllSongs(response.data));
//           message.success(response.message);
//         }, 500);
//       } else {
//         setTimeout(() => {
//           dispatch(hideLoading());
//           message.info(response.message);
//         }, 500);
//       }
//     } catch (error) {
//       setTimeout(() => {
//         dispatch(hideLoading());
//         message.error(error.message);
//       }, 500);
//     }
//   };
  const getData = async () => {
    try {
      message.loading("Getting Logged In User Info...", 0.5);
      const response = await getUserInfo();
      if (response.success) {
        setTimeout(() => {
          message.success(response.message);
          dispatch(SetUser(response.data));
          // fetchChatsData();
        //   getSongsData();
        }, 500);
      } else {
        setTimeout(() => {
          message.error(response.message);
        }, 500);
      }
    } catch (error) {
      setTimeout(() => {
        message.error(error.message);
      }, 500);
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      getData();
    }
  }, []);

  return <div>{children}</div>;
}

export default ProtectedRoute;
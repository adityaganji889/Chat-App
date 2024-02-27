import React, { useState } from "react";
import "../resources/default-layout.css";
import { Dropdown, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice";
import { message } from "antd";
import Profile from "./Profile";
// import { removeAllSongs, removeCurrentTime, removeSelectedPlaylist, removeSelectedPlaylistForEdit, removeSelectedSong, removeSelectedSongIndex, setIsNotPlaying } from "../redux/actions/songActions";
import { HideLoading } from "../redux/loaderSlice";
import { Avatar, Menu, MenuButton, Button, MenuList, MenuItem, MenuDivider } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { HideChatLoading, SetSelectedChat } from "../redux/chatsSlice";

function DefaultLayout({ children }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const { user } = useSelector((state) => state.users);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };
  return (
    <div className="layout">
      <div className="header d-flex justify-content-between">
        <div
          onClick={() => {
            window.location.href="/home";
          }}
        >
          <h1 className="logo">
            <i className="ri-message-3-fill"></i> Chat App
          </h1>
        </div>
        <div className="d-flex align-items-center text-white">
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
              <Avatar size="sm" cursor="pointer" name={user?.name} src={user?.profilePicture}/>
            </MenuButton>
            <MenuList color="black">
              <MenuItem onClick={() => setShow(true)}>My Profile</MenuItem>
              <MenuDivider />
              <MenuItem onClick={() => navigate("/updateEmail")}>Update Email</MenuItem>
              <MenuDivider />
              <MenuItem  onClick={() => navigate("/updatePassword")}>Update Password</MenuItem>
              <MenuDivider />
              <MenuItem  onClick={() => {
                  message.loading("Logging out...", 0.5);
                  setTimeout(() => {
                    dispatch(SetUser(null));
                    dispatch(SetSelectedChat(null));
                    // dispatch(removeSelectedSongIndex());
                    // dispatch(removeSelectedSong());
                    // dispatch(removeAllSongs());
                    // dispatch(removeSelectedPlaylist());
                    // dispatch(removeSelectedPlaylistForEdit());
                    // dispatch(removeCurrentTime());
                    // dispatch(setIsNotPlaying());
                    dispatch(HideChatLoading());
                    dispatch(HideLoading());
                    message.success("Your Logged Out Successfully");
                    localStorage.removeItem("token");
                    // localStorage.removeItem("selectedSong");
                    navigate("/");
                  }, 500);
                }}>Logout</MenuItem>
            </MenuList>
          </Menu>
          {/* <Dropdown>
            <Dropdown.Toggle className="btn btn-info">
              <i className="ri-user-3-line"></i> {user?.name}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {user?.isAdmin && (
                <Dropdown.Item onClick={() => navigate("/admin/usersList")}>
                  Admin Panel
                </Dropdown.Item>
              )}
              <Dropdown.Item onClick={() => setShow(true)}>
                Edit Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/updateEmail")}>
                Update Email
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate("/updatePassword")}>
                Update Password
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  message.loading("Logging out...", 0.5);
                  setTimeout(() => {
                    dispatch(SetUser(null));
                    // dispatch(removeSelectedSongIndex());
                    // dispatch(removeSelectedSong());
                    // dispatch(removeAllSongs());
                    // dispatch(removeSelectedPlaylist());
                    // dispatch(removeSelectedPlaylistForEdit());
                    // dispatch(removeCurrentTime());
                    // dispatch(setIsNotPlaying());
                    dispatch(HideLoading());
                    message.success("Your Logged Out Successfully");
                    localStorage.removeItem("token");
                    // localStorage.removeItem("selectedSong");
                    navigate("/");
                  }, 500);
                }}
              >
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}
        </div>
      </div>
      {show && (
        <Profile
          show={show}
          setShow={setShow}
          handleClose={handleClose}
          handleShow={handleShow}
        />
      )}
      <Container className="shadow-lg p-5 bg-body-tertiary rounded">
        {children}
      </Container>
    </div>
  );
}

export default DefaultLayout;
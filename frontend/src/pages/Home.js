import React, { useState } from 'react'
import DefaultLayout from '../components/DefaultLayout'
import {Box} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import SideDrawer from '../components/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';

function Home() {
  const {user} = useSelector(state=>state.users);
  const [fetchAgain,setFetchAgain] = useState(false);
  // const [isOnline, setIsOnline] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  return (
    <DefaultLayout>
         {user && <SideDrawer fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
         <Box p="0.8rem">
           <div className='d-flex justify-content-between'>
           {user && <MyChats fetchAgain={fetchAgain} onlineUsers={onlineUsers} setOnlineUsers={setOnlineUsers}/>}
           {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} onlineUsers={onlineUsers} setOnlineUsers={setOnlineUsers}/>}
           </div>
         </Box>
    </DefaultLayout>
  )
}

export default Home
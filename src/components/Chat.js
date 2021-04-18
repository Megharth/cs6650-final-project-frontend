import { Grid } from '@material-ui/core';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import LeftPane from './LeftPane';
import RightPane from './RightPane';

import '../css/Chat.css';

const socket = io(process.env.REACT_APP_SOCKET_URL, { autoConnect: false });
socket.auth = {email: window.localStorage.getItem('user')};
socket.connect();

const Chat = () => {
    const [users, setUsers] = useState({});
    const [selectedUser, setSelectedUser] = useState('');
    const [chats, setChats] = useState({});

    useEffect(() => {
        socket.on("connect_error", (err) => {
            console.log(err.message)
        });

        socket.on("users", (newUsers) => {
            delete newUsers[window.localStorage.getItem('user')];
            setUsers(newUsers);
        });

        socket.on("new connection", (user) => {
            setUsers(prevUsers => {
                prevUsers[user.email] = user.id;
                return Object.assign({}, prevUsers);
            });
        });

        socket.on("user disconnected", (email) => {
            setUsers(prevUsers => {
                delete prevUsers[email];
                return Object.assign({}, prevUsers);
            });
        });

        socket.on("message", ({message, from}) => {
            setChats(prevChats => {
                if(prevChats[from] && prevChats[from].length > 0)
                    prevChats[from].push(message);
                else
                    prevChats[from] = [message]

                return Object.assign({}, prevChats);
            })
        });

        return () => socket.disconnect();
    }, []);

    return(
        <div>
            <Grid container spacing={0}>
                <LeftPane users={users} setSelectedUser={setSelectedUser} chats={chats} />
                <RightPane users={users}    
                    selectedUser={selectedUser}
                    chats={chats}
                    setChats={setChats}
                    socket={socket}
                />
            </Grid>
        </div>
    );
}

export default Chat;
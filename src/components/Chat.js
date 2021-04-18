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
        fetch(process.env.REACT_APP_API_URL + 'users')
            .then(async (response) => {
                const {users} = await response.json();
                setUsers(() => {
                    const temp = {}; 
                    users
                        .filter((user) => user.email !== window.localStorage.getItem('user'))
                        .forEach((user) => {
                            temp[user.email] = {name: user.name, online:user.online}
                        });
                    return Object.assign({}, temp);
                });
            })
    }, []);

    useEffect(() => {
        socket.on("connect_error", (err) => {
            console.log(err.message)
        });

        socket.on("new connection", (user) => {
            console.log('new connection', user);
            setUsers(prevUsers => {
                if(prevUsers[user.email])
                    prevUsers[user.email].online = true
                return Object.assign({}, prevUsers);
            })
        });

        socket.on("user disconnected", (email) => {
            console.log('user disconnected', email);
            setUsers(prevUsers => {
                if(prevUsers[email])
                    prevUsers[email].online = false
                return Object.assign({}, prevUsers);
            })
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
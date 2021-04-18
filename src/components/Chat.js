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
        fetch(process.env.REACT_APP_API_URL + 'chats/' + window.localStorage.getItem('user'))
            .then(async (response) => {
                const {messages} = await response.json();
                const chats = {};
                messages.forEach(message => {
                    if(message.sender === window.localStorage.getItem('user')){
                        if(chats[message.receiver]) {
                            chats[message.receiver].messages.push(message);
                        } else {
                            chats[message.receiver] = {
                                messages: [message],
                                user: message.receiver
                            }
                        }
                    } else{
                        if(chats[message.sender]) 
                            chats[message.sender].messages.push(message);
                        else {
                            chats[message.sender] = {
                                messages: [message],
                                user: message.sender
                            }
                        }
                    }
                });

                setChats(prevChats => Object.assign({}, chats));
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
                if(prevChats[from] && prevChats[from].messages.length > 0)
                    prevChats[from].messages.push(message);
                else
                    prevChats[from] = {
                        messages: [message],
                        user: from
                    }

                return Object.assign({}, prevChats);
            })
        });

        return () => socket.disconnect();
    }, []);

    return(
        <div>
            <Grid container spacing={0}>
                <LeftPane users={users} 
                    setSelectedUser={setSelectedUser} 
                    chats={chats}
                    setChats={setChats} 
                />
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
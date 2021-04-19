import { Grid } from '@material-ui/core';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LeftPane from './LeftPane';
import RightPane from './RightPane';

import '../css/Chat.css';

const socket = io(process.env.REACT_APP_SOCKET_URL, { autoConnect: false });


const Chat = () => {
    const [thisUser, setThisUser] = useState('');
    const [users, setUsers] = useState({});
    const [selectedUser, setSelectedUser] = useState('');
    const [chats, setChats] = useState({});
    const location = useLocation();

    useEffect(() => {
        if(location.state.user)
            setThisUser(location.state.user);
        else
            setThisUser(window.localStorage.getItem('user'));
            
        socket.auth = {email: location.state.user};
        socket.connect();
        fetch(process.env.REACT_APP_API_URL + 'users')
            .then(async (response) => {
                const {users} = await response.json();
                setUsers(() => {
                    const temp = {}; 
                    users
                        .filter((user) => user.email !== thisUser)
                        .forEach((user) => {
                            temp[user.email] = {name: user.name, online:user.online}
                        });
                    return Object.assign({}, temp);
                });
            });
    }, [location.state.user, thisUser]);

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + 'chats/' + thisUser)
            .then(async (response) => {
                const {messages, chatList} = await response.json();
                const chats = {};
                messages.forEach(message => {
                    if(message.sender === thisUser){
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
                // console.log(chatList, chats);
                // chatList.forEach(user => {
                //     if(chats[user.email])
                //         chats[user.email] = {...chats[user.email], name: user.name, room: user.room};
                //     else 
                //         chats[user.email] = {name: user.name, room: user.room};
                // });

                setChats(() => Object.assign({}, chats));
            })
    }, [thisUser]);

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
                    thisUser={thisUser}
                />
                <RightPane users={users}    
                    selectedUser={selectedUser}
                    chats={chats}
                    setChats={setChats}
                    socket={socket}
                    thisUser={thisUser}
                />
            </Grid>
        </div>
    );
}

export default Chat;
import { Grid } from '@material-ui/core';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LeftPane from './LeftPane';
import RightPane from './RightPane';

import '../css/Chat.css';

const socket = io(process.env.REACT_APP_SOCKET_URL, { autoConnect: false });

// timesync in place on frontend side
// const ts = timesync.create({
//   server: socket,
//   interval: 5000
// });

// timesync in place on frontend side
// ts.on('sync', function (state) {
//   console.log('sync ' + state + '');
// });

// timesync in place on frontend side
// ts.on('change', function (offset) {
//   console.log('changed offset: ' + offset + ' ms');
// });

// timesync in place on frontend side
// ts.send = function (socket, data, timeout) {
//       //console.log('send', data);
//       return new Promise(function (resolve, reject) {
//         var timeoutFn = setTimeout(reject, timeout);
//
//         socket.emit('timesync', data, function () {
//           clearTimeout(timeoutFn);
//           resolve();
//         });
//       });
//     };



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
                            temp[user.email] = {name: user.name, online:user.online, room: user.room}
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
                        if(chats[message.receiver] && chats[message.receiver].messages) {
                            chats[message.receiver].messages.push(message);
                        } else {
                            chats[message.receiver] = {
                                messages: [message],
                                user: message.receiver
                            }
                        }
                    } else if(message.receiver === thisUser) {
                        if(chats[message.sender])
                            chats[message.sender].messages.push(message);
                        else {
                            chats[message.sender] = {
                                messages: [message],
                                user: message.sender
                            }
                        }
                    } else {
                        if(chats[message.receiver] && chats[message.receiver].messages)
                            chats[message.receiver].messages.push(message);
                        else {
                            chats[message.receiver] = {
                                messages: [message],
                                user: message.sender
                            }
                        }
                    }
                });

                chatList.forEach(user => {
                    if(user.email !== thisUser) {
                        if(chats[user.email])
                            chats[user.email] = {...chats[user.email], name: user.name, room: user.room, online: user.online};
                        else
                            chats[user.email] = {messages: [], name: user.name, room: user.room, user: user.email, online: user.online};

                    }
                });
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
            });
            setChats(prevChats => {
                if(prevChats[user.email])
                    prevChats[user.email].online = true
                return Object.assign({}, prevChats);
            });
        });

        socket.on("user disconnected", (email) => {
            console.log('user disconnected', email);
            setUsers(prevUsers => {
                if(prevUsers[email])
                    prevUsers[email].online = false
                return Object.assign({}, prevUsers);
            });
            setChats(prevChats => {
                if(prevChats[email])
                    prevChats[email].online = false
                return Object.assign({}, prevChats);
            });
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

        // // timesync in place on frontend side
        // socket.on('timesync', function (data) {
        //   console.log('receive', data);
        //   //ts.receive(null, data);
        // });

        socket.on('groupMessage', ({message, from}) => {
            // console.log(message, from);
            setChats(prevChats => {
                prevChats[from].messages.push(message);
                return Object.assign({}, prevChats);
            })
        })

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
                    setUsers={setUsers}
                    socket={socket}
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

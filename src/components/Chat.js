import MuiAlert from '@material-ui/lab/Alert';
import { Grid, Snackbar } from '@material-ui/core';
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LeftPane from './LeftPane';
import RightPane from './RightPane';

import '../css/Chat.css';

const Chat = () => {
    const [thisUser, setThisUser] = useState('');
    const [users, setUsers] = useState({});
    const [selectedUser, setSelectedUser] = useState('');
    const [chats, setChats] = useState({});
    const [server, setServer] = useState('');
    const [socketServer, setSocketServer] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState(false);
    const [socket, setSocket] = useState(null);


    const location = useLocation();

    useEffect(() => {
        if(location.state.user)
            setThisUser(location.state.user);
        else
            setThisUser(window.localStorage.getItem('user'));

        if(location.state.server && location.state.socketServer) {
            setServer(location.state.server);
            setSocketServer(location.state.socketServer);
            let s = io(location.state.socketServer, { autoConnect: false })            
            s.auth = {email: location.state.user};
            s.connect();
            setSocket(s);
        } else {
            const servers = process.env.REACT_APP_SERVERS.split(', ');
            const port = servers[Math.floor(Math.random() * servers.length)];
            setServer(`http://localhost:${port}/`)
            const socketPort = parseInt(port) + 10
            setSocketServer(`http://localhost:${socketPort}/`);
            setToastMsg(`Connected to localhost:${port} and localhost:${socketPort}`);
            setShowToast(true);
            let s = io(`http://localhost:${socketPort}`, { autoConnect: false })            
            s.auth = {email: location.state.user};
            s.connect();
            setSocket(s);
        }

        fetch(server + 'users')
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
    }, [location.state.user, thisUser, server, location.state.server, location.state.socketServer]);

    useEffect(() => {
        fetch(server + 'chats/' + thisUser)
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
    }, [thisUser, server]);

    useEffect(() => {
        if(socket) {
            
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

        }
    }, []);

    const Alert = (props) => (<MuiAlert elevation={6} variant="filled" {...props} />);


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
                    server={server}
                />
                <RightPane users={users}
                    selectedUser={selectedUser}
                    chats={chats}
                    setChats={setChats}
                    socket={socket}
                    thisUser={thisUser}
                    server={server}
                />
            </Grid>
            <Snackbar open={showToast} autoHideDuration={3000} onClose={() => setShowToast(false)}>
                <Alert severity='success' onClose={() => setShowToast(false)}>
                    {toastMsg}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Chat;

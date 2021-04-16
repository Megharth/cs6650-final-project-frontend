import {Grid, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemIcon, 
    Divider,
    TextField,
} from '@material-ui/core';
import {io} from 'socket.io-client';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SendIcon from '@material-ui/icons/Send';
import '../css/Chat.css';
import { useEffect, useState } from 'react';

const socket = io(process.env.REACT_APP_SOCKET_URL, { autoConnect: false });
socket.auth = {email: window.localStorage.getItem('user')};
socket.connect();

const Chat = () => {
    const [users, setUsers] = useState({});
    const [selectedUser, setSelectedUser] = useState('');
    const [chats, setChats] = useState({});
    const [input, setInput] = useState('');

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

    const createList = (emails) => {
        return emails.length > 0 ? (
            <List>
                {
                    emails.map(user => (
                        <div key={user}>
                            <ListItem button onClick={() => setSelectedUser(user)}>
                                <ListItemIcon><AccountCircleIcon fontSize="large" /></ListItemIcon>
                                <ListItemText primary={user} secondary={chats[user] ? chats[user][chats[user].length - 1].message : 'Start a conversation'} />
                            </ListItem>
                            <Divider />
                        </div>
                    ))
                }
            </List>
        ) : (
            <div className="no-user">No users online</div>
        );
    }

    const renderMessages = () => {
        return chats[selectedUser] ? chats[selectedUser].map(msg => (
            <div className="message" key={msg.time}>
                <span className={msg.sender === selectedUser ? 'left-message' : 'right-message'}>{msg.message}</span>
            </div>
        )) : (
            <div className="no-user">Type a message to start chatting</div>
        );
    }

    const sendMessage = () => {
        console.log(socket);
        socket.emit('message', {
            message: {
                message: input,
                sender: window.localStorage.getItem('user'),
                receiver: selectedUser,
                time: new Date(), 
            },
            to: users[selectedUser]
        });

        setChats(prevChats => {
            const message = {
                message: input,
                sender: window.localStorage.getItem('user'),
                receiver: selectedUser,
                time: new Date(), 
            };

            if(prevChats[selectedUser] && prevChats[selectedUser].length > 0){ 
                prevChats[selectedUser].push(message);
            } else {
                prevChats[selectedUser] = [message];
            }
            console.log(prevChats);

            return Object.assign({}, prevChats);
        });
        setInput('');
    }

    return(
        <div>
            <Grid container spacing={0}>
                <Grid item sm={3} xs={12}>
                    <div id="left-pane">                        
                        {createList(Object.keys(users))}
                    </div>
                </Grid>
                <Grid item sm={9} xs={12}>
                    {selectedUser ? (
                        <div id="right-pane">
                            <div className="header-container">
                                <span className="header-username">{selectedUser}</span>
                            </div>
                        
                            <div className="message-container">
                                {renderMessages()}
                            </div>
                            
                            <Grid container className="input-container">
                                <Grid item xs={11}>
                                    <TextField 
                                        className="message-input"
                                        fullWidth
                                        onChange={(e) => {
                                            setInput(e.target.value);
                                        }}
                                        // onKeyPress={(e) => { 
                                        //     if(e.key === 'Enter') {sendMessage(); console.log('here');} 
                                        // }}
                                        variant="outlined" 
                                        value={input}
                                        placeholder="Type your Message"
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <SendIcon color="action" className="send-icon" onClick={sendMessage} />
                                </Grid>
                            </Grid>
                        </div>
                    ) : (
                        <div className="no-user">Please select a chat to see messages</div>
                    )}

                </Grid>
            </Grid>
        </div>
    );
}

export default Chat;
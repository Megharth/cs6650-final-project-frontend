import {Grid, 
    TextField,
} from '@material-ui/core';
import { useState } from 'react';

import SendIcon from '@material-ui/icons/Send';

const RightPane = ({users, selectedUser, chats, setChats, socket, thisUser}) => {
    const [input, setInput] = useState('');

    const renderMessages = () => {
        return chats[selectedUser] ? chats[selectedUser].messages.map(msg => (
            <div className="message" key={msg.time}>
                <span className={msg.sender === selectedUser ? 'left-message' : 'right-message'}>{msg.message}</span>
            </div>
        )) : (
            <div className="no-user">Type a message to start chatting</div>
        );
    }

    const sendMessage = () => {
        socket.emit('message', {
            message: {
                message: input,
                sender: window.localStorage.getItem('user'),
                receiver: selectedUser,
                time: new Date(), 
            },
            to: selectedUser
        });

        setChats(prevChats => {
            const message = {
                message: input,
                sender: window.localStorage.getItem('user'),
                receiver: selectedUser,
                time: new Date(), 
            };

            if(prevChats[selectedUser] && prevChats[selectedUser].messages.length > 0){ 
                prevChats[selectedUser].messages.push(message);
            } else {
                prevChats[selectedUser] = {
                    messages: [message],
                    user: users[selectedUser]
                };
                
                fetch(process.env.REACT_APP_API_URL + 'addToChat', {
                    method: 'POST',
                    body: JSON.stringify({receiver: selectedUser, sender: thisUser}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            }
            return Object.assign({}, prevChats);
        });

        setInput('');
    }

    return(
        <Grid item sm={9} xs={12}>
            {selectedUser ? (
                <div id="right-pane">
                    <div className="header-container">
                        <span className="header-username">{users[selectedUser] ? users[selectedUser].name : selectedUser}</span>
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
                                onKeyPress={(e) => { 
                                    if(e.key === 'Enter') {sendMessage();} 
                                }}
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
    );
}

export default RightPane;
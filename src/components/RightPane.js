import {Grid, 
    TextField,
} from '@material-ui/core';
import { useState } from 'react';

import SendIcon from '@material-ui/icons/Send';

const RightPane = ({users, selectedUser, chats, setChats, socket}) => {
    const [input, setInput] = useState('');

    const renderMessages = () => {
        return chats[selectedUser.email] ? chats[selectedUser.email].map(msg => (
            <div className="message" key={msg.time}>
                <span className={msg.sender === selectedUser.email ? 'left-message' : 'right-message'}>{msg.message}</span>
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
                receiver: selectedUser.email,
                time: new Date(), 
            },
            to: selectedUser.email
        });

        setChats(prevChats => {
            const message = {
                message: input,
                sender: window.localStorage.getItem('user'),
                receiver: selectedUser.email,
                time: new Date(), 
            };

            if(prevChats[selectedUser.email] && prevChats[selectedUser.email].length > 0){ 
                prevChats[selectedUser.email].push(message);
            } else {
                prevChats[selectedUser.email] = [message];
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
                        <span className="header-username">{selectedUser.name}</span>
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
    );
}

export default RightPane;
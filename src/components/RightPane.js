import {Grid,
    TextField,
    Button,
} from '@material-ui/core';
import { useEffect, useState } from 'react';

import SendIcon from '@material-ui/icons/Send';

const RightPane = ({users, selectedUser, chats, setChats, socket, thisUser}) => {
    const [input, setInput] = useState('');
    const [messageTime, setMessageTime] = useState('');

    ////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
      // timesync in place on frontend side
      socket.on('timesync', function (data) {
        console.log('receive', data);
        setMessageTime(data.time);
        //ts.receive(null, data);
      });
    }, []);
    ////////////////////////////////////////////////////////////////////////////




    const renderMessages = () => {
        return chats[selectedUser] ? chats[selectedUser].messages.map(msg => (
            <div className="message" key={msg.time}>
                <div className={msg.sender === thisUser ? 'right-message': 'left-message'}>
                    {users[selectedUser].room && users[msg.sender] && msg.sender !== thisUser && (
                        <div className="sender-name">{users[msg.sender].name}</div>
                    )}
                    <div>{msg.message}</div>
                </div>
            </div>
        )) : (
            <div className="no-user">Type a message to start chatting</div>
        );
    }

    const sendMessage = () => {
        console.log(users[selectedUser].room)
        // we add timesync event
        //
        socket.emit('timesync');

        if(users[selectedUser].room) {
            socket.emit('groupMessage', {
                message: {
                    message: input,
                    sender: thisUser,
                    receiver: selectedUser,
                    //time: new Date(),
                    time: messageTime,
                },
                to: selectedUser
            });

            setChats((prevChats) => {
                const message = {
                    message: input,
                    sender: thisUser,
                    receiver: selectedUser,
                    time: new Date(),
                };

                prevChats[selectedUser].messages.push(message);

                return Object.assign({}, prevChats);
            });
        } else {
            socket.emit('message', {
                message: {
                    message: input,
                    sender: thisUser,
                    receiver: selectedUser,
                    time: new Date(),
                },
                to: selectedUser
            });

            setChats((prevChats) => {
                const message = {
                    message: input,
                    sender: thisUser,
                    receiver: selectedUser,
                    time: new Date(),
                };

                if(prevChats[selectedUser] && prevChats[selectedUser].messages.length > 0){
                    prevChats[selectedUser].messages.push(message);
                } else {
                    prevChats[selectedUser] = {
                        messages: [message],
                        ...users[selectedUser]
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
        }


        setInput('');
    }

    const joinRoom = async (roomCode) => {
        await fetch(process.env.REACT_APP_API_URL + 'addRoom', {
            method: 'POST',
            body: JSON.stringify({
                email: thisUser,
                room: {...users[roomCode], email: roomCode}
            }),
            headers: {
                'Content-Type': 'Application/json'
            }
        });
        setChats(prevChats => {
            prevChats[roomCode] = {
                messages: [],
                ...users[roomCode]
            }
            return Object.assign({}, prevChats);
        });
    }
    return(
        <Grid item sm={9} xs={12}>
            {selectedUser ? (
                <div id="right-pane">
                    <div className="header-container">
                        <span className="header-username">
                            {users[selectedUser].name} {users[selectedUser].room && `| code: ${selectedUser}`}
                            {users[selectedUser].room && (
                                <Button
                                    className="join-btn"
                                    variant="outlined"
                                    disabled={chats[selectedUser] !== undefined}
                                    onClick={() => joinRoom(selectedUser)}
                                >
                                    {chats[selectedUser] ? 'Joined' : 'Join'}
                                </Button>
                            )}
                        </span>
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

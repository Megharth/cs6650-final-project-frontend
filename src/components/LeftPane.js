import {Grid, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemIcon, 
    Divider,
    Popper,
    TextField,
    Card,
    Button,
    Badge,
    Input,
    InputAdornment,
    Tooltip
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';

import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import GroupIcon from '@material-ui/icons/Group';

const LeftPane = ({users, setSelectedUser, chats, 
        setChats, thisUser, setUsers, 
        socket, server, setShowToast, setToastMsg, resetConnection}) => {
    const [accMenu, setAccMenu] = useState(null);
    const [roomMenu, setRoomMenu] = useState(null);
    const [name, setName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [search, setSearch] = useState('');
    const history = useHistory(); 
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    useEffect(() => {
        fetch(server + 'user/' + thisUser)
        .then(async (result) => {
            const {name} = await result.json();
            if(name) {
                setName(name);
            }
        })
        .catch(err => {
            setToastMsg(`Can't contact server. Please reconnect again`);
            setShowToast(true);
        })
    }, [thisUser]);

    const getLastMessage = (chats, email) => {
        return chats[email] && chats[email].messages && chats[email].messages.length > 0 ? chats[email].messages[chats[email].messages.length - 1].message : 'Start a conversation';
    }

    const createList = (users) => {
        console.log(users);
        return Object.keys(users).length > 0 ? (
            <List>
                {
                    users.map(([email, user]) => (
                        <div key={email.trim()}>
                            <ListItem button onClick={() => {
                                setSelectedUser(email.trim());
                                setSearch('');
                            }}>
                                <ListItemIcon>
                                    {user.online ? (
                                        <Badge 
                                            variant="dot" 
                                            overlap="circle" 
                                            className="online" 
                                            color="primary">
                                            <AccountCircleIcon fontSize="large" />
                                        </Badge>
                                    ) : user.room ? <GroupIcon fontSize="large" /> : <AccountCircleIcon fontSize="large" />}
                                </ListItemIcon>
                                <ListItemText primary={user.name} secondary={getLastMessage(chats, email)} />
                            </ListItem>
                            <Divider />
                        </div>
                    ))
                }
            </List>
        ) : (
            <div className="no-user">Search a contact and start chatting</div>
        );
    }

    const logout = () => {
        history.push('/');
        window.localStorage.setItem('user', null);
    }

    const saveName = async () => {
        try {
            const result = await fetch(server + 'updateName', {
                method: 'POST',
                body: JSON.stringify({email: thisUser, name}),
                headers: {
                    'Content-Type': 'Application/json'
                }
            });
        } catch(err) {
            setToastMsg(`Can't contact server. Please reconnect again`);
            setShowToast(true);
        }
    }

    const generateString = () => {
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < 5; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    
        return result;
    }

    const createRoom = async () => {
        const code = generateString();
        setChats(prevChats => {
            prevChats[code.trim()] = {
                messages: [],
                name: roomName,
                user: code.trim(),
                room: true,
                online: false
            }

            return Object.assign({}, prevChats);
        });

        setUsers(prevUsers => {
            prevUsers[code.trim()] = {
                name: roomName,
                online: false,
                room: true
            }

            return Object.assign({}, prevUsers);
        })

        try {
            await fetch(server + 'createRoom', {
                method: 'POST',
                body: JSON.stringify({email: code.trim(), user: thisUser, name: roomName}),
                headers: {
                    'Content-Type': 'Application/json'
                }
            });
        } catch(err) {
            setToastMsg(`Can't contact server. Please reconnect again`);
            setShowToast(true);
        }

        socket.emit('joinRoom', {
            roomCode: code.trim(),
        })

        setRoomMenu(null);
        setRoomName('');
    }

    return(
        <Grid id="left-pane" item sm={3} xs={12}>
            <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); }}
                id="input-with-icon-adornment"
                placeholder="Search contacts"
                startAdornment={
                    <InputAdornment position="start">
                    <SearchIcon />
                    </InputAdornment>
                }
            />
            <div className="chat-list">     
                {search === '' ? createList(
                        Object.entries(chats).map(([email, obj]) => obj.name ? [email.trim(), obj] : [email.trim(), users[email.trim()]] )
                    ) : 
                    createList(
                        Object.entries(users).filter(([email, user]) => (email.includes(search) || user.name.includes(search)) )
                    )
                }
            </div>
            <div className="actions">
                <Tooltip title="Account">
                    <PersonOutlineOutlinedIcon 
                        aria-describedby="account-menu" 
                        onClick={(e) => { accMenu ? setAccMenu(null) : setAccMenu(e.currentTarget); setRoomMenu(null); }} 
                        fontSize="large" 
                        className="action" />
                </Tooltip>
                <Tooltip title="Create a room">
                    <AddIcon
                        aria-describedby="room-menu" 
                        onClick={(e) => { roomMenu ? setRoomMenu(null) : setRoomMenu(e.currentTarget); setAccMenu(null); }}  
                        fontSize="large" 
                        className="action" />
                </Tooltip>
                <Tooltip title="Logout">
                    <PowerSettingsNewIcon 
                        fontSize="large" 
                        className="action" 
                        onClick={logout} />
                </Tooltip>
                <Popper
                    id="account-menu"
                    anchorEl={accMenu}
                    open={Boolean(accMenu)}
                >
                    <Card className="account-menu">
                        <TextField label="Email" variant="outlined" disabled value={thisUser} />
                        <TextField label="Name" 
                            variant="outlined" 
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Button color="primary" onClick={saveName} variant="outlined">Save</Button>
                    </Card>
                </Popper>
                <Popper
                    id="room-menu"
                    anchorEl={roomMenu}
                    open={Boolean(roomMenu)}
                >
                    <Card className="account-menu">
                        <TextField label="Room name" 
                            variant="outlined" 
                            placeholder="Enter room name"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                        />
                        <Button color="primary" onClick={createRoom} variant="outlined">Create</Button>
                    </Card>
                </Popper>
            </div>
        </Grid>
    )
}

export default LeftPane;
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

const LeftPane = ({users, setSelectedUser, chats}) => {
    const [accMenu, setAccMenu] = useState(null);
    const [roomMenu, setRoomMenu] = useState(null);
    const [name, setName] = useState('');
    const [roomName, setRoomName] = useState('');
    const [search, setSearch] = useState('');
    const history = useHistory(); 

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + 'user/' + window.localStorage.getItem('user'))
        .then(async (result) => {
            const {name} = await result.json();
            if(name) {
                setName(name);
            }
        })
    }, []);

    const getLastMessage = (chats, email) => {
        return chats[email] ? chats[email].messages[chats[email].messages.length - 1].message : 'Start a conversation';
    }
    const createList = (users) => {
        
        return Object.keys(users).length > 0 ? (
            <List>
                {
                    users.map(([email, user]) => (
                        <div key={email}>
                            <ListItem button onClick={() => {
                                setSelectedUser(email);
                                setSearch('');
                            }}>
                                <ListItemIcon>
                                    <Badge 
                                        variant="dot" 
                                        overlap="circle" 
                                        className={user.online ? 'online' : 'offline'} 
                                        color="primary">
                                        <AccountCircleIcon fontSize="large" />
                                    </Badge>
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
        const result = await fetch(process.env.REACT_APP_API_URL + 'updateName', {
            method: 'POST',
            body: JSON.stringify({email: window.localStorage.getItem('user'), name}),
            headers: {
                'Content-Type': 'Application/json'
            }
        });
        console.log(result);
    }

    const createRoom = () => {

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
                {search === '' ? createList(Object.entries(chats).map(([email, _obj]) => { return [email, users[email]]})) : 
                    createList(
                        Object.entries(users).filter(([email, user]) => email.includes(search) || user.name.includes(search) )
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
                        <TextField label="Email" variant="outlined" disabled value={window.localStorage.getItem('user')} />
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
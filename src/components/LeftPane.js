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
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

const LeftPane = ({users, setSelectedUser, chats}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [name, setName] = useState('');
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

    const createList = (users) => {
        return Object.keys(users).length > 0 ? (
            <List>
                {
                    Object.entries(users).map(([email, user]) => (
                        <div key={email}>
                            <ListItem button onClick={() => setSelectedUser({name: user.name, email})}>
                                <ListItemIcon>
                                    <Badge 
                                        variant="dot" 
                                        overlap="circle" 
                                        className={user.online ? 'online' : 'offline'} 
                                        color="primary">
                                        <AccountCircleIcon fontSize="large" />
                                    </Badge>
                                </ListItemIcon>
                                <ListItemText primary={user.name} secondary={chats[email] ? chats[email][chats[email].length - 1].message : 'Start a conversation'} />
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
    return(
        <Grid id="left-pane" item sm={3} xs={12}>
            <div className="chat-list">                        
                {createList(users)}
            </div>
            <div className="actions">
                <PersonOutlineOutlinedIcon 
                    aria-describedby="account-menu" 
                    onClick={(e) => { anchorEl? setAnchorEl(null) : setAnchorEl(e.currentTarget); }} 
                    fontSize="large" 
                    className="action" />
                <PowerSettingsNewIcon 
                    fontSize="large" 
                    className="action" 
                    onClick={logout} />
                <Popper
                    id="account-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
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
            </div>
        </Grid>
    )
}

export default LeftPane;
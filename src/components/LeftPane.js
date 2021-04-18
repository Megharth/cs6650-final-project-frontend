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
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

const LeftPane = ({users, setSelectedUser, chats}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const history = useHistory(); 

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

    const logout = () => {
        history.push('/');
        window.localStorage.setItem('user', null);
    }
    return(
        <Grid id="left-pane" item sm={3} xs={12}>
            <div className="chat-list">                        
                {createList(Object.keys(users))}
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
                        <TextField label="Email" variant="outlined" disabled value={window.localStorage.getItem('user')}></TextField>
                        <TextField label="Name" variant="outlined" placeholder="Enter your name"></TextField>
                        <Button color="primary" variant="outlined">Save</Button>
                    </Card>
                </Popper>
            </div>
        </Grid>
    )
}

export default LeftPane;
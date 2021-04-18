import {Grid, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemIcon, 
    Divider,
    // TextField,
} from '@material-ui/core';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

const LeftPane = ({users, setSelectedUser, chats}) => {
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

    return(
        <Grid id="left-pane" item sm={3} xs={12}>
            <div className="chat-list">                        
                {createList(Object.keys(users))}
            </div>
            <div className="actions">
                <PersonOutlineOutlinedIcon fontSize="large" className="action" />
                <PowerSettingsNewIcon fontSize="large" className="action" />
            </div>
        </Grid>
    )
}

export default LeftPane;
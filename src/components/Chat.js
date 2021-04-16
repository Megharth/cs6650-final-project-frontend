import {Grid, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemIcon, 
    Divider,
    Card,
    CardContent,
    TextField,
    Icon
} from '@material-ui/core';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SendIcon from '@material-ui/icons/Send';

import '../css/Chat.css';

const Chat = () => {
    return(
        <div>
            <Grid container spacing={0}>
                <Grid item sm={3} xs={12}>
                    <div id="left-pane">
                        <List>
                            <ListItem button>
                                <ListItemIcon><AccountCircleIcon fontSize="large" /></ListItemIcon>
                                <ListItemText primary="User 1" secondary="Some message" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemIcon><AccountCircleIcon fontSize="large" /></ListItemIcon>
                                <ListItemText primary="User 1" secondary="Some message" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemIcon><AccountCircleIcon fontSize="large" /></ListItemIcon>
                                <ListItemText primary="User 1" secondary="Some message" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemIcon><AccountCircleIcon fontSize="large" /></ListItemIcon>
                                <ListItemText primary="User 1" secondary="Some message" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemIcon><AccountCircleIcon fontSize="large" /></ListItemIcon>
                                <ListItemText primary="User 1" secondary="Some message" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemIcon><AccountCircleIcon fontSize="large" /></ListItemIcon>
                                <ListItemText primary="User 1" secondary="Some message" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemIcon><AccountCircleIcon fontSize="large" /></ListItemIcon>
                                <ListItemText primary="User 1" secondary="Some message" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemIcon><AccountCircleIcon fontSize="large" /></ListItemIcon>
                                <ListItemText primary="User 1" secondary="Some message" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemIcon><AccountCircleIcon fontSize="large" /></ListItemIcon>
                                <ListItemText primary="User 1" secondary="Some message" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemIcon><AccountCircleIcon fontSize="large" /></ListItemIcon>
                                <ListItemText primary="User 1" secondary="Some message" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemIcon><AccountCircleIcon fontSize="large" /></ListItemIcon>
                                <ListItemText primary="User 1" secondary="Some message" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemIcon><AccountCircleIcon fontSize="large" /></ListItemIcon>
                                <ListItemText primary="User 1" secondary="Some message" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemIcon><AccountCircleIcon fontSize="large" /></ListItemIcon>
                                <ListItemText primary="User 1" secondary="Some message" />
                            </ListItem>
                            <Divider />
                            <ListItem button>
                                <ListItemIcon><AccountCircleIcon fontSize="large" /></ListItemIcon>
                                <ListItemText primary="User 1" secondary="Some message" />
                            </ListItem>
                            <Divider />
                        </List>
                    </div>
                </Grid>
                <Grid item sm={9} xs={12}>
                    <div id="right-pane">
                        <div className="header-container">
                            <span className="header-username">User 1</span>
                        </div>
                        <div className="message-container">
                            <div className="message">
                                <span className="left-message">Message 1</span>
                            </div>
                            <div className="message">
                                <span className="right-message">Message 1</span>
                            </div>
                            <div className="message">
                                <span className="left-message">Message 1</span>
                            </div>
                            <div className="message">
                                <span className="left-message">Message 1</span>
                            </div>
                            <div className="message">
                                <span className="right-message">Message 1</span>
                            </div>
                            <div className="message">
                                <span className="left-message">Message 1</span>
                            </div>
                            <div className="message">
                                <span className="left-message">Message 1</span>
                            </div>
                            <div className="message">
                                <span className="right-message">Message 1</span>
                            </div>
                            <div className="message">
                                <span className="left-message">Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1</span>
                            </div>
                            <div className="message">
                                <span className="right-message">Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1Message 1</span>
                            </div>
                            <div className="message">
                                <span className="left-message">Message 1</span>
                            </div>
                            <div className="message">
                                <span className="right-message">Message 1</span>
                            </div>
                            <div className="message">
                                <span className="left-message">Message 1</span>
                            </div>
                        </div>
                        
                        <Grid container className="input-container">
                            <Grid item xs={11}>
                                <TextField 
                                    className="message-input"
                                    fullWidth
                                    // onKeyUp={(e) => { setEmail(e.target.value); }}
                                    variant="outlined" 
                                    placeholder="Type your Message"
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <SendIcon color="action" className="send-icon" />
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default Chat;
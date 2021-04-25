import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import '../css/Login.css';
import {TextField, Button, Snackbar} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState(false);
  const [toastStatus, setToastStatus] = useState(false);
  const [server, setServer] = useState('');
  const [socketServer, setSocketServer] = useState('');
  const errorCodes = new Set([401, 403, 404]);
  const history = useHistory();

  const Alert = (props) => (<MuiAlert elevation={6} variant="filled" {...props} />);

  useEffect(() => {
	const servers = process.env.REACT_APP_SERVERS.split(', ');
	const port = servers[Math.floor(Math.random() * servers.length)];
	setServer(`http://localhost:${port}/`)
	const socketPort = parseInt(port) + 10;
	setSocketServer(`http://localhost:${socketPort}/`);
	setToastMsg(`Connected to localhost:${port} and localhost:${socketPort}`);
	setToastStatus(200);
	setShowToast(true);
  }, []);

  const login = async () => {
	const response = await fetch(server + 'login', {
	  method: 'POST',
	  body: JSON.stringify({email, password}),
	  headers: {
		'Content-Type': 'application/json'
	  }
	});
	const body = await response.json();
	setToastMsg(body.message);
	setToastStatus(body.status);
	setShowToast(true);
	if(!errorCodes.has(body.status)){
		window.localStorage.setItem('user', email);
		history.push({
			pathname: 'chat',
			state: {user: email, server, socketServer}
		});
	}
  }

  const register = async () => {
	const response = await fetch(server + 'register', {
	  method: 'POST',
	  body: JSON.stringify({email, password}),
	  headers: {
		'Content-Type': 'application/json'
	  }
	});
	const body = await response.json();
	setToastMsg(body.message);
	setToastStatus(body.status);
	setShowToast(true);
  }
  return(
	<div>
	  <div id="login">
		<TextField 
		  onKeyUp={(e) => { setEmail(e.target.value); }}
		  variant="outlined" 
		  label="email" 
		  fullWidth />
		<TextField 
		  onKeyUp={(e) => { setPassword(e.target.value); }}
		  variant="outlined" 
		  label="password" 
		  type="password" 
		  onKeyPress={(e) => { 
			if(e.key === 'Enter') login(); 
		  }}
		  fullWidth/>
		<Button variant="contained" size="large" color="primary" onClick={login}>Login</Button>
		<Button variant="contained" size="large" color="secondary" onClick={register}>Register</Button>
	  </div>
	  <Snackbar open={showToast} autoHideDuration={3000} onClose={() => setShowToast(false)}>
		<Alert severity={errorCodes.has(toastStatus) ? 'error' : 'success'} onClose={() => setShowToast(false)}>
		  {toastMsg}
		</Alert>
	  </Snackbar>
	</div>
  )
} 
export default Login;

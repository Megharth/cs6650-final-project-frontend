import {useState} from 'react';

import '../css/Login.css';
import {TextField, Button, Snackbar} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState(false);
  const [toastStatus, setToastStatus] = useState(false);
  const errorCodes = new Set([401, 403, 404]);
  const API = 'http://localhost:8000/';

  const Alert = (props) => (<MuiAlert elevation={6} variant="filled" {...props} />);

  const login = async () => {
    const response = await fetch(API + 'login', {
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

  const register = async () => {
    const response = await fetch(API + 'register', {
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

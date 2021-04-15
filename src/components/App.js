// import logo from './logo.svg';
import '../css/Login.css';
import {TextField, Button} from '@material-ui/core';

const Login = () => {
  return(
    <div id="login">
      <TextField variant="outlined" label="email" fullWidth/>
      <TextField variant="outlined" label="password" type="password" fullWidth/>
      <Button variant="contained" size="large" color="primary">Login</Button>
      <Button variant="contained" size="large" color="secondary">Register</Button>
    </div>
  )
} 
export default Login;

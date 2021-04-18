import { Toolbar } from '@material-ui/core';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import PersonIcon from '@material-ui/icons/Person';

import '../css/Navbar.css';

const Navbar = () => {
    return(
        <div>
            <Toolbar className="navbar" color="primary">
                <div className="actions">
                    <PersonIcon fontSize="large"/>
                    <PowerSettingsNewIcon fontSize="large"/>
                </div>
            </Toolbar>
        </div>
    )
}

export default Navbar;
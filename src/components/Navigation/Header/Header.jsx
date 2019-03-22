import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import styles from './header.scss';

export default class Header extends Component {
  static displayName = 'Header';

  /*static propTypes = {
    days: PropTypes.array.isRequired,
  };*/

  static contextTypes = {
    baseUrl: PropTypes.string.isRequired,
    project: PropTypes.string.isRequired,
    isMobile: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      auth: true,
      anchorEl: null,
      name: "Dafault",
      email: "",
      avatar: "",
    }
  }
  
  componentDidMount() {
    this.setState({
      name: window.user.name || "Dafault",
      email: window.user.email || "",
      avatar: window.user.photo || ""
    });
  }

  handleChange = event => {
    this.setState({ auth: event.target.checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  
  render() {
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    let avatar = (<AccountCircle />);
    if(this.state.avatar){
      avatar =  (<div className = {"btnAvatar"}> 
                  <img src={this.state.avatar} alt = {this.state.avatar}></img>
                </div>);
    }
    return (
      <header>
        <div className={"root"}>
          <AppBar position="static">
            <Toolbar>
              <div className={"grow"}>
              <Typography variant="h6" color="inherit" >
                {this.state.name}
              </Typography>
              </div>
              {auth && (
                <div>
                  <IconButton
                    aria-owns={open ? 'menu-appbar' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleMenu}
                    color="inherit"
                  >
                    {avatar}
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={this.handleClose}
                  >
                    <MenuItem><a href = "./auth/logout">Logout</a></MenuItem>
                  </Menu>
                </div>
              )}
            </Toolbar>
          </AppBar>
        </div>
      </header>
    );
  }
};
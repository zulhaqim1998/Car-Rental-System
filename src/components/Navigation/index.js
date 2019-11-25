import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';

import { AuthUserContext } from '../Session';
// import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { AccountCircle } from '@material-ui/icons';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Navigation = ({ ...props }) => (
  <AuthUserContext.Consumer>
    {authUser => <NewNavigationNonAuth authUser={authUser} theme={props.theme}
                                       history={props.history} firebase={props.firebase}/>
    }
  </AuthUserContext.Consumer>
);


function NewNavigationNonAuth({...props}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          {/*<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">*/}
          {/*  <MenuIcon/>*/}
          {/*</IconButton>*/}
          <Typography variant="h6" className={classes.title}>
            <Link to={ROUTES.LANDING}>AUTOHAVEN</Link>
          </Typography>

          {props.authUser ? (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => {
                  props.history.push(ROUTES.HOME);
                  handleClose()
                }}>Home</MenuItem>

                <MenuItem onClick={() => {
                  props.history.push(ROUTES.ACCOUNT);
                  handleClose();
                }}>My account</MenuItem>
                <MenuItem onClick={() => {
                  props.firebase.doSignOut();
                  handleClose();
                }}>Sign out</MenuItem>
              </Menu>
            </div>
          ) : <div>
            <Link to={ROUTES.SIGN_IN}><Button color="inherit">Login</Button></Link>
            <Link to={ROUTES.SIGN_UP}><Button color="inherit">Signup</Button></Link>
          </div>}
        </Toolbar>
      </AppBar>
    </div>
  );
};

// const NavigationAuth = ({ authUser }) => (
//   <ul>
//     <li>
//       <Link to={ROUTES.LANDING}>Landing</Link>
//     </li>
//     <li>
//       <Link to={ROUTES.HOME}>Home</Link>
//     </li>
//     <li>
//       <Link to={ROUTES.ACCOUNT}>Account</Link>
//     </li>
//     {/*{!!authUser.roles[ROLES.ADMIN] && (*/}
//     {/*  <li>*/}
//     {/*    <Link to={ROUTES.ADMIN}>Admin</Link>*/}
//     {/*  </li>*/}
//     {/*)}*/}
//     <li>
//       <SignOutButton/>
//     </li>
//   </ul>
// );
//
// const NavigationNonAuth = () => (
//   <ul>
//     <li>
//       <Link to={ROUTES.LANDING}>Landing</Link>
//     </li>
//     <li>
//       <Link to={ROUTES.SIGN_IN}>Sign In</Link>
//     </li>
//   </ul>
// );

export default compose(withRouter, withFirebase)(Navigation);

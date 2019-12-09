import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';


const Landing = ({...props}) => (
  <div>
    <Grid container direction="row">
      <Grid sm={5} md={5} style={{ backgroundColor: 'none', marginTop: 30 }}>
        <p style={{ fontSize: 70, textAlign: 'center' }}>
          {' '}
          Car rental. <br/> Anytime. <br/> Anywhere.{' '}
        </p>
        <Button onClick={() => props.history.push(ROUTES.SIGN_UP)}
                style={{fontSize: 50, borderRadius: 50, padding: '0 20px',
          marginLeft: 'auto', marginRight: 'auto', display: 'block'}}
                variant="contained"
                color="primary">
          Sign Up
        </Button>
      </Grid>
      <Grid sm={7} md={7}>
        <div className="column2" style={{ backgroundColor: 'none' }}>
          <img style={{ width: '100%', marginLeft: 0, marginRight: 'auto', display: 'block' }}
               src={require('../../images/vector1.png')}/>
        </div>
      </Grid>
    </Grid>
    <div style={{marginTop: 30}}>
      <a
        style={{
          color: '#6D7A71',
          fontWeight: 'bold',
          textDecoration: 'none',
          paddingLeft: 50,
        }}
        href
      >
        Cars
      </a>
      <a
        style={{
          color: '#6D7A71',
          fontWeight: 'bold',
          textDecoration: 'none',
          paddingLeft: 50,
        }}
        href
      >
        FAQ
      </a>
      <a
        style={{
          color: '#6D7A71',
          fontWeight: 'bold',
          textDecoration: 'none',
          paddingLeft: 50,
        }}
        href
      >
        About Us
      </a>
      <a
        style={{
          float: 'right',
          paddingRight: 50,
          color: '#6D7A71',
          fontWeight: 'bold',
          textDecoration: 'none',
        }}
        href
      >
        Login
      </a>
    </div>
  </div>
);

export default withRouter(Landing);

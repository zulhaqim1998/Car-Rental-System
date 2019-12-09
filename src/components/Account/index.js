import React, { Component } from 'react';
import { compose } from 'recompose';

import {
  AuthUserContext,
  withAuthorization,
} from '../Session';
import { withFirebase } from '../Firebase';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import NewCarForm from '../NewCarForm';
import { Link } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import EditProfileFrom from '../EditProfileForm';

const styles = theme => ({
  textField: {
    margin: 10,
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
    padding: theme.spacing(2, 4, 3),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 500,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
    height: 0,
  },
  cardContent: {
    flexGrow: 1,
  },
});

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <LoginManagement authUser={authUser}/>
      </div>
    )}
  </AuthUserContext.Consumer>
);

class LoginManagementBase extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSignInMethods: [],
      error: null,
      newCarModalOpen: false,
      creditCard: '',
      phone: '',
      address: '',
      carsData: [],
    };
  }

  componentDidMount() {
    this.getCars();
  }

  onChange = event => this.setState({ [event.target.name]: event.target.value });

  getCars = async () => {
    const { firebase } = this.props;
    await firebase.cars()
      .where('ownerId', '==', this.props.authUser.uid)
      .get()
      .then(querySnapshot => {
        const data = [];
        querySnapshot.forEach((doc) => {
          let carData = doc.data();
          carData.id = doc.id;

          firebase.imageRef(carData.id).getDownloadURL().then(url => {
            this.setState({ [doc.id]: url });
          }).catch(function(error) {
            console.log(error);
          });
          data.push(carData);
        });
        this.setState({ carsData: data });
      });
  };




  renderProfileData = () => {
    const { classes, authUser } = this.props;
    const {address, phone, creditCard} = this.state;
    const isDisabled = address === '' && phone === '' && creditCard === '';

    return <Grid style={{ padding: 20 }}>
      <TextField
        variant="outlined"
        inputProps={{ readOnly: true }}
        className={classes.textField}
        fullWidth
        id="firstName"
        label="First Name"
        value={authUser.firstName}
      />
      <TextField
        variant="outlined"
        inputProps={{ readOnly: true }}
        fullWidth
        className={classes.textField}
        id="lastName"
        label="Last Name"
        value={authUser.lastName}
      />
      <TextField
        variant="outlined"
        inputProps={{ readOnly: true }}
        fullWidth
        className={classes.textField}
        id="email"
        label="Email"
        value={authUser.email}
      />
      <TextField
        variant="outlined"
        fullWidth
        className={classes.textField}
        id="phone"
        type="number"
        name="phone"
        label="Phone Number"
        onChange={this.onChange}
        value={this.state.phone}
      />
      <TextField
        variant="outlined"
        fullWidth
        className={classes.textField}
        id="address"
        name="address"
        label="Address"
        onChange={this.onChange}
        value={this.state.address}
      />
      <TextField
        variant="outlined"
        fullWidth
        className={classes.textField}
        id="creditCard"
        name="creditCard"
        type="number"
        label="Credit Card Number"
        onChange={this.onChange}
        value={this.state.creditCard}
      />
      <Button variant="outlined"
              disabled={isDisabled}
              onClick={this.updateProfile} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}}>
        Update Profile
      </Button>
    </Grid>;
  };

  renderCarRental = () => {
    if(!this.state.carsData) {
      return <div></div>
    }
    const { classes } = this.props;
    console.log(this.state.carsData)

    return <Grid container style={{padding: 20}}>
      <Button variant="outlined"
              onClick={() => this.setState({ newCarModalOpen: true })}
              style={{ display: 'block', marginLeft: 'auto', marginRight: 10 }}
              color="secondary">Add Car</Button>
      <Grid container spacing={4}>
        {this.state.carsData.map((car, index) => (
          <Grid item key={index} xs={12} sm={12} md={4}>
            <Link style={{ textDecoration: 'none' }} to={`/cars/${car.id}`}>
              <Card className={classes.card}
                    style={{ cursor: 'pointer' }}>
                <CardMedia
                  className={classes.cardMedia}
                  component="p"
                  image={this.state[car.id]}
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {car.name}
                  </Typography>
                  <Typography>
                    Booking Status: -
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Grid>;
  };

  renderNewCarModal = () => {
    const { classes, authUser } = this.props;
    return <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={this.state.newCarModalOpen}
      onClose={() => this.setState({ newCarModalOpen: false })}
      className={classes.modal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={this.state.newCarModalOpen} style={{ boxShadow: 'none', outline: 'none' }}>
        <div className={classes.paper}>
          <Typography component="h2" align="center">New Car</Typography>
          <NewCarForm authUser={authUser} onFinish={() => {
            this.getCars();
            this.setState({newCarModalOpen: false})

          }}/>
        </div>
      </Fade>
    </Modal>;
  };

  render() {
    const { error } = this.state;

    return <Grid container direction="row">
      {this.renderNewCarModal()}
      <Grid sm={12} md={5}>
        <Typography component="h2" align="center">Profile Information</Typography>
        <EditProfileFrom authUser={this.props.authUser} />
      </Grid>
      <Grid sm={12} md={7}>
        <Typography component="h2" align="center">My Cars</Typography>
        {this.renderCarRental()}
      </Grid>
    </Grid>;
  }
}

const LoginManagement = compose(withFirebase, withStyles(styles))(LoginManagementBase);


const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
)(AccountPage);

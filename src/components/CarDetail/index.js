import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import Container from '@material-ui/core/Container';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop/Backdrop';
import Fade from '@material-ui/core/Fade';
import CarRentalForm from '../CarRentalForm';



const styles = theme => ({
  image: {
    width: '100%',
    height: '100%',
    // padding: theme.spacing(2),
    textAlign: 'center',
  },
  mainDetail: {
    // padding: theme.spacing(2),
    // paddingRight: theme.spacing(8)
  },
  container: {
    padding: theme.spacing(2),
  },
  detailContainer: {
    padding: theme.spacing(2),
  },
  listItem: {
    listStyleType: 'none',
    fontSize: 20,
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
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
});

class CarDetail extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      duration: 6,
      imageUrl: null,
      carData: null,
      modalOpen: false,
    };
  }

  componentDidMount() {
    this.getCarData();
  }

  getCarData = () => {
    const carId = this.props.match.params.carId;
    this.props.firebase.car(carId)
      .get()
      .then(doc => {
        const data = doc.data();
        data.id = doc.id;
        this.setState({ carData: data });

        this.props.firebase.imageRef(data.id).getDownloadURL().then(url => {
          this.setState({ imageUrl: url });
        }).catch(function(error) {
          console.log(error);
        });
      })
      .catch(error => console.log(error));
  };

  renderModal = () => {
    const { classes } = this.props;
    return <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={this.state.modalOpen}
      onClose={() => this.setState({ modalOpen: false })}
      className={classes.modal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={this.state.modalOpen} style={{ boxShadow: 'none', outline: 'none' }}>
        <div className={classes.paper}>
          <Typography component="h2" align="center">Rent Car</Typography>
          <CarRentalForm carData={this.state.carData} />
        </div>
      </Fade>
    </Modal>;
  };

  render() {
    const { classes } = this.props;
    const { carData, imageUrl, duration } = this.state;

    if (!carData) {
      return <div></div>;
    }
    return <Grid container className={classes.container}>
      <Grid item xs={12} sm={4} md={4} lg={4}>
        {imageUrl && <img className={classes.image} src={imageUrl}/>}
      </Grid>
      {this.renderModal()}
      <Grid item xs={12} sm={8} md={8} lg={8}>
        <Container>
          <h2>{carData.name}</h2>
          <ul>
            <li className={classes.listItem}>Year manufactured: {carData.year}</li>
            <li className={classes.listItem}>Colour: {carData.colour}</li>
            <li className={classes.listItem}>Transmission: {carData.transmission}</li>
            <li className={classes.listItem}>Seats: {carData.seats}</li>
            <li style={{ marginTop: 20 }} className={classes.listItem}>
              <Typography variant="h6">RM {carData.price} <sub>/hour</sub></Typography>
            </li>
            <li className={classes.listItem}>

              <Button
                type="submit"
                variant="contained"
                style={{marginTop: 30}}
                color="primary"
                onClick={() => this.setState({modalOpen: true})}
              >
                Rent!
              </Button>
            </li>
          </ul>
        </Container>
      </Grid>
    </Grid>;
  }
}

export default compose(withFirebase, withStyles(styles))(CarDetail);

import React from 'react';
import Grid from '@material-ui/core/Grid';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import EditProfileFrom from '../EditProfileForm';
import RentalReceipt from '../RentalReceipt';
import Button from '@material-ui/core/Button';

class CheckoutPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      startTime: '',
      endTime: '',
      carData: '',
      imageUrl: null,
      ownerData: null,
      receiptData: null,
    };
  }

  componentDidMount() {
    const dateNow = new Date();
    const { startTime, endTime, carId } = this.props.match.params;
    this.setState({ startTime, endTime, dateNow });
    this.getCarData(carId);
  }

  getCarData = (carId) => {
    this.props.firebase.car(carId)
      .get()
      .then(doc => {
        const data = doc.data();
        data.id = doc.id;
        this.setState({ carData: data });
      })
      .then(() => {
        const { startTime, endTime, carData, dateNow } = this.state;
        const authUser = JSON.parse(localStorage.getItem('authUser'));

        const receiptData = {
          carId: carData.id,
          ownerId: carData.ownerId,
          startTime,
          endTime,
          dateNow,
          carName: carData.name,
          carPrice: carData.price,
          renteeId: authUser.uid,
        };

        this.setState({ receiptData });
      })
      .catch(error => console.log(error));
  };

  onSubmit = () => {
    const authUser = JSON.parse(localStorage.getItem('authUser'));
    const { startTime, endTime, receiptData, carData } = this.state;
    const { address, creditCard, phone } = authUser;

    if (!address || !creditCard || !phone) {
      return alert('Please enter all informations to process to payout.');
    }

    this.props.firebase.receipts().add(receiptData).then((docRef) => {
      const booking = {
        renteeId: authUser.uid,
        startTime,
        endTime,
        receiptId: docRef.id,
      };
      this.props.firebase.car(carData.id).update({
        bookings: this.props.firebase.fieldValue.arrayUnion(booking),
      }).catch(e => console.log(e));
    }).then(() => alert('Transaction successful! Please contact car owner for further assistance.')).catch(e => console.log(e));

  };


  render() {
    const authUser = JSON.parse(localStorage.getItem('authUser'));

    return <Grid container>
      <Grid container direction="row">
        <Grid sm={12} md={5}>
          <Typography component="h2" align="center">Profile Information</Typography>
          <EditProfileFrom authUser={authUser}/>
        </Grid>
        <Grid sm={12} md={7} style={{ paddingLeft: 20, paddingRight: 20 }}>
          {this.state.receiptData && <RentalReceipt receiptData={this.state.receiptData}/>}
          {this.state.receiptData &&
          <Button style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: 15 }}
                  onClick={this.onSubmit}
                  variant="outlined">Confirm Payment</Button>}
        </Grid>
      </Grid>
    </Grid>;
  }
}

const styles = theme => ({
  textField: {
    margin: 10,
  },
});

export default compose(withFirebase, withStyles(styles))(CheckoutPage);

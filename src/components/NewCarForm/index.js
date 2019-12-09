import React from 'react';
import Grid from '@material-ui/core/Grid';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import AttachFileIcon from '@material-ui/icons/AttachFile';

const INITIAL_STATE = {
  carName: '',
  colour: '',
  year: '',
  seats: '',
  transmission: '',
  image: null,
  price: '',
  disableButton: false
};

class NewCarForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {...INITIAL_STATE};
  }

  onChange = event => this.setState({ [event.target.name]: event.target.value });

  handleImageChange = async e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      await this.setState(() => ({ image }));
      console.log(this.state.image);
    }
  };

  submitCar = async() => {
    this.setState({disableButton: true});
    const {carName, seats, transmission, year, colour, image, price} = this.state;
    const data = {
      name: carName,
      seats,
      transmission,
      year,
      colour,
      ownerId: this.props.authUser.uid,
      price: price,
      bookings: [],
      feedbacks: []
    };

    await this.props.firebase.cars().add(data).then(docRef => {
      const carId = docRef.id;

      this.props.firebase.imageRef(carId).put(image).then(this.props.onFinish)
        .catch(e => console.log("error uploading image", e));

    })
      // .then(() => alert("New car added successfully."))
      .then(() => this.setState({...INITIAL_STATE}))
      .catch(e => console.log(e));
  };


  render() {

    const {carName, seats, transmission, year, color, image} = this.state;
    const isDisabled = carName === '' || seats === '' || year === '' || color === '' || transmission === '' || image === null || this.state.disableButton;

    return <Grid>
      <TextField
        fullWidth
        id="carName"
        name="carName"
        label="Car Name"
        onChange={this.onChange}
        value={this.state.carName}
      />
      <TextField
        fullWidth
        id="year"
        name="year"
        type="number"
        label="Year Manufactured"
        onChange={this.onChange}
        value={this.state.year}
      />
      <TextField
        fullWidth
        id="colour"
        name="colour"
        label="Colour"
        onChange={this.onChange}
        value={this.state.colour}
      />
      <TextField
        fullWidth
        id="seats"
        name="seats"
        label="Seats"
        type="number"
        onChange={this.onChange}
        value={this.state.seats}
      />
      <TextField
        fullWidth
        id="transmission"
        name="transmission"
        label="Transmission"
        onChange={this.onChange}
        value={this.state.transmission}
      />
      <TextField
        fullWidth
        id="price"
        name="price"
        type="number"
        label="Price Per Hour"
        onChange={this.onChange}
        value={this.state.price}
      />

      <input
        accept="image/*"
        onChange={this.handleImageChange}
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
      />
      <label htmlFor="raised-button-file">
        <Button variant="outlined" component="span" style={{marginTop: 10}}>
          <AttachFileIcon />  Upload Car Image
        </Button>
      </label>
      {this.state.image && <p>{this.state.image.name}</p>}

      <Button variant="outlined"
              onClick={this.submitCar}
              disabled={isDisabled}
              style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}}>
        Add Car
      </Button>
    </Grid>;
  }
}

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
  },
});

export default compose(withFirebase, withStyles(styles))(NewCarForm);


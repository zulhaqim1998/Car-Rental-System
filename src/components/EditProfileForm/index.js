import React from "react";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withStyles } from '@material-ui/styles';
import { withAuthorization } from '../Session';


class EditProfileFrom extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      creditCard: '',
      phone: '',
      address: '',
    };
  }

  componentDidMount() {
    const {address, phone, creditCard} = this.props.authUser;
    if(!!address) {
      this.setState({address});
    }
    if(!!phone) {
      this.setState({phone});
    }
    if(!!creditCard) {
      this.setState({creditCard});
    }
  }

  onChange = event => this.setState({ [event.target.name]: event.target.value });

  updateProfile = async() => {
    const {creditCard, phone, address} = this.state;

    await this.props.firebase.user(this.props.authUser.uid).set(
      {
        creditCard,
        phone,
        address,
      },
      { merge: true },
    ).then(() => alert("Profile Updated.")).then(() => window.reload()).catch(e => console.log(e));
  };

  render() {
    const {address, phone, creditCard} = this.state;
    const isDisabled = address === '' && phone === '' && creditCard === '';
    const { classes, authUser } = this.props;

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
  }
}

const styles = theme => ({
  textField: {
    margin: 10,
  }

});

const condition = authUser => !!authUser;

export default compose(withFirebase, withAuthorization(condition), withStyles(styles))(EditProfileFrom)

import React from 'react';
import DateTimePicker from 'react-datetime-picker';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withStyles } from '@material-ui/styles';
import { Button, Typography } from '@material-ui/core';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

class CarRentalForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      startTime: '',
      endTime: '',
      total: '',
    };
  }

  onStartTimeChange = async date => {

    await this.setState({ startTime: date });
    this.checkDateTime();
  };

  onEndTimeChange = async date => {
    await this.setState({ endTime: date });
    this.checkDateTime();
  };

  checkDateTime = async () => {
    const { startTime, endTime } = this.state;
    console.log(startTime, endTime);

    if (moment(startTime).isAfter(moment(endTime))) {
      this.setState({ message: 'Start time must be before end time.' });
    } else if (moment(startTime).isBefore(moment())) {
      this.setState({ message: 'Start time selected is invalid.' });
    }

    let duration = moment.duration(moment(endTime).diff(moment(startTime)));
    let hours = duration.asHours();

    this.setState({ message: '', total });

    let total = this.props.carData.price * hours;

    if (total > 0) {
      this.setState({ total });
    }

  };

  onClick = () => {
    const carId = this.props.carData.id;
    const {startTime, endTime} = this.state;

    this.props.history.push(`/checkout/${carId}/${startTime}/${endTime}`);
  };

  render() {
    const { classes } = this.props;

    return <Grid container style={{ padding: 20 }}>
      <Grid container direction="row" className={classes.dateContainer}>
        <Grid item xs={12} sm={4}>
          <Typography variant="span">Start Time: </Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          <DateTimePicker
            onChange={this.onStartTimeChange}
            format="dd/MM/yyyy hh a"
            value={this.state.startTime}
          />
        </Grid>
      </Grid>
      <Grid container direction="row" className={classes.dateContainer}>
        <Grid item xs={12} sm={4}>
          <Typography variant="span">End Time: </Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          <DateTimePicker
            format="dd/MM/yyyy hh a"
            onChange={this.onEndTimeChange}
            value={this.state.endTime}
          />
        </Grid>
      </Grid>
      {this.state.message && <Typography variant="p" style={{ color: 'red' }}>{this.state.message}</Typography>}
      {this.state.total &&
      <Grid item xs={12}><Typography style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
                                     component="b"
                                     align="center">Total: RM {this.state.total}</Typography></Grid>}

      {this.state.total &&
      <Grid item xs={12}><Button
        className={classes.button}
        onClick={this.onClick}
        variant="outlined">Go To Checkout</Button></Grid>}

    </Grid>;
  }
}

const styles = theme => ({
  textField: {
    margin: 10,
  },
  button: {
    marginTop: 20,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateContainer: {
    margin: 10,
  },
});

export default compose(withFirebase, withRouter, withStyles(styles))(CarRentalForm);

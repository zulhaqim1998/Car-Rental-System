import React from 'react';
import { Typography, Grid, Divider } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import withStyles from '@material-ui/styles/withStyles';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import moment from 'moment';

class RentalReceipt extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ownerData: null,
      renteeData: null,
    };
  }

  componentDidMount() {
    const {ownerId, renteeId} = this.props.receiptData;

    this.getUserData("ownerData", ownerId);
    this.getUserData("renteeData", renteeId);
  }

  getUserData = (role, id) => {
    this.props.firebase.user(id)
      .get()
      .then(doc => {
        const data = doc.data();
        data.id = doc.id;
        this.setState({ [role]: data });
        console.log(data)
      })
      .catch(error => console.log(error));
  };


  render() {
    const { classes } = this.props;
    const {ownerData, renteeData} = this.state;

    const {dateNow, startTime, endTime, carName, carPrice} = this.props.receiptData;

    if(!ownerData || !renteeData) {
      return <div/>
    }

    let duration = moment.duration(moment(endTime).diff(moment(startTime)));
    let hours = duration.asHours();

    let total = carPrice * hours;

    return <Grid container style={{ padding: 20, border: '1px solid #A2CEBD', borderRadius: 10 }}>
      <Grid item xs={12}>
        <Typography style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto' }} variant="h5" align="center">
          Receipt
        </Typography>
      </Grid>

      <Grid item xs={12} style={{ marginBottom: 10 }}>
        <Typography variant="h6">{ownerData.firstName} {ownerData.lastName}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="p">Address: {ownerData.address}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="p">Phone: {ownerData.phone}</Typography>
      </Grid>
      <Grid item xs={12} stryle={{ marginTop: 10 }}>
        <Typography variant="p">Email: {ownerData.email}</Typography>
      </Grid>

      <Grid item xs={12} style={{ paddingTop: 10, marginTop: 10, borderTop: '1px solid #A2CEBD' }}>
        <Typography variant="h6">Bill to</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="p">{renteeData.firstName} {renteeData.lastName}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="p">{renteeData.address}</Typography>
      </Grid>
      <Grid item xs={12} stryle={{ marginTop: 10 }}>
        <Typography variant="p">Date: {moment(dateNow).format("DD MMMM YYYY")}</Typography>
      </Grid>

      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Number</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Start</TableCell>
            <TableCell align="center">End</TableCell>
            <TableCell align="center">Hours</TableCell>
            <TableCell align="center">Unit Price</TableCell>
            <TableCell align="center">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell style={{ width: 20 }} align="right">1</TableCell>
            <TableCell align="center">{carName}</TableCell>
            <TableCell align="center">{moment(startTime).format("LLLL")}</TableCell>
            <TableCell align="center">{moment(endTime).format("LLLL")}</TableCell>
            <TableCell align="center">{hours}</TableCell>
            <TableCell align="center">RM {carPrice}</TableCell>
            <TableCell align="center">RM {total}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center">TOTAL</TableCell>
            <TableCell align="center">RM {total}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Grid>;
  }
}

const styles = theme => ({
  table: {
    minWidth: 650,
  },
});


export default compose(withFirebase, withStyles(styles))(RentalReceipt);

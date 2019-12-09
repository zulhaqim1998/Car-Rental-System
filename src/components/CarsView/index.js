import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import { Button } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import SortIcon from '@material-ui/icons/Sort';

const styles = theme => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
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
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  extraButton: {
    borderRadius: 50,
    borderWidth: 2,
    margin: 10,
  }
});

class CarsView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      carsData: [],
      isLoading: false,
      carsImages: [],

    };
  }

  componentDidMount() {
    this.getCars();
  }

  getCars = async () => {

    this.setState({ isLoading: true });
    const { firebase } = this.props;
    await firebase
      .cars()
      .get()
      .then(querySnapshot => {
        const data = [];
        querySnapshot.forEach((doc) => {
          let carData = doc.data();
          carData.id = doc.id;

          firebase.imageRef(carData.id).getDownloadURL().then(url => {
            this.setState({ [doc.id]: url });
          }).catch(function(error) {
            // Handle any errors
            console.log(error);
          });
          data.push(carData);
        });
        this.setState({ carsData: data });
      });
    this.setState({ isLoading: false });
  };

  render() {
    const { carsData, carsImages } = this.state;
    const classes = this.props.classes;

    if (carsData.length === 0) {
      return <div/>;
    }

    return <React.Fragment>
      <Container className={classes.cardGrid} maxWidth="lg">
        <div style={{marginBottom: 20}}>
          <Button className={classes.extraButton} variant="outlined"><FilterListIcon />{' '}Filter</Button>
          <Button className={classes.extraButton} variant="outlined"><SortIcon />{' '}Sort</Button>
        </div>

        <Grid container spacing={4}>
          {carsData.map((car, index) => (
            <Grid item key={index} xs={6} sm={4} md={3}>
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
                      {car.transmission}
                    </Typography>
                    {car.price && <Typography gutterBottom
                                              align="right"
                                              variant="h6"
                                              display="block"
                      // style={{ color: 'red', textAlign: 'center' }}
                                              component="h6">RM {car.price} <sub>/hour</sub></Typography>}
                  </CardContent>

                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>;
  }
}

export default compose(withRouter, withFirebase, withStyles(styles))(CarsView);

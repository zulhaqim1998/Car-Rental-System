import React from 'react';
import { withRouter } from 'react-router-dom';
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
import Button from '@material-ui/core/Button';

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
});

class CarsView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      carsData: [],
      isLoading: false,
      carsImages: []

    };
  }

  componentDidMount() {
    this.getCars();
  }

  getCars = async() => {

    this.setState({isLoading: true});
    const{firebase} = this.props;
    await firebase
      .cars()
      .get()
      .then(querySnapshot => {
        const data = [];
        const carsImages = [];
        querySnapshot.forEach((doc) => {
          let carData = doc.data();
          carData.id = doc.id;

          firebase.imageRef(carData.image).getDownloadURL().then(url => {
            // Get the download URL for 'images/stars.jpg'
            // This can be inserted into an <img> tag
            // This can also be downloaded directly
            const carImage = {id: doc.id, url: url};
            carsImages.push(carImage);
          }).catch(function(error) {
            // Handle any errors
            console.log(error);
          });
          data.push(carData);
        });
        this.setState({carsData: data, carsImages: JSON.parse(JSON.stringify(carsImages))})
      });
    this.setState({isLoading: false});
  };

  // getCarsImageUrl = () => {
  //
  // };


  render() {
    const {carsData, carsImages} = this.state;
    const classes = this.props.classes;

    if(carsData.length === 0) {
      return <div/>;
    }
    console.log(carsImages)


    return <React.Fragment>
      <Container className={classes.cardGrid} maxWidth="lg">
        {/* End hero unit */}
        <Grid container spacing={4}>
          {carsData.map((car, index) => (
            <Grid item key={index} xs={6} sm={4} md={3}>
              <Card className={classes.card}>
                {/*{console.log(carsImages.find(carImage => carImage.id === car.id))}*/}
                <CardMedia
                  className={classes.cardMedia}
                  // component="img"
                  //image={this.getImage(car.image) + ''}
                  // src={car.imageUrl}
                  //style={{height: 100, width: 400}}
                  title="Image title"
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {car.name}
                  </Typography>
                  <Typography>
                    Brand: {car.brand}
                  </Typography>
                  <Typography>
                    This is a media card. You can use this section to describe the content.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    View
                  </Button>
                  <Button size="small" color="primary">
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </React.Fragment>;
  }
}

export default compose(withRouter, withFirebase, withStyles(styles))(CarsView);

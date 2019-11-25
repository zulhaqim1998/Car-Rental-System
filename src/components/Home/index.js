import React from 'react';
import { compose } from 'recompose';

import { withAuthorization } from '../Session';
import CarsView from '../CarsView';


class HomePage extends React.Component {

  render() {
    const authUser = JSON.parse(localStorage.getItem("authUser"));

    return <div>
      <p>Logged in as: {authUser.firstName} {authUser.lastName}</p>
      {/*<h1>Home Page</h1>*/}
      {/*<p>The Home Page is accessible by every signed in user.</p>*/}
      <CarsView />

    </div>;
  }
}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
)(HomePage);

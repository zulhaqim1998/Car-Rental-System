import React from 'react';
import { compose } from 'recompose';

import withAuthorization from '../Session/withAuthorization';
import CarsView from '../CarsView';
import withAuthentication from '../Session/withAuthentication';


class HomePage extends React.Component {

  render() {
    return <div>
      <CarsView />

    </div>;
  }
}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withAuthentication,
)(HomePage);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BodyClassName from 'react-body-classname';
import classNames from 'classnames';

import { 
  Header, 
  Datatable  
} from 'components';

import styles from './Home.scss';

export default class Home extends Component {
  static displayName = 'Home';

  static contextTypes = {
    baseUrl: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 0);
  }

  render() {
    return (
      <BodyClassName className="home">
        <div className={styles.home} itemScope itemType="https://schema.org/WebPage">
          <Header />
          <div className ={styles.bodyDashboard}>
            <Datatable />
          </div>
        </div>
      </BodyClassName>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IndexLink, Link, browserHistory, withRouter } from 'react-router';
import ReactCSSTransitionReplace from 'react-css-transition-replace';
import classNames from 'classnames';
import isMobile from 'ismobilejs';

import config from 'config';
import styles from '../../../static/sass/App.scss';

@withRouter
export default class App extends Component {
  static propTypes = {
    route: PropTypes.objectOf(PropTypes.any).isRequired,
    location: PropTypes.objectOf(PropTypes.any).isRequired
  };

  static childContextTypes = {
    baseUrl: PropTypes.string,
    project: PropTypes.string,
    projectName: PropTypes.string,
    isMobile: PropTypes.object,
    urlShare: PropTypes.string,
    textTwShare: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true
    };
  }

  getChildContext() {
    return {
      baseUrl: config.baseUrl,
      project: config.project,
      projectName: config.projectName,
      isMobile,
    };
  }

  componentDidMount() {
    setTimeout(() => this.setState({ loading: false }), 0);
  }

  render() {
    const { loading } = this.state;

    const appInitialStyle = {
      opacity: loading ? '0' : '1',
      height: loading ? '100vh' : 'initial',
      transition: 'opacity 500ms linear'
    };
    return (
        <main className={styles.app} style={appInitialStyle}>
          <article className={styles.appContent}>
            <ReactCSSTransitionReplace
              component="div"
              transitionName="fade-wait"
              transitionEnterTimeout={1000}
              transitionLeaveTimeout={1000}
              className={styles.transitionContainer}
              style={{ opacity: '1', visibility: 'visible' }}
            >
              {this.props.children}
            </ReactCSSTransitionReplace>
          </article>
        </main>
    );
  }
}

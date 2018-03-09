import React from 'react';
import classNames from 'classnames';
import Menu from './menu';
import Body from './Body';
import styles from './PostLogin.scss';

const INTERVAL = 60000;

export default class PostLogin extends React.Component {
  componentDidMount() {
    this.sessionPoller = setInterval(this.validateSession.bind(this), INTERVAL);
  }

  componentWillUnmount() {
    if (this.sessionPoller) {
      clearInterval(this.sessionPoller);
    }
  }

  validateSession() {
    this.props.validateSession();
  }

  render() {
    return (
      <div className={classNames(this.props.className, styles.postLoginContainer)}>
        <Menu />
        <Body />
      </div>
    );
  }
}

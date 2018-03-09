import React from 'react';
import { connect } from 'react-redux';
import { logout } from '../actions';

class RawLogout extends React.Component {
  componentDidMount() {
    this.props.logout();
  }
  render() {
    return (
      <div />
    );
  }
}


const mapStateToProps = () => ({
});

const dispatchToActions = dispatch => ({
  logout: () => dispatch(logout()),
});

export default connect(mapStateToProps, dispatchToActions)(RawLogout);

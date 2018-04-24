import React from 'react';
import PropTypes from 'prop-types';

export default (Wrapped) => {
  class HocComponent extends React.Component {
    render() {
      const { children, ...rest } = this.props;
      const { socket } = this.context;
      return (
        <Wrapped socket={socket} {...rest}>{children}</Wrapped>
      );
    }
  }
  HocComponent.contextTypes = {
    socket: PropTypes.object,
  };
  return HocComponent;
};

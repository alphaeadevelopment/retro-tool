import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import 'styles/main.scss'; // eslint-disable-line import/no-unresolved,import/no-extraneous-dependencies
import { connect } from 'react-redux';
import { MuiThemeProvider } from 'material-ui/styles';
import theme from '../styles/theme';
import { SessionInitialization, Session } from '../pages';
import * as Selectors from '../selectors';
import * as Actions from '../actions';

export class RawApp extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { session, onJoinSession, onCreateSession, onLeaveSession, onAddResponse } = this.props;
    const { socket } = this.context;
    return (
      <MuiThemeProvider theme={theme}>
        {!session &&
          <SessionInitialization onJoinSession={onJoinSession(socket)} onCreateSession={onCreateSession(socket)} />
        }
        {session &&
          <Session
            onLeaveSession={onLeaveSession(socket, session.id)}
            session={session}
            onAddResponse={onAddResponse(socket)}
          />
        }
      </MuiThemeProvider>
    );
  }
}
RawApp.contextTypes = {
  socket: PropTypes.object,
};

const mapStateToProps = state => ({
  session: Selectors.getCurrentSession(state),
});

const dispatchToActions = dispatch => ({
  onCreateSession: socket => name => dispatch(Actions.onCreateSession(socket, name)),
  onJoinSession: socket => (name, session) => dispatch(Actions.onJoinSession(socket, name, session)),
  onLeaveSession: socket => () => dispatch(Actions.onLeaveSession(socket)),
  onAddResponse: socket => responseType => value => dispatch(Actions.onAddResponse(socket, responseType, value)),
});

export default withRouter(connect(mapStateToProps, dispatchToActions)(RawApp));

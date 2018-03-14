import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Session from './session';
import SessionInitialization from './SessionInitialization';
import * as Selectors from '../selectors';
import * as Actions from '../actions';

export class RawSessionLaunch extends React.Component { // eslint-disable-line react/prefer-stateless-function
  state = {
    sessionId: null,
  }
  componentDidMount = () => {
    const { match } = this.props;
    const { params } = match;
    const { sessionId } = params;
    this.setState({ sessionId });
  }
  componentWillReceiveProps = (nextProps) => {
    const { token, onReconnectToSession } = this.props;
    const { socket } = this.context;
    if (token && !this.props.isConnected && nextProps.isConnected) {
      onReconnectToSession(socket, token);
    }
  }
  render() {
    const {
      session, onJoinSession, onCreateSession, onLeaveSession, onAddResponse, onAddResponseType,
      onChangeStatus, onUpVote, onCancelUpVote, onSendFeedback, match, ...rest
    } = this.props;
    const { sessionId } = this.state;
    const { socket } = this.context;
    return (
      <div>
        {!session.id &&
          <SessionInitialization
            sessionId={sessionId}
            onJoinSession={onJoinSession(socket)}
            onCreateSession={onCreateSession(socket)}
          />
        }
        {session.id &&
          <Session
            onLeaveSession={onLeaveSession(socket, session.id)}
            session={session}
            onAddResponse={onAddResponse(socket)}
            onUpVote={onUpVote(socket)}
            onCancelUpVote={onCancelUpVote(socket)}
            onChangeStatus={onChangeStatus(socket)}
            onAddResponseType={onAddResponseType(socket)}
            onSendFeedback={onSendFeedback(socket)}
            {...rest}
          />
        }
      </div>
    );
  }
}
RawSessionLaunch.contextTypes = {
  socket: PropTypes.object,
};

const mapStateToProps = state => ({
  session: Selectors.getCurrentSession(state),
  isOwner: Selectors.isSessionOwner(state),
  name: Selectors.getName(state),
  token: Selectors.getToken(state),
  isConnected: Selectors.isConnected(state),
});

const dispatchToActions = dispatch => ({
  onReconnectToSession: (socket, token) => dispatch(Actions.Emit.onReconnectToSession(socket, { token })),
  onCreateSession: socket => name => dispatch(Actions.Emit.onCreateSession(socket, { name })),
  onUpVote: socket => responseId => () => dispatch(Actions.Emit.onUpVoteResponse(socket, { responseId })),
  onCancelUpVote: socket => responseId => () => dispatch(Actions.Emit.onCancelUpVoteResponse(socket, { responseId })),
  onJoinSession: socket => (name, sessionId) => dispatch(Actions.Emit.onJoinSession(socket, { name, sessionId })),
  onLeaveSession: socket => () => dispatch(Actions.Emit.onLeaveSession(socket)),
  onAddResponse: socket => responseType => value =>
    dispatch(Actions.Emit.onAddResponse(socket, { responseType, value })),
  onChangeStatus: socket => status => () => dispatch(Actions.Emit.onChangeStatus(socket, { status })),
  onAddResponseType: socket => data => dispatch(Actions.Emit.onAddResponseType(socket, data)),
  onSendFeedback: socket => responseId => message =>
    dispatch(Actions.Emit.onSendFeedback(socket, { responseId, message })),
});

export default withRouter(connect(mapStateToProps, dispatchToActions)(RawSessionLaunch));

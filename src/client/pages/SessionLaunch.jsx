import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Loadable from 'react-loadable';
import SessionInitialization from './SessionInitialization';
import * as Selectors from '../selectors';
import * as Actions from '../actions';
import { withSocket } from '../containers';

const DisplaySession = Loadable({
  loader: () => import('./DisplaySession'),
  loading: () => <div>Loading...</div>,
});

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
    const { socket, token, onReconnectToSession } = this.props;
    if (token && !this.props.isConnected && nextProps.isConnected) {
      onReconnectToSession(socket, token);
    }
  }
  render() {
    const {
      socket, session, onJoinSession, onCreateSession, onLeaveSession, onAddResponse, onAddResponseType,
      onChangeStatus, onUpVote, onCancelUpVote, onSendFeedback, onDeleteResponse, match,
      onDeleteResponseType, ...rest
    } = this.props;
    const { sessionId } = this.state;
    return (
      <React.Fragment>
        {!session.id &&
          <SessionInitialization
            sessionId={sessionId}
            onJoinSession={onJoinSession(socket)}
            onCreateSession={onCreateSession(socket)}
          />
        }
        {session.id &&
          <DisplaySession
            onLeaveSession={onLeaveSession(socket, session.id)}
            session={session}
            onAddResponse={onAddResponse(socket)}
            onUpVote={onUpVote(socket)}
            onCancelUpVote={onCancelUpVote(socket)}
            onChangeStatus={onChangeStatus(socket)}
            onAddResponseType={onAddResponseType(socket)}
            onSendFeedback={onSendFeedback(socket)}
            onDeleteResponse={onDeleteResponse(socket)}
            onDeleteResponseType={onDeleteResponseType(socket)}
            {...rest}
          />
        }
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  session: Selectors.getCurrentSession(state),
  isOwner: Selectors.isSessionOwner(state),
  name: Selectors.getName(state),
  token: Selectors.getToken(state),
  isConnected: Selectors.isConnected(state),
});

const dispatchToActions = dispatch => ({
  onReconnectToSession: (socket, token) => dispatch(Actions.Emit.reconnectToSession(socket, { token })),
  onCreateSession: socket => name => dispatch(Actions.Emit.createSession(socket, { name })),
  onUpVote: socket => responseId => () => dispatch(Actions.Emit.upVoteResponse(socket, { responseId })),
  onCancelUpVote: socket => responseId => () => dispatch(Actions.Emit.cancelUpVoteResponse(socket, { responseId })),
  onJoinSession: socket => (name, sessionId) => dispatch(Actions.Emit.joinSession(socket, { name, sessionId })),
  onLeaveSession: socket => () => dispatch(Actions.Emit.leaveSession(socket)),
  onDeleteResponse: socket => responseId => () => dispatch(Actions.Emit.deleteResponse(socket, { responseId })),
  onDeleteResponseType: socket => responseTypeId => () =>
    dispatch(Actions.Emit.deleteResponseType(socket, { responseTypeId })),
  onAddResponse: socket => responseType => value =>
    dispatch(Actions.Emit.addResponse(socket, { responseType, value })),
  onChangeStatus: socket => status => () => dispatch(Actions.Emit.changeStatus(socket, { status })),
  onAddResponseType: socket => data => dispatch(Actions.Emit.addResponseType(socket, data)),
  onSendFeedback: socket => responseId => message =>
    dispatch(Actions.Emit.sendFeedback(socket, { responseId, message })),
});

export default withSocket(withRouter(connect(mapStateToProps, dispatchToActions)(RawSessionLaunch)));

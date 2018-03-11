import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Session from './session';
import SessionInitialization from './SessionInitialization';
import * as Selectors from '../selectors';
import * as Actions from '../actions';

export class RawSessionLaunch extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      session, onJoinSession, onCreateSession, onLeaveSession, onAddResponse, onAddResponseType,
      onChangeStatus, onUpVote, onCancelUpVote, onSendFeedback, ...rest
    } = this.props;
    const { socket } = this.context;
    return (
      <div>
        {!session &&
          <SessionInitialization onJoinSession={onJoinSession(socket)} onCreateSession={onCreateSession(socket)} />
        }
        {session &&
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
});

const dispatchToActions = dispatch => ({
  onCreateSession: socket => name => dispatch(Actions.onCreateSession(socket, name)),
  onUpVote: socket => responseId => () => dispatch(Actions.onUpVoteResponse(socket, responseId)),
  onCancelUpVote: socket => responseId => () => dispatch(Actions.onCancelUpVoteResponse(socket, responseId)),
  onJoinSession: socket => (name, session) => dispatch(Actions.onJoinSession(socket, name, session)),
  onLeaveSession: socket => () => dispatch(Actions.onLeaveSession(socket)),
  onAddResponse: socket => responseType => value => dispatch(Actions.onAddResponse(socket, responseType, value)),
  onChangeStatus: socket => status => () => dispatch(Actions.onChangeStatus(socket, status)),
  onAddResponseType: socket => (question, type) => dispatch(Actions.onAddResponseType(socket, question, type)),
  onSendFeedback: socket => responseId => message => dispatch(Actions.onSendFeedback(socket, responseId, message)),
});

export default connect(mapStateToProps, dispatchToActions)(RawSessionLaunch);

import React, { useState, useEffect, useContext, useRef } from 'react';
import classes from './MessagesMainWrapper.module.css';
import { io } from 'socket.io-client';
import { useHistory, Route, Switch } from 'react-router-dom';
import SingleChat from './SingleChat';
import { AuthContext } from '../../shared/context/auth-context';

const MessagesMainWrapper = (props) => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [chatSelected, setChatSelected] = useState(false);
  const socket = useRef();

  useEffect(() => {
    document.title = 'Coalesce | Messages';
    socket.current = io('ws://localhost:8080');
  }, []);

  useEffect(() => {
    socket.current.emit('addUser', auth.userId);
  }, [auth]);

  return (
    <div className={classes['messages-wrapper']}>
      <div className={classes.back}>
        <span
          className="material-icons-outlined"
          onClick={() => {
            history.replace('/home');
          }}
        >
          arrow_back_ios
        </span>
        <span>{props.chatRecipient}</span>
      </div>
      {!chatSelected && (
        <div className={classes.nochat}>
          <h2>You have not selected any conversation</h2>
          <p>Pick a conversation from your chats to see the messages</p>
        </div>
      )}
      <Switch>
        <Route path={'/messages/:conversationId'} exact>
          <SingleChat setChatSelected={setChatSelected} socket={socket} />
        </Route>
      </Switch>
    </div>
  );
};

export default MessagesMainWrapper;

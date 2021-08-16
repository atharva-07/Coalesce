import React from 'react';
import classes from './MessagesMainWrapper.module.css';

const MessageBubble = (props) => {
  return (
    <span
      className={`${classes['msg-bubble']} ${props.own && classes.right} ${
        props.own && classes.own
      }`}
    >
      {props.children}
    </span>
  );
};

export default MessageBubble;

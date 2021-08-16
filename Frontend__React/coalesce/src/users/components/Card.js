import React from 'react';
import classes from './Card.module.css';
import Avatar from './Avatar';
import { useHistory } from 'react-router-dom';

const Card = (props) => {
  const history = useHistory();

  return (
    <div className={classes.wrapper}>
      <Avatar
        src={props.avatar}
        size={props.size}
        onClick={() => {
          history.replace(`/@${props.username}`);
        }}
      />
      <div className={classes['info-box']}>
        <h4>{props.fullname}</h4>
        <p>@{props.username}</p>
      </div>
    </div>
  );
};

export default Card;

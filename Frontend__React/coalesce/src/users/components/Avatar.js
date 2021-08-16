import React from 'react';
import classes from './Avatar.module.css';

const Avatar = (props) => {
  return (
    <div
      onClick={props.onClick}
      className={`${classes.wrapper} ${classes[props.size]}`}
    >
      <img
        src={
          !props.src || props.src === ' '
            ? 'http://localhost:7110/images/pfp/default.png'
            : `http://localhost:7110/${props.src}`
        }
        className={classes.image}
        alt={props.alt}
      />
    </div>
  );
};

export default Avatar;

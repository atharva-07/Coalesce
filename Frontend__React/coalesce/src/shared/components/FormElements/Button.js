import React from 'react';
import classes from './Button.module.css';

const Button = (props) => {
  return (
    <button
      className={`${classes.btn} + ${
        props.invalid ? classes.disabled : classes.valid
      }`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.invalid}
    >
      {props.children}
    </button>
  );
};

export default Button;

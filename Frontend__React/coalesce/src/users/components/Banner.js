import React from 'react';
import classes from './Banner.module.css';

const Banner = (props) => {
  return (
    <div className={classes.banner}>
      <img
        src={
          !props.src || props.src === ' '
            ? 'http://localhost:7110/images/banner/default.png'
            : `http://localhost:7110/${props.src}`
        }
        alt={props.user + 'cover'}
      ></img>
    </div>
  );
};

export default Banner;

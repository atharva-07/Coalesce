import React from 'react';
import classes from './Banner.module.css';

const Banner = (props) => {
  return (
    <div className={classes.banner}>
      <img
        src={
          !props.src || props.src === ' '
            ? `http://localhost:${
                process.env.REACT_APP_BACKEND_PORT || 4000
              }/images/banner/default.png`
            : `http://localhost:${process.env.REACT_APP_BACKEND_PORT || 4000}/${
                props.src
              }`
        }
        alt={props.user + 'cover'}
      ></img>
    </div>
  );
};

export default Banner;

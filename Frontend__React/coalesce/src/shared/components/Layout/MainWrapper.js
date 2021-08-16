import React from 'react';

import classes from './MainWrapper.module.css';

const MainWrapper = (props) => {
  return <div className={classes.wrapper}>{props.children}</div>;
};

export default MainWrapper;

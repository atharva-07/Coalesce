import React, { useContext } from 'react';
import classes from './UpperBar.module.css';
import { AuthContext } from '../../context/auth-context';

const UpperBar = () => {
  const auth = useContext(AuthContext);

  return (
    <div className={classes['bar-wrapper']}>
      <span>Hello, {auth.fullname ? auth.fullname.split(' ')[0] : ''} !</span>
      <span className="material-icons-outlined">autorenew</span>
    </div>
  );
};

export default UpperBar;

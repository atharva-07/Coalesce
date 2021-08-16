import React, { useContext } from 'react';
import { AuthContext } from '../../shared/context/auth-context';
import classes from './UserAction.module.css';
import Avatar from './Avatar';

const UserAction = () => {
  const auth = useContext(AuthContext);
  return (
    <div className={classes.wrapper}>
      <Avatar src={auth.pfp} size="small" alt="pfp" />
      <div>
        <span>{auth.fullname}</span>
        <br />
        <span>@{auth.username}</span>
      </div>
      <span className="material-icons-outlined" onClick={auth.logout}>
        logout
      </span>
    </div>
  );
};

export default UserAction;

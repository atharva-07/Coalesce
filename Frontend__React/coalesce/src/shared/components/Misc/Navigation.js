import React, { useContext } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import classes from './Navigation.module.css';
import { AuthContext } from '../../context/auth-context.js';

const Navigation = () => {
  const auth = useContext(AuthContext);
  let { username } = useParams();
  username = auth.username;

  return (
    <nav className={classes['navigation-wrapper']}>
      <ul className={classes.list}>
        <li className={classes['list-item']}>
          <div>
            <NavLink activeClassName={classes.active} to="/home">
              <span className={`material-icons-outlined ${classes.icon}`}>
                tag
              </span>
              <span>My Feed</span>
            </NavLink>
          </div>
        </li>
        <li className={classes['list-item']}>
          <div>
            <NavLink activeClassName={classes.active} to="/notifications">
              <span className={`material-icons-outlined ${classes.icon}`}>
                notifications
              </span>
              <span>Notifications</span>
            </NavLink>
          </div>
        </li>
        <li className={classes['list-item']}>
          <div>
            <NavLink activeClassName={classes.active} to="/messages">
              <span className={`material-icons-outlined ${classes.icon}`}>
                email
              </span>
              <span>Messages</span>
            </NavLink>
          </div>
        </li>
        <li className={classes['list-item']}>
          <div>
            <NavLink activeClassName={classes.active} to={`/@${username}`}>
              <span className={`material-icons-outlined ${classes.icon}`}>
                account_circle
              </span>
              <span>Profile</span>
            </NavLink>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;

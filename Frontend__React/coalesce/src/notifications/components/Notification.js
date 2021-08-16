import React from 'react';
import Avatar from '../../users/components/Avatar';
import classes from './Notification.module.css';
import { useHistory } from 'react-router-dom';

const Notification = (props) => {
  const history = useHistory();

  return (
    <>
      <div
        className={`${classes.wrapper} ${classes[props.event]}`}
        onClick={() => {
          if (props.event !== 'FOLW') {
            history.replace(`/@${props.self}/post/${props.url}`);
          } else {
            history.replace(`/@${props.sender.username}`);
          }
        }}
      >
        <div className={classes.main}>
          <Avatar src={props.sender.pfp} size="small" />
          <div>
            {props.event === 'LP' && (
              <p>
                <span className="boldify">{props.sender.fullname}</span> liked
                your post.
              </p>
            )}
            {props.event === 'LC' && (
              <p>
                <span className="boldify">{props.sender.fullname}</span> liked
                your comment on this post.
              </p>
            )}
            {props.event === 'CMNT' && (
              <p>
                <span className="boldify">{props.sender.fullname}</span>{' '}
                commented on your post.
              </p>
            )}
            {props.event === 'FOLW' && (
              <p>
                <span className="boldify">{props.sender.fullname}</span> started
                following you.
              </p>
            )}
          </div>
          <span className={classes.time}>
            <i>{props.time}</i>
          </span>
        </div>
      </div>
    </>
  );
};

export default Notification;

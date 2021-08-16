import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import classes from './NotificationsMainWrapper.module.css';
import { format } from 'timeago.js';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import Notification from './Notification';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttp } from '../../shared/hooks/use-http';

const NotificationsMainWrapper = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { isLoading, sendRequest } = useHttp();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    document.title = 'Coalesce | Notifications';
    const graphqlQuery = {
      query: `
        query fetchNotifications($userId: ID!) {
          fetchNotifications(userId: $userId) {
            _id
            sender {
              fullname
              username
              pfp
            }
            eventType
            urlParam
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        userId: auth.userId
      }
    };
    const fetchNotifications = async () => {
      const responseData = await sendRequest(
        'POST',
        JSON.stringify(graphqlQuery),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      setNotifications(responseData.data.fetchNotifications);
    };
    try {
      fetchNotifications();
    } catch (err) {}
  }, [auth.token, auth.userId, sendRequest]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className={classes['ntf-wrapper']}>
        <div className={classes.back}>
          <span
            className="material-icons-outlined"
            onClick={() => {
              history.replace('/home');
            }}
          >
            arrow_back_ios
          </span>
          <span>Notifications</span>
        </div>
        {notifications.length > 0 ? (
          <div>
            {notifications.map((p) => (
              <Notification
                key={p._id}
                event={p.eventType}
                sender={p.sender}
                self={auth.username}
                url={p.urlParam}
                time={format(p.createdAt)}
              />
            ))}
          </div>
        ) : (
          <div
            className="center"
            style={{ fontFamily: 'Trebuchet MS', marginTop: '10rem' }}
          >
            <h2>You don't have any new notifications</h2>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationsMainWrapper;

import React, { useEffect, useState, useContext } from 'react';
import classes from './Chats.module.css';
import SearchBar from '../../shared/components/UI/SearchBar';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttp } from '../../shared/hooks/use-http';
import Avatar from '../../users/components/Avatar';
import { useHistory } from 'react-router-dom';

const Chats = (props) => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttp();
  const [conversations, setConversations] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchConversations = async () => {
      const graphqlQuery = {
        query: `
          query fetchConversations($userId: ID!) {
            fetchConversations(userId: $userId) {
              _id
              members
              chatRecipient {
                _id
                fullname
                username
                pfp
              }
            }
          }
        `,
        variables: {
          userId: auth.userId
        }
      };
      const responseData = await sendRequest(
        'POST',
        JSON.stringify(graphqlQuery),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      setConversations(() => {
        const conversations = responseData.data.fetchConversations.map((p) => (
          <div
            key={p._id}
            className={classes.conversation}
            onClick={() => {
              history.replace(`/messages/${p._id}`);
              props.setChatRecipient(p.chatRecipient.fullname);
            }}
          >
            <Avatar src={p.chatRecipient.pfp} size="small" />
            <div>
              <span>{p.chatRecipient.fullname}</span>
              <br />
              <span>@{p.chatRecipient.username}</span>
            </div>
          </div>
        ));
        return conversations;
      });
    };
    try {
      fetchConversations();
    } catch (err) {}
  }, [auth.token, auth.userId, sendRequest, history, props]);

  return (
    <>
      <div className={classes['chats-wrapper']}>
        <div className={classes.header}>
          <span>Chats</span>
        </div>
        <SearchBar chatMode={true} setChatRecipient={props.setChatRecipient} />
        <div className={classes['convo-wrapper']}>{conversations}</div>
      </div>
    </>
  );
};

export default Chats;

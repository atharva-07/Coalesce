import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../../shared/hooks/use-http';
import MessageBubble from './MessageBubble';
import { AuthContext } from '../../shared/context/auth-context';
import classes from './MessagesMainWrapper.module.css';

const SingleChat = (props) => {
  const [messages, setMessages] = useState([]);
  const newMessageInputRef = useRef(null);
  const { sendRequest } = useHttp();
  const { conversationId } = useParams();
  const auth = useContext(AuthContext);
  const [conversationInfo, setConversationInfo] = useState({});
  const [newlyArrivedMessage, setNewArrivedMessage] = useState(null);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    props.setChatSelected(true);
    props.socket.current.on('getMessage', (data) => {
      setNewArrivedMessage({
        sender: data.senderId,
        message: data.message
      });
    });
  }, [props.socket]); // eslint-disable-line

  useEffect(() => {
    newlyArrivedMessage &&
      conversationInfo?.chatRecipient === newlyArrivedMessage.sender &&
      setMessages((prevState) => [
        ...prevState,
        <MessageBubble own={newlyArrivedMessage.sender === auth.userId}>
          {newlyArrivedMessage.message}
        </MessageBubble>
      ]);
    lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [newlyArrivedMessage, conversationInfo, auth.userId]);

  useEffect(() => {
    if (conversationId) {
      const fetchConversationInfo = async () => {
        const graphqlQuery = {
          query: `
            query fetchConvoInfo($conversationId: ID!, $userId: ID!) {
              fetchConversationInfo(conversationId: $conversationId, userId: $userId) {
                _id
                chatRecipient {
                  _id
                }
              }
            }
          `,
          variables: {
            conversationId: conversationId,
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
        setConversationInfo({
          _id: responseData.data.fetchConversationInfo._id,
          chatRecipient:
            responseData.data.fetchConversationInfo.chatRecipient._id
        });
      };
      const fetchMessages = async () => {
        const graphqlQuery = {
          query: `
        query fetchMessages($conversationId: ID!) {
          fetchMessages(conversationId: $conversationId) {
            _id
            message
            sender
            createdAt
          }
        }
        `,
          variables: {
            conversationId
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
        setMessages(() => {
          const messages = responseData.data.fetchMessages.map((p) => (
            <MessageBubble key={p._id} own={p.sender === auth.userId}>
              {p.message}
            </MessageBubble>
          ));
          return messages;
        });
      };
      try {
        fetchConversationInfo();
        fetchMessages();
      } catch (err) {}
    }
  }, [conversationId, sendRequest, auth.token, auth.userId]);

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    const graphqlQuery = {
      query: `
        mutation newMessage ($conversationId: ID!, $messageText: String!, $userId: ID!) {
          newMessage(conversationId: $conversationId, messageText: $messageText, userId: $userId) {
            _id
            message
            sender
          }
        }
      `,
      variables: {
        conversationId: conversationId,
        messageText: newMessageInputRef.current.value,
        userId: auth.userId
      }
    };

    props.socket.current.emit('sendMessage', {
      senderId: auth.userId,
      receiverId: conversationInfo.chatRecipient,
      message: newMessageInputRef.current.value
    });

    try {
      const responseData = await sendRequest(
        'POST',
        JSON.stringify(graphqlQuery),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      setMessages((prevState) => {
        return [
          ...prevState,
          <MessageBubble
            key={responseData.data.newMessage._id}
            own={responseData.data.newMessage.sender === auth.userId}
          >
            {responseData.data.newMessage.message}
          </MessageBubble>
        ];
      });
      newMessageInputRef.current.value = '';
    } catch (err) {}
  };

  return (
    <>
      <div className={classes['chat-wrapper']}>
        {messages.length > 0 ? (
          messages
        ) : (
          <div className={classes.nochat}>
            <h2>Say Hi! &#128075;</h2>
            <p>
              Why so quiet? Break the awkward silence in here by sending a
              message....
            </p>
          </div>
        )}
        <div ref={lastMessageRef} />
        <div className={classes.textbox}>
          <form>
            <input
              placeholder="Enter your message...."
              ref={newMessageInputRef}
            />
            <span
              className={`material-icons-outlined ${classes.send}`}
              onClick={formSubmitHandler}
            >
              send
            </span>
          </form>
        </div>
      </div>
    </>
  );
};

export default SingleChat;

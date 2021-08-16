import React, { useState } from 'react';
import Header from '../../shared/components/Layout/Header';
import MainWrapper from '../../shared/components/Layout/MainWrapper';
import MessagesMainWrapper from '../components/MessagesMainWrapper';
import Chats from '../components/Chats';

const Messages = () => {
  const [chatRecipient, setChatRecipient] = useState('Messages');

  return (
    <>
      <Header />
      <MainWrapper>
        <MessagesMainWrapper chatRecipient={chatRecipient} />
        <Chats setChatRecipient={setChatRecipient} />
      </MainWrapper>
    </>
  );
};

export default Messages;

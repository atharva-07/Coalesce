import React from 'react';
import Header from '../../shared/components/Layout/Header';
import MainWrapper from '../../shared/components/Layout/MainWrapper';
import NotificationsMainWrapper from '../components/NotificationsMainWrapper';
import Footer from '../../shared/components/Layout/Footer';

const Notifications = () => {
  return (
    <>
      <Header />
      <MainWrapper>
        <NotificationsMainWrapper />
        <Footer />
      </MainWrapper>
    </>
  );
};

export default Notifications;

import React from 'react';
import Header from '../../shared/components/Layout/Header';
import MainWrapper from '../../shared/components/Layout/MainWrapper';
import Detailed from '../components/Detailed';
import Footer from '../../shared/components/Layout/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <MainWrapper>
        <Detailed />
        <Footer />
      </MainWrapper>
    </>
  );
};

export default Home;

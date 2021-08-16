import React, { useEffect } from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Main from '../components/Layout/Main';
import MainWrapper from '../components/Layout/MainWrapper';

const Home = () => {
  useEffect(() => {
    document.title = 'Coalesce | Home';
  }, []);

  return (
    <>
      <Header />
      <MainWrapper>
        <Main />
        <Footer />
      </MainWrapper>
    </>
  );
};

export default Home;

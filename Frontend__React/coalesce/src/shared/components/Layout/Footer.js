import React from 'react';

import classes from './Footer.module.css';
import SearchBar from '../UI/SearchBar';

const Footer = () => {
  return (
    <footer className={classes['footer-wrapper']}>
      <SearchBar />
    </footer>
  );
};

export default Footer;

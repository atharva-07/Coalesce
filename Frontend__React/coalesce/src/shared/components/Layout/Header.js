import React from 'react';

import classes from './Header.module.css';
import Logo from '../UI/Logo';
import Navigation from '../Misc/Navigation';
import Subheader from '../Misc/Subheader';

const Header = () => {
  return (
    <header className={classes['header-wrapper']}>
      <Logo />
      <Navigation />
      <Subheader />
    </header>
  );
};

export default Header;

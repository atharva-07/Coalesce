import React from 'react';
import classes from './Main.module.css';
import Feed from '../../../posts/components/Feed';
import NewPost from '../../../posts/components/NewPost';
import UpperBar from '../Misc/UpperBar';

const Main = () => {
  return (
    <main className={classes['main-wrapper']}>
      <UpperBar />
      <NewPost />
      <Feed />
    </main>
  );
};

export default Main;

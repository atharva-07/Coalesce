import React, { useState, useContext } from 'react';
import classes from './NewPost.module.css';
import Avatar from '../../users/components/Avatar';
import Modal from '../../shared/components/UI/Modal';
import { AuthContext } from '../../shared/context/auth-context';

const NewPost = () => {
  const auth = useContext(AuthContext);
  const [modal, openModal] = useState(false);

  const modalOpener = () => {
    openModal(true);
  };

  const modalCloser = () => {
    openModal(false);
  };

  return (
    <>
      {modal && (
        <Modal heading="Create Post" newpost={true} onConfirm={modalCloser} />
      )}
      <div onClick={modalOpener} className={classes['new-post-wrapper']}>
        <div className={classes.box}>
          <Avatar src={auth.pfp} size="small" alt="pfp" />
          <div className={classes.content}>
            <span>What's on your mind?</span>
          </div>
        </div>
        <div className={classes.images}>
          <span className="material-icons-outlined">collections</span>
        </div>
      </div>
      <div className={classes.space}></div>
    </>
  );
};

export default NewPost;

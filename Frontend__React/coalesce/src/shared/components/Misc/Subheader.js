import React, { useState } from 'react';
import classes from './Subheader.module.css';
import Modal from '../UI/Modal';
import UserAction from '../../../users/components/UserAction';

const Subheader = () => {
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
      <section className={classes['subheader-wrapper']}>
        <ul>
          <li>
            <div onClick={modalOpener} className={classes['create-post']}>
              New Post
            </div>
          </li>
        </ul>
      </section>
      <UserAction />
    </>
  );
};

export default Subheader;

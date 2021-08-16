import React from 'react';
import Button from '../FormElements/Button';
import classes from './ModalOverlay.module.css';

const ModalOverlay = (props) => {
  return (
    <div className={classes.modal}>
      <header className={classes.header}>
        <h2>{props.heading}</h2>
      </header>
      <hr />
      <main className={classes.content}>
        <p>{props.message}</p>
      </main>
      <footer className={classes.actions}>
        <Button type="button" onClick={props.onConfirm}>
          Okay!
        </Button>
      </footer>
    </div>
  );
};

export default ModalOverlay;

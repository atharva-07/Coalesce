import React from 'react';
import ReactDOM from 'react-dom';
import Backdrop from './Backdrop';
import ModalOverlay from './ModalOverlay';
import NewCommentOverlay from '../../../posts/comments/NewCommentModal';
import NewPostOverlay from '../../../posts/components/NewPostModal';
import UpdateInfoOverlay from '../../../users/components/UpdateInfoOverlay';

const Modal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onConfirm={props.onConfirm} />,
        document.getElementById('backdrop-root')
      )}
      {props.newpost &&
        ReactDOM.createPortal(
          <NewPostOverlay
            heading={props.heading}
            onConfirm={props.onConfirm}
          />,
          document.getElementById('modal-overlay-root')
        )}
      {props.newcomment &&
        ReactDOM.createPortal(
          <NewCommentOverlay
            heading={props.heading}
            onConfirm={props.onConfirm}
            handleCommentState={props.commentStateChanger}
          />,
          document.getElementById('modal-overlay-root')
        )}
      {props.updateInfo &&
        ReactDOM.createPortal(
          <UpdateInfoOverlay
            heading={props.heading}
            onConfirm={props.onConfirm}
            setUserData={props.setUserData}
          />,
          document.getElementById('modal-overlay-root')
        )}
      {!props.newpost &&
        !props.newcomment &&
        !props.updateInfo &&
        ReactDOM.createPortal(
          <ModalOverlay
            heading={props.heading}
            message={props.message}
            onConfirm={props.onConfirm}
          />,
          document.getElementById('modal-overlay-root')
        )}
    </>
  );
};

export default Modal;

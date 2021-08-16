import React, { useState, useContext } from 'react';
import classes from './Comments.module.css';
import Avatar from '../../users/components/Avatar';
import Modal from '../../shared/components/UI/Modal';
import Comment from './Comment';
import { AuthContext } from '../../shared/context/auth-context';
import { format } from 'timeago.js';

const Comments = (props) => {
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
        <Modal
          heading="New Comment"
          newcomment={true}
          onConfirm={modalCloser}
          commentStateChanger={props.commentStateChanger}
        />
      )}
      <div className={classes['comments-wrapper']}>
        <div className={classes['new-comment']}>
          <Avatar src={auth.pfp} size="smallest" />
          <p onClick={modalOpener}>Write a comment....</p>
        </div>
        {props.comments.length === 0 ? (
          <div className={classes.empty}>
            <h3>Wow! Such empty!</h3>
            <p>There are no comments on your post....</p>
          </div>
        ) : (
          props.comments.map((c) => {
            let liked = false;
            if (c.likes && c.likes.length > 0) {
              liked = c.likes.find((i) => i === auth.userId);
            }
            return (
              <Comment
                key={c._id}
                postId={props.postId}
                cmntId={c._id}
                pfp={c.creator.pfp}
                creator={c.creator.fullname}
                content={c.content}
                likes={c.likes ? c.likes.length : 0}
                liked={liked}
                time={format(c.createdAt)}
              />
            );
          })
        )}
      </div>
    </>
  );
};

export default Comments;

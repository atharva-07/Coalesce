import React, { useContext, useEffect, useState } from 'react';
import Avatar from '../../users/components/Avatar';
import classes from './Comments.module.css';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttp } from '../../shared/hooks/use-http';

const Comment = (props) => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttp();

  const [likes, setLikes] = useState();
  const [liked, setLiked] = useState();

  useEffect(() => {
    setLiked(props.liked);
    setLikes(props.likes);
  }, [props.likes, props.liked]);

  const likeCommentHandler = async () => {
    console.log(props.postId);
    const graphqlQuery = {
      query: `
          mutation likePost($postId: ID!, $commentId: ID! $userId: ID!) {
            likeComment(postId: $postId, commentId: $commentId, userId: $userId)
          }
        `,
      variables: {
        postId: props.postId,
        commentId: props.cmntId,
        userId: auth.userId
      }
    };
    try {
      await sendRequest('POST', JSON.stringify(graphqlQuery), {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      });
      if (liked) {
        setLikes((likes) => --likes);
      } else {
        setLikes((likes) => ++likes);
      }
      setLiked((liked) => !liked);
    } catch (err) {}
  };

  return (
    <div className={classes.comments}>
      <div className={classes['cmnt-wrapper']}>
        <Avatar src={props.pfp} size="smallest" />
        <div className={classes.main}>
          <header className={classes.header}>
            <div>
              <span>{props.creator}</span>
              <span>&#9702; {props.time}</span>
            </div>
          </header>
          <main className={classes.main}>
            <p>{props.content}</p>
          </main>
        </div>
      </div>
      <footer className={classes.footer}>
        <span
          className={`${liked ? classes.liked : ''}`}
          onClick={likeCommentHandler}
        >
          <span className="material-icons-outlined">thumb_up</span>
          <span>{likes}</span>
        </span>
      </footer>
    </div>
  );
};

export default Comment;

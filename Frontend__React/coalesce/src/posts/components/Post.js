import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '../../users/components/Avatar';
import classes from './Post.module.css';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttp } from '../../shared/hooks/use-http';

const Post = (props) => {
  const { sendRequest } = useHttp();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [likes, setLikes] = useState();
  const [liked, setLiked] = useState();

  useEffect(() => {
    setLiked(props.liked);
    setLikes(props.likes);
  }, [props.likes, props.liked]);

  const likePostHandler = async () => {
    const graphqlQuery = {
      query: `
        mutation likePost($postId: ID!, $userId: ID!) {
          likePost(postId: $postId, userId: $userId)
        }
      `,
      variables: {
        postId: props.postId,
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
    <div className={classes['post-wrapper']}>
      <Avatar
        onClick={() => {
          history.push(`/@${props.username}`);
        }}
        src={props.avatar}
        size={props.size}
      />
      <div>
        <header className={classes.header}>
          <div>
            <span>{props.fullname}</span>
            <span>@{props.username} &#9702; </span>
            <span>{props.time}</span>
          </div>
        </header>
        <main
          className={classes.main}
          onClick={() => {
            !props.unclickable &&
              history.replace(`/@${props.username}/post/${props.postId}`);
          }}
        >
          <p>{props.content}</p>
          {props.image && (
            <div className={classes['image-container']}>
              <img
                src={`http://localhost:7110/${props.image}`}
                alt="post_image"
              />
            </div>
          )}
        </main>
        <footer className={classes.footer}>
          <div
            onClick={likePostHandler}
            className={`${liked ? classes.liked : ''}`}
          >
            <span className="material-icons-outlined icon">
              favorite_border
            </span>
            <span>{likes}</span>
          </div>
          <div
            onClick={() => {
              !props.unclickable &&
                history.replace(`/@${props.username}/post/${props.postId}`);
            }}
            className={`${props.commented ? classes.commented : ''}`}
          >
            <span className="material-icons-outlined icon">comment</span>
            <span>{props.comments}</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Post;

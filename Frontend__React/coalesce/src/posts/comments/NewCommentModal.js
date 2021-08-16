import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import classes from '../components/NewPostModal.module.css';
import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttp } from '../../shared/hooks/use-http';

const NewCommentOverlay = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttp();
  const [commentInput, setCommentInput] = useState();
  const { postId } = useParams();

  const commentInputHandler = (event) => {
    setCommentInput(event.target.value);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    const graphqlQuery = {
      query: `
        mutation newComment ($content: String!, $postId: ID!, $userId: ID!) {
          postComment(content: $content, postId: $postId, userId: $userId) {
            _id
            content
            creator {
              fullname
              username
              pfp
            }
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        content: commentInput,
        postId: postId,
        userId: auth.userId
      }
    };
    try {
      const responseData = await sendRequest(
        'POST',
        JSON.stringify(graphqlQuery),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      console.log(responseData);
      props.handleCommentState((prevState) => {
        return {
          ...prevState,
          comments: [...prevState.comments, responseData.data.postComment]
        };
      });
    } catch (error) {
      console.log(error);
    }
    props.onConfirm();
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className={classes['modal-wrapper']}>
        <header className={classes.header}>
          <h2>{props.heading}</h2>
        </header>
        <main className={classes.main}>
          <form onSubmit={formSubmitHandler} className={classes['np-form']}>
            <textarea
              placeholder="Write a comment...."
              onChange={commentInputHandler}
            />
          </form>
        </main>
        <footer>
          <Button type="submit" onClick={formSubmitHandler}>
            Comment
          </Button>
        </footer>
      </div>
    </>
  );
};

export default NewCommentOverlay;

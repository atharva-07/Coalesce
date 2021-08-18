import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import classes from './NewPostModal.module.css';
import Button from '../../shared/components/FormElements/Button';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import Modal from '../../shared/components/UI/Modal';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttp } from '../../shared/hooks/use-http';

const NewPostOverlay = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttp();
  const history = useHistory();

  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const contentInputHandler = (event) => {
    setContent(event.target.value);
  };

  const imageInputHandler = (imageVal) => {
    setImage(imageVal);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('image', image);
      const response = await fetch(
        `http://localhost:${
          process.env.REACT_APP_BACKEND_PORT || 4000
        }/post-image`,
        {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + auth.token
          },
          body: formData
        }
      );
      const responseData = await response.json();
      const graphqlQuery = {
        query: `
        mutation createNewPost($content: String!, $image: String, $creator: ID!) {
          createPost(postData: {content: $content, image: $image, creator: $creator}) {
            content
            image
          }
        }
        `,
        variables: {
          content: content,
          image: responseData.filePath || '',
          creator: auth.userId
        }
      };
      await sendRequest('POST', JSON.stringify(graphqlQuery), {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      });
      history.replace('/');
    } catch (err) {}
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {error && (
        <Modal
          heading={error.message}
          message={error.data[0].message}
          onConfirm={clearError}
        />
      )}
      <div className={classes['modal-wrapper']}>
        <header className={classes.header}>
          <h2>{props.heading}</h2>
        </header>
        <main className={classes.main}>
          <form
            onSubmit={formSubmitHandler}
            className={classes['np-form']}
            encType="multipart/form-data"
          >
            <textarea
              id="content"
              placeholder="What's on your mind?"
              onChange={contentInputHandler}
              required
            />
            <ImageUpload id="image" onSelect={imageInputHandler} />
            <Button type="submit">Post</Button>
          </form>
        </main>
      </div>
    </>
  );
};

export default NewPostOverlay;

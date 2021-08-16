import React, { useContext, useState } from 'react';
import { useHttp } from '../../shared/hooks/use-http';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import Button from '../../shared/components/FormElements/Button';
import classes from '../../posts/components/NewPostModal.module.css';
import { AuthContext } from '../../shared/context/auth-context';

const UpdateInfoOverlay = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttp();

  const [bio, setBio] = useState();
  const [pfp, setPFP] = useState();
  const [banner, setBanner] = useState();

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('bio', bio);
      formData.append('pfp', pfp);
      formData.append('banner', banner);
      const response = await fetch('http://localhost:7110/profile-images', {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + auth.token
        },
        body: formData
      });
      const responseData = await response.json();
      const graphqlQuery = {
        query: `
        mutation newUserInfo($bio: String, $pfp: String, $cover: String, $userId: ID!) {
          updateUserInfo(userProfileData: {bio: $bio, pfp: $pfp, cover: $cover, userId: $userId}) {
            bio
            pfp
            cover
          }
        }
        `,
        variables: {
          bio: bio,
          pfp: responseData.pfpPath || undefined,
          cover: responseData.bannerPath || undefined,
          userId: auth.userId
        }
      };
      await sendRequest('POST', JSON.stringify(graphqlQuery), {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      });
      props.setUserData((prevState) => {
        const newBio = responseData.bio ? responseData.bio : prevState.bio;
        const newPFP = responseData.pfpPath
          ? responseData.pfpPath
          : prevState.pfp;
        const newCover = responseData.bannerPath
          ? responseData.bannerPath
          : prevState.cover;
        return {
          ...prevState,
          bio: newBio,
          pfp: newPFP,
          cover: newCover
        };
      });
      props.onConfirm();
    } catch (err) {}
  };

  localStorage.getItem('userData');

  const bioInputHandler = (event) => {
    setBio(event.target.value);
  };

  const pfpImageHandler = (pfpVal) => {
    setPFP(pfpVal);
  };

  const bannerImageHandler = (bannerVal) => {
    setBanner(bannerVal);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
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
              id="bio"
              name="bio"
              placeholder="Set your bio...."
              onChange={bioInputHandler}
            />
            <div className={classes['img-upld']}>
              <label htmlFor="pfp">
                <i>Profile Picture</i>
              </label>
              <ImageUpload id="pfp" name="pfp" onSelect={pfpImageHandler} />
            </div>
            <div className={classes['img-upld']}>
              <label htmlFor="banner">
                <i>Banner Image</i>
              </label>
              <ImageUpload
                id="banner"
                name="banner"
                onSelect={bannerImageHandler}
              />
            </div>
            <Button type="submit">Post</Button>
          </form>
        </main>
      </div>
    </>
  );
};

export default UpdateInfoOverlay;

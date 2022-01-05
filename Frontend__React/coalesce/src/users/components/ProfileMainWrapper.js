import React, { useState, useEffect, useContext } from 'react';
import classes from './ProfileMainWrapper.module.css';
import Avatar from './Avatar';
import Banner from './Banner';
import Card from './Card';
import { NavLink, Route, Switch, useParams } from 'react-router-dom';
import { AuthContext } from '../../shared/context/auth-context.js';
import { useHttp } from '../../shared/hooks/use-http';
import Post from '../../posts/components/Post';
import Modal from '../../shared/components/UI/Modal';
import { format } from 'timeago.js';

const ProfileMainWrapper = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttp();
  const { username } = useParams();

  const [modal, openModal] = useState(false);

  const [userData, setUserData] = useState({});
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [alreadyFollowing, setAlreadyFollowing] = useState(false);

  useEffect(() => {
    document.title = 'Coalesce | Profile | ' + username;
    const graphqlQuery = {
      query: `
      query getProfileData($username: String!) {
        getUserProfile(username: $username) {
          _id
          fullname
          username
          pfp
          cover
          bio
          gender
          posts {
            _id
            creator {
              fullname
              username
              pfp
            }
            content
            image
            likes
            comments {
              _id
              creator {
                _id
              }
            }
            createdAt
          }
          followers {
            _id
            pfp
            fullname
            username
          }
          following {
            _id
            pfp
            fullname
            username
          }
        }
      }`,
      variables: {
        username: username
      }
    };

    const fetchUserProfile = async () => {
      const responseData = await sendRequest(
        'POST',
        JSON.stringify(graphqlQuery),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      setUserData({
        fullname: responseData.data.getUserProfile.fullname,
        username: responseData.data.getUserProfile.username,
        bio: responseData.data.getUserProfile.bio,
        gender: responseData.data.getUserProfile.gender,
        pfp: responseData.data.getUserProfile.pfp,
        cover: responseData.data.getUserProfile.cover,
        followers: responseData.data.getUserProfile.followers.length,
        following: responseData.data.getUserProfile.following.length
      });
      setAlreadyFollowing(() => {
        const following = responseData.data.getUserProfile.followers.find(
          (x) => x._id.toString() === auth.userId
        );
        return !!following;
      });
      setPosts(() => {
        if (responseData.data.getUserProfile.posts.length === 0) {
          return <h3 className="center">No Posts</h3>;
        }
        return responseData.data.getUserProfile.posts.map((p) => {
          let liked, commented;
          if (p.likes && p.likes.length > 0) {
            liked = p.likes.find((i) => i === auth.userId);
          }
          if (p.comments && p.comments.length > 0) {
            commented = p.comments.find((c) => c.creator._id === auth.userId);
          }
          return (
            <Post
              key={p._id}
              postId={p._id}
              fullname={p.creator.fullname}
              username={p.creator.username}
              avatar={p.creator.pfp}
              content={p.content}
              image={p.image}
              time={format(p.createdAt)}
              likes={p.likes ? p.likes.length : 0}
              comments={p.comments ? p.comments.length : 0}
              liked={liked}
              commented={commented}
              size="small"
            />
          );
        });
      });
      setFollowers(() => {
        if (responseData.data.getUserProfile.followers.length === 0) {
          return (
            <h3 className="center">
              Oopsie! Looks like @{username} is not followed by anyone....
            </h3>
          );
        }
        return responseData.data.getUserProfile.followers.map((p) => (
          <Card
            key={p._id}
            avatar={p.pfp}
            size="medium"
            fullname={p.fullname}
            username={p.username}
          />
        ));
      });

      setFollowing(() => {
        if (responseData.data.getUserProfile.following.length === 0) {
          return (
            <h3 className="center">
              Whoops! Looks like @{username} is not following anyone....
            </h3>
          );
        }
        return responseData.data.getUserProfile.following.map((p) => (
          <Card
            key={p._id}
            avatar={p.pfp}
            size="medium"
            fullname={p.fullname}
            username={p.username}
          />
        ));
      });
    };
    try {
      fetchUserProfile();
    } catch (err) {}
  }, [sendRequest, auth.token, username, auth.userId]);

  const followUserHandler = async () => {
    const graphqlQuery = {
      query: `
        mutation followUser ($srcUserId: ID!, $tgtUsername: String!) {
          followUser (srcUserId: $srcUserId, tgtUsername: $tgtUsername)
        }
      `,
      variables: {
        srcUserId: auth.userId,
        tgtUsername: username
      }
    };
    try {
      const resData = await sendRequest('POST', JSON.stringify(graphqlQuery), {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token
      });
      setAlreadyFollowing((prevState) => !prevState);
      if (resData.data.followUser) {
        setUserData((prevState) => {
          return {
            ...prevState,
            followers: prevState.followers++
          };
        });
      } else {
        setUserData((prevState) => {
          return {
            ...prevState,
            followers: prevState.followers--
          };
        });
      }
    } catch (err) {}
  };

  const modalOpener = () => {
    openModal(true);
  };

  const modalCloser = () => {
    openModal(false);
  };

  return (
    <div className={classes['profile-wrapper']}>
      {modal && (
        <Modal
          heading="Update User Information"
          updateInfo={true}
          onConfirm={modalCloser}
          setUserData={setUserData}
        />
      )}
      <Banner user={userData.username} src={userData.cover} />
      <div className={classes['user-info-box']}>
        <Avatar src={userData.pfp} size="large" />
        <div className={classes.user}>
          <h2>{userData.fullname}</h2>
          <p>@{userData.username}</p>
          <p>
            <i>{userData.bio}</i>
          </p>
        </div>
        {auth.username === username && (
          <span className="material-icons-outlined" onClick={modalOpener}>
            edit
          </span>
        )}
      </div>
      <div className={classes['content-wrapper']}>
        <div className={classes.content}>
          <div className={classes['content-options']}>
            <NavLink
              activeClassName={classes.chosen}
              to={`/@${username}`}
              exact
            >
              Posts
            </NavLink>
            <NavLink
              activeClassName={classes.chosen}
              to={`/@${username}/followers`}
              exact
            >
              Followers
            </NavLink>
            <NavLink
              activeClassName={classes.chosen}
              to={`/@${username}/following`}
              exact
            >
              Following
            </NavLink>
          </div>
          <Switch>
            <Route path={`/@${username}`} exact>
              <div className={classes.follows}>{posts}</div>
            </Route>
            <Route path={`/@${username}/followers`} exact>
              <div className={classes.follows}>{followers}</div>
            </Route>
            <Route path={`/@${username}/following`} exact>
              <div className={classes.follows}>{following}</div>
            </Route>
          </Switch>
        </div>
        <div className={classes.stats}>
          {auth.username !== username && (
            <button className={classes.btn2} onClick={followUserHandler}>
              {alreadyFollowing ? 'Following' : 'Follow'}
            </button>
          )}
          <div className={classes.userstats}>
            <div>
              <span>Followers</span>
              <span>{userData.followers}</span>
            </div>
            <div>
              <span>Following</span>
              <span>{userData.following}</span>
            </div>
            <div>
              <span>Gender</span>
              {userData.gender === 'male' ? (
                <div>
                  <span className="material-icons-outlined">male</span>
                  <span>- M</span>
                </div>
              ) : (
                <div>
                  <span className="material-icons-outlined">female</span>
                  <span>- F</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileMainWrapper;

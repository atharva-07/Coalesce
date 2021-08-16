import React, { useEffect, useContext, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import classes from './Detailed.module.css';
import Comments from '../comments/Comments';
import Post from './Post';
import { useHttp } from '../../shared/hooks/use-http';
import { AuthContext } from '../../shared/context/auth-context';
import { format } from 'timeago.js';

const Detailed = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttp();
  const { postId } = useParams();
  const history = useHistory();

  const [postData, setPostData] = useState({});

  useEffect(() => {
    const graphqlQuery = {
      query: `
      query fetchPost($postId: ID!) {
        fetchSinglePost(postId: $postId) {
          _id
          content
          image
          creator {
            pfp
            fullname
            username
          }
          likes
          comments {
            _id
            content
            creator {
              _id
              pfp
              fullname
              username
            }
            likes
            createdAt
            updatedAt
          }
          createdAt
          updatedAt
        }
      }
      `,
      variables: {
        postId: postId
      }
    };

    const fetchPost = async () => {
      const responseData = await sendRequest(
        'POST',
        JSON.stringify(graphqlQuery),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      const { _id, creator, content, image, likes, comments, createdAt } =
        responseData.data.fetchSinglePost;
      let liked = false,
        commented = false;
      if (likes && likes.length > 0) {
        liked = likes.find((i) => i === auth.userId);
      }
      if (comments && comments.length > 0) {
        commented = comments.find((c) => c.creator._id === auth.userId);
      }
      setPostData({
        id: _id,
        fullname: creator.fullname,
        username: creator.username,
        pfp: creator.pfp,
        content: content,
        image: image,
        likes: likes,
        comments: comments,
        liked: liked,
        commented: commented,
        createdAt: createdAt
      });
    };
    try {
      fetchPost();
    } catch (err) {}
  }, [auth.token, sendRequest, postId, auth.userId]);

  return (
    <div className={classes['detailed-wrapper']}>
      <div className={classes.back}>
        <span
          className="material-icons-outlined"
          onClick={() => {
            history.replace('/home');
          }}
        >
          arrow_back_ios
        </span>
        <span>Post</span>
      </div>
      <Post
        unclickable={true}
        postId={postData.id}
        fullname={postData.fullname}
        username={postData.username}
        avatar={postData.pfp}
        content={postData.content}
        image={postData.image}
        time={format(postData.createdAt)}
        likes={postData.likes ? postData.likes.length : 0}
        comments={postData.comments ? postData.comments.length : 0}
        liked={!!postData.liked}
        commented={postData.commented}
        size="small"
      />
      <Comments
        postId={postData.id}
        comments={postData.comments ? postData.comments : []}
        commentStateChanger={setPostData}
      />
    </div>
  );
};

export default Detailed;

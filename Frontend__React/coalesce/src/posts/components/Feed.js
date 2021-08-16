import React, { useEffect, useContext, useState } from 'react';
import Post from './Post';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttp } from '../../shared/hooks/use-http';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import { format } from 'timeago.js';

const Feed = () => {
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest } = useHttp();
  const [posts, loadPosts] = useState([]);

  useEffect(() => {
    const graphqlQuery = {
      query: `
        query fetchPosts($userId: ID!) {
          fetchPosts(userId: $userId) {
            _id
            content
            image
            creator {
              fullname
              username
              pfp
            }
            likes
            comments {
              _id
              creator {
                _id
              }
            }
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        userId: auth.userId
      }
    };
    const fetchPosts = async () => {
      try {
        const responseData = await sendRequest(
          'POST',
          JSON.stringify(graphqlQuery),
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token
          }
        );
        loadPosts(
          responseData.data.fetchPosts.map((p) => {
            let liked = false,
              commented = false;
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
                size="small"
                liked={!!liked}
                commented={commented}
              />
            );
          })
        );
      } catch (err) {}
    };
    fetchPosts();
  }, [auth.token, auth.userId, sendRequest, auth]);

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {posts.length > 0 ? (
        posts
      ) : (
        <h4
          style={{
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 600,
            marginTop: 80
          }}
        >
          Wow! Such emptiness! Your Feed is empty.
        </h4>
      )}
    </>
  );
};

export default Feed;

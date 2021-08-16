const ObjectID = require('mongoose').Types.ObjectId;
const Notification = require('../models/Notification.js');

const User = require('../models/User');
const Post = require('../models/Post').post;

function dateToString(date) {
  return new Date(date).toISOString();
}

fillCreator = async (creatorId) => {
  const creator = await User.findById(creatorId);
  return {
    ...creator._doc,
    createdAt: dateToString(creator._doc.createdAt),
    updatedAt: dateToString(creator._doc.createdAt)
  };
};

module.exports = {
  createPost: async ({ postData }) => {
    const post = new Post({
      content: postData.content,
      image: postData.image,
      creator: postData.creator
    });
    const result = await post.save();
    const user = await User.findById(result.creator);
    user.posts.push(result._id);
    await user.save();
    return {
      ...result._doc,
      _id: user.id,
      creator: fillCreator(postData.creator),
      createdAt: dateToString(result._doc.createdAt),
      updatedAt: dateToString(result._doc.updatedAt)
    };
  },
  fetchPosts: async ({ userId }) => {
    try {
      const user = await User.findById(userId);
      const posts = await Post.find({ creator: { $in: user.following } }).sort({
        createdAt: -1
      });
      const transformedPosts = posts.map((p) => {
        return {
          ...p._doc,
          _id: p.id,
          createdAt: dateToString(p._doc.createdAt),
          updatedAt: dateToString(p._doc.updatedAt),
          creator: fillCreator(p._doc.creator)
        };
      });
      return transformedPosts;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  fetchSinglePost: async ({ postId }) => {
    try {
      const post = await Post.findById(postId);
      return {
        ...post._doc,
        _id: post.id,
        content: post.content,
        image: post.image,
        likes: post.likes,
        creator: fillCreator(post.creator),
        comments: post.comments.map((comment) => {
          return {
            _id: comment.id,
            content: comment.content,
            creator: fillCreator(comment.creator),
            likes: comment.likes,
            createdAt: dateToString(comment.createdAt),
            updatedAt: dateToString(comment.updatedAt)
          };
        }),
        createdAt: dateToString(post._doc.createdAt),
        updatedAt: dateToString(post._doc.updatedAt)
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  likePost: async ({ postId, userId }) => {
    try {
      const post = await Post.findById(postId);
      const like = post.likes.find((x) => x.toString() === userId);
      if (like) {
        post.likes.pull(new ObjectID(userId));
        if (post.creator._id !== userId) {
          const notification = new Notification({
            sender: userId,
            receiver: post.creator,
            eventType: 'LP',
            urlParam: post._id
          });
          notification.save();
        }
      } else {
        post.likes.push(new ObjectID(userId));
      }
      await post.save();
      return userId;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};

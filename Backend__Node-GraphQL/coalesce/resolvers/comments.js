const ObjectID = require('mongoose').Types.ObjectId;

const User = require('../models/User');
const Post = require('../models/Post').post;
const Comment = require('../models/Post').comment;
const Notification = require('../models/Notification');

function dateToString(date) {
  return new Date(date).toISOString();
}

async function fillCreator(creatorId) {
  const creator = await User.findById(creatorId);
  return {
    ...creator._doc,
    createdAt: dateToString(creator._doc.createdAt),
    updatedAt: dateToString(creator._doc.createdAt)
  };
}

module.exports = {
  postComment: async ({ content, postId, userId }) => {
    try {
      const post = await Post.findById(postId);
      const comment = new Comment({
        content: content,
        creator: new ObjectID(userId),
        likes: []
      });
      post.comments.push(comment);
      await post.save();
      if (post.creator.toString() != comment.creator.toString()) {
        const notification = new Notification({
          sender: userId,
          receiver: post.creator,
          eventType: 'CMNT',
          urlParam: post._id
        });
        notification.save();
      }
      return {
        _id: comment.id,
        content: content,
        creator: fillCreator(userId),
        likes: comment.likes,
        createdAt: dateToString(post._doc.updatedAt),
        updatedAt: dateToString(post._doc.updatedAt)
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  likeComment: async ({ postId, commentId, userId }) => {
    try {
      const post = await Post.findById(postId);
      const comment = post.comments.id(commentId);
      const like = comment.likes.find((x) => x.toString() === userId);
      if (like) {
        comment.likes.pull(new ObjectID(userId));
      } else {
        comment.likes.push(new ObjectID(userId));
        if (comment.creator != userId) {
          const notification = new Notification({
            sender: userId,
            receiver: comment.creator,
            eventType: 'LC',
            urlParam: post._id
          });
          notification.save();
        }
      }
      await post.save();
      return userId;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};

const ObjectID = require('mongoose').Types.ObjectId;
const Post = require('../models/Post').post;
const User = require('../models/User');
const Notification = require('../models/Notification');

function dateToString(date) {
  return new Date(date).toISOString();
}

const fillCreator = async (creatorId) => {
  const creator = await User.findById(creatorId);
  return {
    ...creator._doc,
    _id: creator.id,
    createdAt: dateToString(creator._doc.createdAt),
    updatedAt: dateToString(creator._doc.updatedAt)
  };
};

const fillUsers = async (userIds) => {
  const users = await User.find({ _id: { $in: userIds } });
  const transformedUsers = users.map((p) => {
    return {
      _id: p.id,
      pfp: p.pfp,
      fullname: p.fullname,
      username: p.username
    };
  });
  return transformedUsers;
};

const fillPosts = async (postIds) => {
  const posts = await Post.find({ _id: { $in: postIds } });
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
};

module.exports = {
  getUserProfile: async ({ username }) => {
    try {
      const user = await User.findOne({ username: username });

      return {
        ...user._doc,
        _id: user.id,
        followers: fillUsers(user.followers),
        following: fillUsers(user.following),
        posts: fillPosts(user.posts)
      };
    } catch (err) {
      console.log(err);
    }
  },
  getUsers: async ({ searchField }) => {
    if (searchField === '') {
      return [];
    }
    try {
      const result = await User.find({ fullname: { $regex: searchField } });
      return result;
    } catch (err) {
      console.log(err);
    }
  },
  updateUserInfo: async ({ userProfileData }) => {
    try {
      const user = await User.findByIdAndUpdate(
        userProfileData.userId,
        {
          bio: userProfileData.bio,
          pfp: userProfileData.pfp,
          cover: userProfileData.cover
        },
        { omitUndefined: true }
      );

      await user.save();
      return {
        bio: user.bio,
        pfp: user.pfp,
        cover: user.cover
      };
    } catch (err) {
      console.log(err);
    }
  },
  followUser: async ({ srcUserId, tgtUsername }) => {
    try {
      const srcUser = await User.findById(srcUserId);
      const tgtUser = await User.findOne({ username: tgtUsername });
      const follow = srcUser.following.find(
        (x) => x.toString() === tgtUser._id.toString()
      );
      if (follow) {
        srcUser.following.pull(new ObjectID(tgtUser._id));
        tgtUser.followers.pull(new ObjectID(srcUserId));
      } else {
        srcUser.following.push(new ObjectID(tgtUser._id));
        tgtUser.followers.push(new ObjectID(srcUserId));
        const notification = new Notification({
          sender: srcUserId,
          receiver: tgtUser._id,
          eventType: 'FOLW',
          urlParam: srcUser.username
        });
        notification.save();
      }
      await srcUser.save();
      await tgtUser.save();
      if (follow) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      console.log(err);
    }
  }
};

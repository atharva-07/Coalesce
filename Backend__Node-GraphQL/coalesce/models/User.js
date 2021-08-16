const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    pfp: {
      type: String,
      required: true,
      default: ' '
    },
    cover: { type: String, required: true, default: ' ' },
    bio: {
      type: String,
      required: true,
      default: ' '
    },
    followers: [
      {
        type: Schema.Types.ObjectId
      }
    ],
    following: [
      {
        type: Schema.Types.ObjectId
      }
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post'
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      required: true
    },
    likes: [
      {
        type: Schema.Types.ObjectId
      }
    ]
  },
  { timestamps: true }
);

const postSchema = new Schema(
  {
    content: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: ''
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    comments: [commentSchema]
  },
  { timestamps: true }
);

const mainschema = {
  post: mongoose.model('Post', postSchema),
  comment: mongoose.model('Comment', commentSchema)
};

module.exports = mainschema;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        required: true
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Conversation', conversationSchema);

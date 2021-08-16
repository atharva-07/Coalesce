const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true
    },
    eventType: {
      type: String,
      required: true
    },
    seen: {
      type: Boolean,
      default: false
    },
    urlParam: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);

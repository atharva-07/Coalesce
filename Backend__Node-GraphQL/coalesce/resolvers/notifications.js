const Notification = require('../models/Notification.js');
const User = require('../models/User.js');

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
  fetchNotifications: async ({ userId }) => {
    try {
      const notifications = await Notification.find({ receiver: userId }).sort({
        createdAt: -1
      });
      const transformedNotifications = notifications.map((p) => {
        return {
          ...p._doc,
          _id: p.id,
          sender: fillCreator(p._doc.sender),
          createdAt: dateToString(p._doc.createdAt),
          updatedAt: dateToString(p._doc.updatedAt)
        };
      });
      return transformedNotifications;
    } catch (err) {
      console.log(err);
    }
  }
};

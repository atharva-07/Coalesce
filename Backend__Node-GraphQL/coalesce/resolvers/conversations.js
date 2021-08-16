const ObjectID = require('mongoose').Types.ObjectId;

const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

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

module.exports = {
  newConversation: async ({ senderId, receiverId }) => {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] }
      });
      if (!conversation) {
        const newConversation = new Conversation({
          members: [senderId, receiverId]
        });
        await newConversation.save();
        return { ...newConversation._doc, _id: newConversation.id };
      } else {
        return {
          ...conversation._doc,
          _id: conversation.id,
          updatedAt: dateToString(conversation.updatedAt)
        };
      }
    } catch (err) {
      console.log(err);
    }
  },
  fetchConversationInfo: async ({ conversationId, userId }) => {
    try {
      const conversation = await Conversation.findById(conversationId);
      const chatRecipient = conversation.members.find(
        (p) => p.toString() !== userId
      );
      return {
        ...conversation._doc,
        _id: conversation.id,
        chatRecipient: { _id: chatRecipient }
      };
    } catch (err) {
      console.log(err);
    }
  },
  newMessage: async ({ conversationId, messageText, userId }) => {
    try {
      const message = new Message({
        conversation_id: conversationId,
        message: messageText,
        sender: userId
      });
      await message.save();
      return {
        ...message._doc,
        _id: message.id
      };
    } catch (err) {
      console.log(err);
    }
  },
  fetchConversations: async ({ userId }) => {
    try {
      const userConversations = await Conversation.find({
        members: { $in: [userId] }
      });
      const transformedConversations = userConversations.map((p) => {
        const chatRecipient = p.members.find((x) => x != userId);
        return {
          ...p._doc,
          _id: p.id,
          chatRecipient: fillCreator(chatRecipient)
        };
      });
      return transformedConversations;
    } catch (err) {
      console.log(err);
    }
  },
  fetchMessages: async ({ conversationId }) => {
    try {
      const messages = await Message.find({ conversation_id: conversationId });
      const transformedMessages = messages.map((p) => {
        return {
          ...p._doc,
          _id: p.id,
          createdAt: dateToString(p.createdAt)
        };
      });
      return transformedMessages;
    } catch (err) {
      console.log(err);
    }
  }
};

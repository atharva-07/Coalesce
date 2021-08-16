const authResolver = require('./auth');
const postsResolver = require('./posts');
const commentsResolver = require('./comments');
const usersResolver = require('./users');
const conversationResolver = require('./conversations');
const notificationResolver = require('./notifications');

const rootResolver = {
  ...authResolver,
  ...postsResolver,
  ...commentsResolver,
  ...usersResolver,
  ...conversationResolver,
  ...notificationResolver
};

module.exports = rootResolver;

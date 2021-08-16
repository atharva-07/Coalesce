const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Comment {
    _id: ID!
    creator: User!
    content: String!
    likes: [ID!]!
    createdAt: String!
    updatedAt: String!
  }  

  type Post {
    _id: ID!
    content: String!
    image: String
    creator: User!
    likes: [ID!]!
    comments: [Comment!]!
    createdAt: String!
    updatedAt: String!
  }

  input PostData {
    content: String!
    image: String
    creator: ID!
  }

  type User {
    _id: ID!
    fullname: String!
    username: String!
    email: String!
    password: String!
    gender: String!
    pfp: String
    cover: String
    bio: String
    followers: [User!]
    following: [User!]
    posts: [Post!]
    createdAt: String!
    updatedAt: String!
  }

  input UserData {
    fullname: String!
    username: String!
    email: String!
    password: String!
    gender: String!
  }

  input UserProfileData {
    bio: String
    pfp: String
    cover: String
    userId: ID!
  }

  type UserProData {
    bio: String
    pfp: String
    cover: String
  }

  type AuthData {
    userId: ID!
    token: String!
    pfp: String!
    fullname: String!
    username: String!
    tokenExpiration: Int!
  }

  type Notification {
    _id: ID!
    sender: User!
    eventType: String!
    urlParam: String! 
    createdAt: String!
    updatedAt: String!
  }

  type Conversation {
    _id: ID!
    members: [ID!]!
    chatRecipient: User!
  }

  type Message {
    _id: ID!
    conversationId: ID!
    message: String!
    sender: ID!
    createdAt: String!  
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    fetchPosts(userId: ID!): [Post!]
    fetchSinglePost(postId: ID!): Post!
    getUserProfile(username: String!): User!
    getUsers(searchField: String!): [User!]!
    fetchNotifications(userId: ID!): [Notification!]!
    fetchConversations(userId: ID!): [Conversation!]!
    fetchConversationInfo(conversationId: ID!, userId: ID!): Conversation!
    fetchMessages(conversationId: ID!): [Message!]!
  }

  type RootMutation {
    signup(userData: UserData): User!
    createPost(postData: PostData): Post!
    likePost(postId: ID!, userId: ID!): ID!
    likeComment(postId: ID!, commentId: ID!, userId: ID!): ID!
    postComment(content: String!, postId: ID!, userId: ID!): Comment!
    updateUserInfo(userProfileData: UserProfileData): UserProData
    followUser(srcUserId: ID!, tgtUsername: String!): Boolean!
    newConversation(senderId: ID!, receiverId: ID!): Conversation!
    newMessage(conversationId: ID!, messageText: String!, userId: ID!): Message!
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

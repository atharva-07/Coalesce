const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

module.exports = {
  signup: async ({ userData }) => {
    const errors = [];
    if (validator.isEmpty(userData.fullname)) {
      errors.push({
        message: 'Name cannot be empty.'
      });
    }
    if (!validator.isLength(userData.username, { min: 5 })) {
      errors.push({ message: 'Username must be at least 5 characters long.' });
    }
    if (!validator.isEmail(userData.email)) {
      errors.push({ message: 'Entered Email is invalid.' });
    }
    if (
      validator.isEmpty(userData.password) ||
      !validator.isLength(userData.password, { min: 7 })
    ) {
      errors.push({ message: 'Password too short.' });
    }
    if (errors.length > 0) {
      const error = new Error('Invalid User Input');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUsername = await User.findOne({
      username: userData.username
    });
    if (existingUsername) {
      const error = new Error('Username Collision');
      error.data =
        'This username is already taken. Please try a different username.';
      error.code = 409;
      throw error;
    } else {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        const error = new Error('Email Address Collision');
        error.data =
          'This email address is already registered with us. Please use a different email address.';
        error.code = 409;
        throw error;
      } else {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const user = new User({
          fullname: userData.fullname,
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          gender: userData.gender
        });
        const result = await user.save();
        console.log(result);
        return {
          ...result._doc,
          password: "Can't retrieve password from the database",
          _id: result.id
        };
      }
    }
  },
  login: async ({ email, password }) => {
    let errorMsg;
    if (validator.isEmpty(email)) {
      errorMsg = 'Please enter a valid email.';
    }
    if (errorMsg) {
      const error = new Error(errorMsg);
      error.message = errorMsg;
      error.code = 422;
      throw error;
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('Invalid Email or Password');
      error.data =
        'The combination of entered email and password does not match.';
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Invalid Email or Password');
      error.data =
        'The combination of entered email and password does not match.';
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'somesupersecretkey',
      {
        expiresIn: '1h'
      }
    );
    return {
      userId: user.id,
      token: token,
      pfp: user.pfp,
      fullname: user.fullname,
      username: user.username,
      tokenExpiration: 1
    };
  }
};

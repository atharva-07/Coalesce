import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  pfp: null,
  fullname: null,
  username: null,
  login: () => {},
  logout: () => {}
});

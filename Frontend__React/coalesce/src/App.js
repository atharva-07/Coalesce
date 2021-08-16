import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Profile from './users/pages/Profile';
import Welcome from './auth/pages/Welcome';
import Home from './shared/pages/Home';
import Notifications from './notifications/pages/Notifications';
import Messages from './messages/pages/Messages';
import Login from './auth/pages/Login';
import SignUp from './auth/pages/SignUp';
import PostDetail from './posts/pages/PostDetail';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/use-auth';

const App = () => {
  const { token, login, logout, userId, pfp, fullname, username } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/home" exact>
          <Home />
        </Route>
        <Route path="/notifications" exact>
          <Notifications />
        </Route>
        <Route path="/messages">
          <Messages />
        </Route>
        <Route path="/@:username/post/:postId" exact>
          <PostDetail />
        </Route>
        <Route path="/@:username">
          <Profile />
        </Route>
        <Redirect to="/home" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Welcome />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/signup" exact>
          <SignUp />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        userId: userId,
        token: token,
        pfp: pfp,
        fullname: fullname,
        username: username,
        login: login,
        logout: logout
      }}
    >
      {routes}
    </AuthContext.Provider>
  );
};

export default App;

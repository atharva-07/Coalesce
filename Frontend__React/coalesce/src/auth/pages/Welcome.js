import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  document.title = 'Coalesce | Welcome';

  return (
    <div className="welcome-wrapper">
      <div className="message">
        <h1>Coalesce</h1>
        <p>Your own place to connect with your friends.</p>
      </div>
      <div className="links">
        <Link to="/login">Login</Link>
        <Link to="/signup">Create New Account</Link>
      </div>
    </div>
  );
};

export default Welcome;

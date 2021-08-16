import React from 'react';

const Logo = () => {
  return (
    <div>
      <img
        style={{ display: 'block' }}
        src={require('./coalesce.svg').default}
        height="70px"
        alt="coalesce"
      />
    </div>
  );
};

export default Logo;

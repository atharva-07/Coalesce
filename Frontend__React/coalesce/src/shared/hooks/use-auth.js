import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [pfp, setPFP] = useState();
  const [fullname, setFullname] = useState();
  const [username, setUsername] = useState();

  const login = useCallback(
    (uid, token, pfp, fullname, username, expirationDate) => {
      setToken(token);
      setUserId(uid);
      setPFP(pfp);
      setFullname(fullname);
      setUsername(username);
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          userId: uid,
          token: token,
          pfp: pfp,
          fullname: fullname,
          username: username,
          expiration: tokenExpirationDate.toISOString()
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setPFP(null);
    setFullname(null);
    setUsername(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.pfp,
        storedData.fullname,
        storedData.username,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { token, login, logout, userId, fullname, username, pfp };
};

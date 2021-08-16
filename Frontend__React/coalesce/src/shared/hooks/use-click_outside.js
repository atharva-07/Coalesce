import { useEffect, useRef, useCallback } from 'react';

const useClickOutside = (ref, cb, when) => {
  const savedCB = useRef(cb);

  useEffect(() => {
    savedCB.current = cb;
  });

  const handler = useCallback(
    (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        savedCB.current();
      }
    },
    [ref]
  );

  useEffect(() => {
    if (when) {
      document.addEventListener('click', handler);
    }

    return () => {
      document.removeEventListener('click', handler);
    };
  }, [when, handler]);
};

export default useClickOutside;

import React, { useCallback, useState, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import classes from './SearchBar.module.css';
import { debounce } from 'lodash';
import { useHttp } from '../../hooks/use-http';
import useClickOutside from '../../hooks/use-click_outside';
import Avatar from '../../../users/components/Avatar';
import { AuthContext } from '../../context/auth-context';

const SearchBar = (props) => {
  const auth = useContext(AuthContext);
  const history = useHistory();
  const { sendRequest } = useHttp();
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchBarRef = useRef(null);
  const resRef = useRef(null);

  const searchHandler = async (event) => {
    const graphqlQuery = {
      query: `
        query getSearchResults($searchField: String!) {
          getUsers(searchField: $searchField) {
            _id
            pfp
            fullname
            username
          }
        }
      `,
      variables: {
        searchField: event.target.value
      }
    };
    try {
      const results = await sendRequest('POST', JSON.stringify(graphqlQuery), {
        'Content-Type': 'application/json'
      });
      setSearchResults(results.data.getUsers);
      setIsOpen(!isOpen);
    } catch (err) {}
  };

  // eslint-disable-next-line
  const search = useCallback(debounce(searchHandler, 500), []);

  const handler = () => {
    setIsOpen(false);
  };

  const createConversation = async (receiverId) => {
    const graphqlQuery = {
      query: `
      mutation newConversation($senderId: ID!, $receiverId: ID!) {
        newConversation(senderId: $senderId, receiverId: $receiverId) {
          _id
          members
        }
      }
      `,
      variables: {
        senderId: auth.userId,
        receiverId: receiverId
      }
    };
    try {
      const responseData = await sendRequest(
        'POST',
        JSON.stringify(graphqlQuery),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      history.replace(`/messages/${responseData.data.newConversation._id}`);
    } catch (err) {}
  };

  useClickOutside(resRef, handler, isOpen);

  return (
    <>
      <div className={classes.wrapper}>
        <span className="material-icons-outlined">search</span>
        <input
          type="text"
          name="search"
          id="search"
          ref={searchBarRef}
          placeholder="Search for people...."
          className={classes['search-bar']}
          onChange={search}
          autoComplete={'off'}
        />
      </div>
      <div ref={resRef} className={classes.autocomplete}>
        {isOpen && searchResults.length === 0 ? (
          <span>No Results Found....</span>
        ) : (
          searchResults.map((i) => (
            <div
              key={i._id}
              className={classes['autocomplete-card']}
              onClick={() => {
                if (!props.chatMode) {
                  history.replace(`/@${i.username}`);
                } else {
                  createConversation(i._id);
                  props.setChatRecipient(i.fullname);
                  searchBarRef.current.value = '';
                  setSearchResults([]);
                }
              }}
            >
              <Avatar src={i.pfp} size="small" />
              <div className={classes.name}>
                <p>{i.fullname}</p>
                <p>@{i.username}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default SearchBar;

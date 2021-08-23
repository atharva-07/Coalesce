import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL
} from '../../shared/utility/validators';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/use-form';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import Modal from '../../shared/components/UI/Modal';
import { useHttp } from '../../shared/hooks/use-http';
import { useHistory } from 'react-router-dom';
import Logo from '../../shared/components/UI/Logo';

const SignUp = () => {
  useEffect(() => {
    document.title = 'Coalesce | Sign Up';
  }, []);
  const { isLoading, error, sendRequest, clearError } = useHttp();
  const history = useHistory();

  const [formState, inputHandler] = useForm(
    {
      fullname: {
        value: '',
        isValid: false
      },
      username: {
        value: '',
        isValid: false
      },
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const [radioChoice, setRadioChoice] = useState(null);

  const radioValueHandler = (event) => {
    setRadioChoice(event.target.value);
  };

  let { fullname, username, email, password } = formState.inputs;
  fullname = fullname.value;
  username = username.value;
  email = email.value;
  password = password.value;
  const gender = radioChoice;

  const graphqlQuery = {
    query: `
  mutation createNewUser($fullname: String!, $username: String!, $email: String!, $password: String!, $gender: String!) {
    signup(userData: {fullname: $fullname, username: $username, email: $email, password: $password, gender: $gender}) {
      fullname
      username
      email
    }
  }`,
    variables: {
      fullname,
      username,
      email,
      password,
      gender
    }
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest('POST', JSON.stringify(graphqlQuery), {
        'Content-Type': 'application/json'
      });
      history.replace('/login');
    } catch (err) {}
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {error && (
        <Modal
          heading={error.message}
          message={error.data}
          onConfirm={clearError}
        />
      )}
      <div className="auth-wrapper">
        <Logo />
        <h3>Sign up to Coalesce</h3>
        <form onSubmit={formSubmitHandler}>
          <Input
            id="fullname"
            type="text"
            placeholder="Full Name"
            label="Full Name"
            errorText="Name can only contain alphabets and can't be empty."
            validators={[VALIDATOR_REQUIRE()]}
            onInput={inputHandler}
          />
          <Input
            id="username"
            type="text"
            placeholder="Username"
            label="Username"
            errorText="Username must be at least 5 characters long"
            validators={[VALIDATOR_MINLENGTH(5)]}
            onInput={inputHandler}
          />
          <Input
            id="email"
            type="email"
            placeholder="Email address"
            label="Email"
            errorText="Invalid email"
            validators={[VALIDATOR_EMAIL()]}
            onInput={inputHandler}
          />
          <Input
            id="password"
            type="password"
            placeholder="Password"
            label="Password"
            errorText="Password must be at least 7 characters long"
            validators={[VALIDATOR_MINLENGTH(7)]}
            onInput={inputHandler}
          />
          <div className="form-gender">
            <span>I am a : </span>
            <div>
              <label htmlFor="male">Man</label>
              <input
                type="radio"
                id="male"
                name="gender"
                value="male"
                onChange={radioValueHandler}
                checked={radioChoice === 'male'}
                required
              />
            </div>
            <div>
              <label htmlFor="female">Woman</label>
              <input
                type="radio"
                id="female"
                name="gender"
                value="female"
                onChange={radioValueHandler}
                checked={radioChoice === 'female'}
                required
              />
            </div>
          </div>
          <Button type="submit" invalid={!formState.isValid}>
            Sign Up
          </Button>
          <i>
            Already have an account?&nbsp;&nbsp;
            <Link to="/login">Log In</Link>
          </i>
        </form>
      </div>
    </>
  );
};

export default SignUp;

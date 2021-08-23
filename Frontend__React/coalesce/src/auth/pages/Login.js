import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL
} from '../../shared/utility/validators';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/use-form';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import Modal from '../../shared/components/UI/Modal';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttp } from '../../shared/hooks/use-http';
import Logo from '../../shared/components/UI/Logo';

const Login = () => {
  useEffect(() => {
    document.title = 'Coalesce | Log In';
  }, []);

  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttp();

  const [formState, inputHandler] = useForm(
    {
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

  let { email, password } = formState.inputs;
  email = email.value;
  password = password.value;

  const graphqlQuery = {
    query: `
    query loginUser($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        userId
        token
        pfp
        fullname
        username
        tokenExpiration
      }
    }
    `,
    variables: {
      email,
      password
    }
  };

  const loginHandler = async (event) => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        'POST',
        JSON.stringify(graphqlQuery),
        {
          'Content-Type': 'application/json'
        }
      );
      auth.login(
        responseData.data.login.userId,
        responseData.data.login.token,
        responseData.data.login.pfp,
        responseData.data.login.fullname,
        responseData.data.login.username
      );
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
        <h3>Log in to Coalesce</h3>
        <form onSubmit={loginHandler}>
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
          <Button type="submit" invalid={!formState.isValid}>
            Log In
          </Button>
        </form>
        <i>
          New to Coalesce?&nbsp;&nbsp;
          <Link to="/signup">Create an account</Link>
        </i>
      </div>
    </>
  );
};

export default Login;

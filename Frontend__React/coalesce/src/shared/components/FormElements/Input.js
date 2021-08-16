import React, { useEffect, useReducer } from 'react';
import { validate } from '../../utility/validators';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validator)
      };
    case 'TOUCH':
      return {
        ...state,
        wasTouched: true
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.intialValue || '',
    isValid: props.initialValidity || false,
    wasTouched: false
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  const changeHandler = (event) => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validator: props.validators
    });
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH'
    });
  };

  return (
    <div>
      <label htmlFor={props.id} hidden>
        {props.label}
      </label>
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
      {!inputState.isValid && inputState.wasTouched && (
        <i className="err-msg">{props.errorText}</i>
      )}
    </div>
  );
};

export default Input;

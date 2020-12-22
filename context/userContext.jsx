import React, { useReducer, createContext } from 'react';
import PropTypes from 'prop-types';

const SET_USER = 'SET_USER';

const initialState = {
  user: null,
};

export const UserContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        user: action.payload,
      };
    default:
      return state;
  }
};

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { Provider } = UserContext;

  const actions = {
    setUser: (user) => {
      if (user) {
        dispatch({ type: SET_USER, payload: user });
      }
    },
  };

  return <Provider value={{ state, actions }}>{children}</Provider>;
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

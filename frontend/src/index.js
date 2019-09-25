import React from 'react';
import ReactDOM from 'react-dom';

import Root from './components/root';
import configureStore from './store/store';

import jwt_decode from 'jwt-decode';

import { setAuthToken } from './util/session_api_util';

import { logout } from './actions/session_actions';

// testing codes start
import { login } from './actions/session_actions';
import { createADog, fetchDogsFromUser, fetchDogsFromWalk, deleteADog, fetchADog } from './actions/dogs_action';
// testing codes end

document.addEventListener('DOMContentLoaded', () => {
  let store;

  if (localStorage.jwtToken) {
    setAuthToken(localStorage.jwtToken);
    const decodedUser = jwt_decode(localStorage.jwtToken);
    const preloadedState = { session: { isAuthenticated: true, user: decodedUser } };

    store = configureStore(preloadedState);

    const currentTime = Date.now() / 1000;
    if (decodedUser.exp < currentTime) {
      store.dispatch(logout());
      window.location.href = '/login';
    }
  } else {
    store = configureStore({});
  }

  // testing codes start
  window.login = login;
  window.setAuthToken = setAuthToken;
  window.getState = store.getState;

  window.createADog = createADog;
  window.fetchDogsFromUser = fetchDogsFromUser;
  window.fetchDogsFromWalk = fetchDogsFromWalk;
  window.deleteADog = deleteADog;
  window.fetchADog = fetchADog;
  window.dispatch = store.dispatch;
  // testing codes end

  const root = document.getElementById('root');
  
  // test
  window.getState = store.getState;
  // end test

  ReactDOM.render(<Root store={store} />, root);
});
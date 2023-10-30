import {createReducer, on} from '@ngrx/store';
import { login, resetState, updateFirstName, updateLastName, updateRole, updateToken, updateUserId } from './store.actions';
import { AppState } from './app-state'; // Import the AppState interface

const initialState: AppState = {
  login: false,
  firstName: "",
  lastName: "",
  userId: "",
  token: "",
  role: ""
};

export const loginReducer = createReducer(
  initialState.login,
  on(login, () => true),
  on(resetState, () => initialState.login)
);

export const firstNameReducer = createReducer(
  initialState.firstName,
  on(updateFirstName, (_, { newFirstName }) => newFirstName),
  on(resetState, () => initialState.firstName)
);

export const lastNameReducer = createReducer(
  initialState.lastName,
  on(updateLastName, (_, { newLastName }) => newLastName),
  on(resetState, () => initialState.lastName) 
);

export const userIdReducer = createReducer(
  initialState.userId,
  on(updateUserId, (_, { newUserId }) => newUserId),
  on(resetState, () => initialState.userId) 
);

export const tokenReducer = createReducer(
  initialState.token,
  on(updateToken, (_, { newToken }) => newToken),
  on(resetState, () => initialState.token) 
);

export const roleReducer = createReducer(
  initialState.role,
  on(updateRole, (_, { newRole }) => newRole),
  on(resetState, () => initialState.token) 
);
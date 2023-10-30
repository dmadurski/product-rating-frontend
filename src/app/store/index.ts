import { ActionReducerMap } from '@ngrx/store';
import { loginReducer, firstNameReducer, lastNameReducer, userIdReducer, tokenReducer, roleReducer } from './store.reducer';
import { AppState } from './app-state';

export const reducers: ActionReducerMap<AppState> = {
  login: loginReducer,
  firstName: firstNameReducer,
  lastName: lastNameReducer,
  userId: userIdReducer,
  token: tokenReducer,
  role: roleReducer
};
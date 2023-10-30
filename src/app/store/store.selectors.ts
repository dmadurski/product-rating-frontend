import { createSelector } from '@ngrx/store';
import { AppState } from './app-state';

const selectUserState = (state: AppState) => state;

export const selectLoginStatus = createSelector(selectUserState, (state) => state.login);
export const selectFirstName = createSelector(selectUserState, (state) => state.firstName);
export const selectLastName = createSelector(selectUserState, (state) => state.lastName);
export const selectUserId = createSelector(selectUserState, (state) => state.userId);
export const selectToken = createSelector(selectUserState, (state) => state.token);
export const selectRole = createSelector(selectUserState, (state) => state.role);
export const selectAppState = createSelector(selectUserState, (state) => state);
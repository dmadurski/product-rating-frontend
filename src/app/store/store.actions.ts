import {createAction, props} from '@ngrx/store';

export const login = createAction('[User] Log In');

export const updateFirstName = createAction('[User] Update First Name', props<{ newFirstName: string }>());
export const updateLastName = createAction('[User] Update Last Name', props<{ newLastName: string }>());
export const updateUserId = createAction('[User] Update ID', props<{ newUserId: string }>());
export const updateToken = createAction('[User] Update Token', props<{ newToken: string }>());
export const updateRole = createAction('[User] Update Role', props<{ newRole: string }>());

export const resetState = createAction('[User] Reset');
import { User } from './user';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User('firstNameValue', 'lastNameValue','userNameValue', 'passwordValue', "USER")).toBeTruthy();
  });
});

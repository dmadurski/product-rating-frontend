import { Review } from './review';

describe('Review', () => {
  it('should create an instance', () => {
    expect(new Review('ratingIdValue', 'cliendIdValue', 'firstNameValue', 'lastNameValue', 
      12345, 'productValue', 4, 'commentValue' , null)
    ).toBeTruthy();
  });
});

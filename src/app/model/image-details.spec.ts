import { ImageDetails } from './image-details';

describe('ImageDetails', () => {
  it('should create an instance', () => {
    expect(new ImageDetails("123", "filename")).toBeTruthy();
  });
});

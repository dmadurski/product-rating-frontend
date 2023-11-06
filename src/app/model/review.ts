import { ImageDetails } from "./image-details";

export class Review {
    ratingId: string | null;
    userId: string | null;
    firstName: string;
    lastName: string;
    zipcode: number;
    product: string;
    email: string;
    score: number;
    comment: string;
    imageDetailsList: ImageDetails[];
    dateAndTime: Date | null;

    constructor(ratingId: string | null, userId: string | null, firstName: string, lastName: string, 
        zipcode: number, product: string, email: string, score: number, comment: string, imageDetailsList: ImageDetails[], dateAndTime: Date | null) {
            this.ratingId = ratingId;
            this.userId = userId;
            this.firstName = firstName;
            this.lastName = lastName;
            this.zipcode = zipcode;
            this.product = product;
            this.email = email;
            this.score = score;
            this.comment = comment;
            this.imageDetailsList = imageDetailsList;
            this.dateAndTime = dateAndTime;
    }
}

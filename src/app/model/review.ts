export class Review {
    ratingId: string | null;
    userId: string | null;
    firstName: string;
    lastName: string;
    zipcode: number;
    product: string;
    score: number;
    comment: string;
    reviewFiles: File[];
    dateAndTime: Date | null;

    constructor(ratingId: string | null, userId: string | null, firstName: string, lastName: string, 
        zipcode: number, product: string, score: number, comment: string, reviewFiles: File[], dateAndTime: Date | null) {
            this.ratingId = ratingId;
            this.userId = userId;
            this.firstName = firstName;
            this.lastName = lastName;
            this.zipcode = zipcode;
            this.product = product;
            this.score = score;
            this.comment = comment;
            this.reviewFiles = reviewFiles;
            this.dateAndTime = dateAndTime;
    }
}

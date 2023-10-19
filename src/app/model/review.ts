export class Review {
    ratingId: string | null;
    firstName: string;
    lastName: string;
    zipcode: number;
    product: string;
    score: number;
    comment: string;
    dateAndTime: Date | null;

    constructor(ratingId: string | null, firstName: string, lastName: string, 
        zipcode: number, product: string, score: number, comment: string, dateAndTime: Date | null) {
            this.ratingId = ratingId;
            this.firstName = firstName;
            this.lastName = lastName;
            this.zipcode = zipcode;
            this.product = product;
            this.score = score;
            this.comment = comment;
            this.dateAndTime = dateAndTime;
    }
}

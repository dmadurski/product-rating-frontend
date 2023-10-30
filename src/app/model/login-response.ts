export class LoginResponse {
    userId: string;
    firstName: string;
    lastName: string;
    token: string;
    role: string;

    constructor(userId: string, firstName: string, lastName: string, token: string, role: string) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.token = token;
        this.role = role;
    }
}

export class User {
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    role: string;

    constructor(firstName: string, lastName: string, userName: string, password: string, role: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.password = password;
        this.role = role;
    }
}

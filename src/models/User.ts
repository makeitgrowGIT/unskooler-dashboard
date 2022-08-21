// To parse this data:
//
//   import { Convert, User } from "./file";
//
//   const user = Convert.toUser(json);

export interface User {
    contactNumber: string;
    email:         string;
    firstname:     string;
    joiningDate:   Date;
    lastSeen:      Date;
    lastname:      string;
    profilePicURL: string;
    uid:           string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toUser(json: string): User {
        return JSON.parse(json);
    }

    public static userToJson(value: User): string {
        return JSON.stringify(value);
    }
}

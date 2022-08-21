// To parse this data:
//
//   import { Convert, Class } from "./file";
//
//   const class = Convert.toClass(json);

export interface Class {
    boardID:      string;
    classID:      string;
    creationDate: Date;
    name:         string;
    price:        number;
    rating:       number;
    searchTags:   string[];
    subjectIDs:   string[];
    thumbnailURL: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toClass(json: string): Class {
        return JSON.parse(json);
    }

    public static classToJson(value: Class): string {
        return JSON.stringify(value);
    }
}

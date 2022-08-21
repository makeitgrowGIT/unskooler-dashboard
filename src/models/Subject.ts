// To parse this data:
//
//   import { Convert, Subject } from "./file";
//
//   const subject = Convert.toSubject(json);

export interface Subject {
    subjectID:    string;
    classID:      string;
    name:         string;
    summary:      string;
    chapterIDs:   string[];
    thumbnailURL: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toSubject(json: string): Subject {
        return JSON.parse(json);
    }

    public static subjectToJson(value: Subject): string {
        return JSON.stringify(value);
    }
}

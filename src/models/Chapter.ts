// To parse this data:
//
//   import { Convert, Chapter } from "./file";
//
//   const chapter = Convert.toChapter(json);

export interface Chapter {
    chapterID:    string;
    subjectID:    string;
    instructorID: string;
    index:        number;
    name:         string;
    summary:      string;
    moduleIDs:    string[];
    thumbnailURL: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toChapter(json: string): Chapter {
        return JSON.parse(json);
    }

    public static chapterToJson(value: Chapter): string {
        return JSON.stringify(value);
    }
}

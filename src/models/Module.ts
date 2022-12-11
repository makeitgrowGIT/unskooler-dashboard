// To parse this data:
//
//   import { Convert, Module } from "./file";
//
//   const module = Convert.toModule(json);

export interface Module {
    chapterID:         string;
    durationInSeconds: number;
    isFree:            boolean;
    index:             number;
    name:              string;
    videoURL:          string;
    moduleID:          string;
    thumbnailURL:      string;
    assignments:       string[];
    notes:             string[];
}

// Converts JSON strings to/from your types
export class Convert {
    public static toModule(json: string): Module {
        return JSON.parse(json);
    }

    public static moduleToJson(value: Module): string {
        return JSON.stringify(value);
    }
}

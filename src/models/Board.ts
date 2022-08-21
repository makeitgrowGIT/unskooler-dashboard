// To parse this data:
//
//   import { Convert, Board } from "./file";
//
//   const board = Convert.toBoard(json);

export interface Board {
    name:     string;
    boardID:  string;
    classIDs: string[];
}

// Converts JSON strings to/from your types
export class Convert {
    public static toBoard(json: string): Board {
        return JSON.parse(json);
    }

    public static boardToJson(value: Board): string {
        return JSON.stringify(value);
    }
}

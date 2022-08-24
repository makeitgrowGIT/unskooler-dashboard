

export interface Instrucor {
    firstName:     string;
    lastName:      string;
    insructorID:   string;
    contactNumber: number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toInstrucor(json: string): Instrucor {
        return JSON.parse(json);
    }

    public static instrucorToJson(value: Instrucor): string {
        return JSON.stringify(value);
    }
}

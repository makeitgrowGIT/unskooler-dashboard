export class ResponseEntiy {
    message: string;
    success: boolean;
    object: any;

    constructor(message: string, success: boolean, object: any) {
        this.message = message;
        this.object = object;
        this.success = success;
    }
}
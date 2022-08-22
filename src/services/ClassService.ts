import { db } from "../firebaseConfig";
import { Class } from "../models/Class";
import { Convert } from "../models/Class";


export class ClassService {
    classDB = db.collection("classes");

    public async getClassByBoardID(boardID: String) {
        var classes: Array<Class> = [];
        console.log("Retrivig Classes from Db for: " + boardID);
        var snapschots = await this.classDB.where("boardID", "==", boardID).get();
        console.log(snapschots.docs);
        snapschots.docs.forEach(element => {
            console.log(element.data());
            classes.push(Convert.toClass(JSON.stringify(element.data())))
        });
        return classes;
    }

    public async addNewClass(grade: Class) {
        try {
            var doc  =  await this.classDB.doc(grade.classID).set(grade);
            return { "success": true, "message": "class added" }
        } catch (error) {
            return { "success": false, "message": "Unable to add class: " + error }
        }
    }
}

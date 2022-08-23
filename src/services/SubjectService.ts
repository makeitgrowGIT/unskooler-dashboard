import { db } from "../firebaseConfig";
import { Class } from "../models/Class";
import { Convert } from "../models/Subject";
import { Subject } from "../models/Subject";


export class SubjectService{
    subjectDB = db.collection("subjects");

    public async  getAllSubjects (){
        var subjects: Array<Subject> =[];
        var snapschots = await this.subjectDB.get();
        snapschots.docs.forEach(element => {
            subjects.push(Convert.toSubject(JSON.stringify(element.data())))
        });
        return subjects;
    }

    public async addNewSumbject(subject: Subject) {
        try {
            var doc  =  await this.subjectDB.doc(subject.subjectID).set(subject);
            return { "success": true, "message": "class added" }
        } catch (error) {
            return { "success": false, "message": "Unable to add class: " + error }
        }
    }
}

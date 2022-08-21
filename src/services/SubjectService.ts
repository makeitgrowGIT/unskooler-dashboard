import { db } from "../firebaseConfig";
import { Class } from "../models/Class";
import { Convert } from "../models/Subject";
import { Subject } from "../models/Subject";


export class SubjectService{
    subjectDB = db.collection("subjects");

    public async  getAllSubjects (){
        var subjects: Array<Subject> =[];
        console.log("Retrivig Subjects from Db ");
        var snapschots = await this.subjectDB.get();
        console.log(snapschots.docs);
        snapschots.docs.forEach(element => {
            console.log(element.data());
            subjects.push(Convert.toSubject(JSON.stringify(element.data())))
        });
        return subjects;
    }
}

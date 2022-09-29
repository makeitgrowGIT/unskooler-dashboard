import firebase from "firebase/compat";
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
    public async addCphaterID(SubjectID: string,chapterID : string) {
        try {
            var doc  =  await this.subjectDB.doc(SubjectID).update({chapterIDs: firebase.firestore.FieldValue.arrayUnion(chapterID)});
            return { "success": true, "message": "class added" }
        } catch (error) {
            return { "success": false, "message": "Unable to add class: " + error }
        }
    }
    
    public async updateSubject(subjectID: string, sub: Subject){
        try {
            await this.subjectDB.doc(subjectID).update(sub)
            return { "success": true, "message": "subject Updated" }
        } catch (error) {
            return { "success": false, "message": "Unable to add class: " + error }
        }
    }
    public async deleteSubject(subjectID: string){
        try {
            await this.subjectDB.doc(subjectID).delete()
            return { "success": true, "message": "Subject deleted" }
        } catch (error) {
            return { "success": false, "message": "Unable to delete Subject: " + error }
        }

    }
    public async deleteChapterID(subjectID: string,chapterID: string){
        try {
            await this.subjectDB.doc(subjectID).update({"chapterIDs" : firebase.firestore.FieldValue.arrayRemove(chapterID) })
            return { "success": true, "message": "Subject deleted" }
        } catch (error) {
            return { "success": false, "message": "Unable to delete Subject: " + error }
        }

    }


}

import firebase from "firebase/compat";
import { db } from "../firebaseConfig";
import { Class } from "../models/Class";
import { Convert } from "../models/Class";


export class ClassService {
    classDB = db.collection("classes");

    public async getClassByBoardID(boardID: String) {
        var classes: Array<Class> = [];
        //console.log("Retrivig Classes from Db for: " + boardID);
        var snapschots = await this.classDB.where("boardID", "==", boardID).get();
        //console.log(snapschots.docs);
        snapschots.docs.forEach(element => {
            //console.log(element.data());
            classes.push(Convert.toClass(JSON.stringify(element.data())))
        });
        return classes;
    }

    public async getAllClasese(){
        let classes: Array<Class> =[];
        let snapschots = await this.classDB.get();
        //console.log(snapschots.docs);
        snapschots.docs.forEach(element => {
            //console.log(element.data());
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
    public async addSearchTags(classID: string, tags: string[]) {
        try {
            tags.forEach(tag => {
                var doc  =  this.classDB.doc(classID).update({searchTags: firebase.firestore.FieldValue.arrayUnion(tag)});
                //console.log("Updaing tags")
                //console.log(doc)
            });
            return { "success": true, "message": "class added" }
        } catch (error) {
            //console.log("Updaing tags")
            //console.log(error)
            return { "success": false, "message": "Unable to add class: " + error }
        }
    }
    public async addSubjectID(classID: string, SubjectID: string) {
        try {
            var doc  =  await this.classDB.doc(classID).update({subjectIDs: firebase.firestore.FieldValue.arrayUnion(SubjectID)});
            return { "success": true, "message": "class added" }
        } catch (error) {
            return { "success": false, "message": "Unable to add class: " + error }
        }
    }

    public async updateClass(classID: string, graded: Class){
        try {
            await this.classDB.doc(classID).update(graded)
            return { "success": true, "message": "class Updated" }
        } catch (error) {
            return { "success": false, "message": "Unable to add class: " + error }
        }
    }

}

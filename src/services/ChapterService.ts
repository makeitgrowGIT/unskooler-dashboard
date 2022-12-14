import firebase from "firebase/compat";
import { db } from "../firebaseConfig";
import { Chapter } from "../models/Chapter";
import { Convert } from "../models/Chapter";


export class ChapterService{
    chapterDB = db.collection("chapters");

    public async  getAllChapters (){
        var chapters: Array<Chapter> =[];
        //console.log("Retrivig Classes from Db for: ");
        var snapschots = await this.chapterDB.orderBy("name").get();
        //console.log(snapschots.docs);
        snapschots.docs.forEach(element => {
            //console.log(element.data());
            chapters.push(Convert.toChapter(JSON.stringify(element.data())))
        });
        return chapters;
    }

    public async addNewChapter(chapter: Chapter) {
        try {
            console.table(chapter)
            var doc  =  await this.chapterDB.doc(chapter.chapterID).set(chapter);
            return { "success": true, "message": "class added" }
        } catch (error) {
            return { "success": false, "message": "Unable to add class: " + error }
        }
    }
    public async addModuleID(chpaterID: string,moduleID : string) {
        try {
            var doc  =  await this.chapterDB.doc(chpaterID).update({moduleIDs: firebase.firestore.FieldValue.arrayUnion(moduleID)});
            return { "success": true, "message": "class added" }
        } catch (error) {
            return { "success": false, "message": "Unable to add class: " + error }
        }
    }
    public async deleteChapter(chapterID: string){
        try {
            await this.chapterDB.doc(chapterID).delete()
            return { "success": true, "message": "Chapter deleted" }
        } catch (error) {
            return { "success": false, "message": "Unable to delete Chapter: " + error }
        }

    }
    public async deleteModuleID(chapterID: string, moduleID: string){
        try {
            await this.chapterDB.doc(chapterID).update({"moduleIDs" : firebase.firestore.FieldValue.arrayRemove(moduleID) })
            return { "success": true, "message": "Subject deleted" }
        } catch (error) {
            return { "success": false, "message": "Unable to delete Subject: " + error }
        }

    }
    
    public async updateChapter(chapterID: string, chap: Chapter){
        try {
            await this.chapterDB.doc(chapterID).update(chap)
            return { "success": true, "message": "subject Updated" }
        } catch (error) {
            return { "success": false, "message": "Unable to add class: " + error }
        }
    }


}

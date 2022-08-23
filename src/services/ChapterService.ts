import { db } from "../firebaseConfig";
import { Chapter } from "../models/Chapter";
import { Convert } from "../models/Chapter";


export class ChapterService{
    chapterDB = db.collection("chapters");

    public async  getAllChapters (){
        var chapters: Array<Chapter> =[];
        console.log("Retrivig Classes from Db for: ");
        var snapschots = await this.chapterDB.get();
        console.log(snapschots.docs);
        snapschots.docs.forEach(element => {
            console.log(element.data());
            chapters.push(Convert.toChapter(JSON.stringify(element.data())))
        });
        return chapters;
    }
}
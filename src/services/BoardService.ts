import firebase from "firebase/compat";
import { db } from "../firebaseConfig";
import { Board } from "../models/Board";
import { Convert } from "../models/Board";


export class BoardService{
    boardDB = db.collection("boards");

    public async  getAllBoards (){
        var boards: Array<Board> =[];
        //console.log("Retrivig Classes from Db for: ");
        var snapschots = await this.boardDB.get();
        //console.log(snapschots.docs);
        snapschots.docs.forEach(element => {
            //console.log(element.data());
            boards.push(Convert.toBoard(JSON.stringify(element.data())))
        });
        return boards;
    }

    public async appendClassIDToBoard(boardID: string, classID:string){
        try {
            await this.boardDB.doc(boardID).update({classIDs: firebase.firestore.FieldValue.arrayUnion(classID)})
            return { "success": true, "message": "Class Appended" }
        } catch (error) {
            return { "success": false, "message": "Unable to Append class: " + error }
        }
    }

    public async deleteCassID(boardID:string, classID: string){
        try {
            await this.boardDB.doc(boardID).update({"classIDs": firebase.firestore.FieldValue.arrayRemove(classID) })
            return { "success": true, "message": "Class deleted" }
        } catch (error) {
            return { "success": false, "message": "Unable to delete class: " + error }
        }

    }
}

import firebase from "firebase/compat";
import { db } from "../firebaseConfig";
import { Convert } from "../models/Instructor";
import { Instrucor } from "../models/Instructor";


export class InstructorService {
    instrucorDB = db.collection("instructors");

    public async addNewInstrucor(instrucor: Instrucor) {
        try {
            var doc  =  await this.instrucorDB.doc(instrucor.insructorID).set(instrucor);
            return { "success": true, "message": "class added" }
        } catch (error) {
            return { "success": false, "message": "Unable to add class: " + error }
        }
    }
    
    public async  getAllInstocors(){
        var instructors: Array<Instrucor> =[];
        var snapschots = await this.instrucorDB.get();
        snapschots.docs.forEach(element => {
            instructors.push(Convert.toInstrucor(JSON.stringify(element.data())))
        });
        return instructors;
    }

}

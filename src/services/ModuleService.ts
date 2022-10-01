import firebase from "firebase/compat";
import { db } from "../firebaseConfig";
import { Convert } from "../models/Module";
import { Module } from "../models/Module";


export class ModuleService{
    moduleDb = db.collection("modules");

    public async getAllModules (){
        var modules: Array<Module> =[];
        //console.log("Retrivig Classes from Db for: ");
        var snapschots = await this.moduleDb.get();
        //console.log(snapschots.docs);
        snapschots.docs.forEach(element => {
            //console.log(element.data());
            modules.push(Convert.toModule(JSON.stringify(element.data())))
        });
        return modules;
    }

    public async addNewModue(module:Module) {
        try {
            var doc  =  await this.moduleDb.doc(module.moduleID).set(module);
            return { "success": true, "message": "class added" }
        } catch (error) {
            console.log(error)
            return { "success": false, "message": "Unable to add class: " + error }
        }
    }
    public async deleteModule(moduleID: string){
        try {
            await this.moduleDb.doc(moduleID).delete()
            return { "success": true, "message": "Chapter deleted" }
        } catch (error) {
            return { "success": false, "message": "Unable to delete Chapter: " + error }
        }

    }
    public async deleteArrayEnry(moduleID: string,enrty:string, arrayName1: string){
        try {
            await  this.moduleDb.doc(moduleID).update({[arrayName1] : firebase.firestore.FieldValue.arrayRemove(enrty) })
            return { "success": true, "message": " deleted" }
        } catch (error) {
            return { "success": false, "message": "Unable to delete Chapter: " + error }
        }

    }
}

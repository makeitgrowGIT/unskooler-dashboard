import { db } from "../firebaseConfig";
import { Convert } from "../models/Module";
import { Module } from "../models/Module";


export class ModuleService{
    moduleDb = db.collection("modules");

    public async getAllModules (){
        var modules: Array<Module> =[];
        console.log("Retrivig Classes from Db for: ");
        var snapschots = await this.moduleDb.get();
        console.log(snapschots.docs);
        snapschots.docs.forEach(element => {
            console.log(element.data());
            modules.push(Convert.toModule(JSON.stringify(element.data())))
        });
        return modules;
    }
}

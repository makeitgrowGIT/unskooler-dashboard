import { db } from "../firebaseConfig";
import { Convert } from "../models/Module";
import { Module } from "../models/Module";
import bcrypt from "bcryptjs";

export class FeaturedService{
    featureDB = db.collection("featured");
    
    public async addClassToFeature(classID: string){
        this.featureDB.add({type:"class","contentID":classID})
    }
    
    public async removeClassToFeature(classID: string){
       this.featureDB.where("contentID","==",classID).get().then((docs)=>{
        docs.forEach(function(doc) {
            doc.ref.delete();
          });
       })
   }
}

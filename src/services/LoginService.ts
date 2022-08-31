import { db } from "../firebaseConfig";
import { Convert } from "../models/Module";
import { Module } from "../models/Module";
import bcrypt from "bcryptjs";

export class LoginService{
    metadataDB = db.collection("metadeta");
    
     public async verifyAdmin(username: string, password: string){

        //Get Creds from db
        let docRef = await this.metadataDB.doc("loginInfo").get()
        let adminCreds = docRef.data()
        let dbPassowrd  = adminCreds?adminCreds["adminCreds"]["password"]:"none"
        let dbusername  = adminCreds?adminCreds["adminCreds"]["username"]:"none"
        //compare password 
        let result = await bcrypt.compare(password,dbPassowrd)
        //return value
        return result&& username===dbusername
    }
}

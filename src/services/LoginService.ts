import { db } from "../firebaseConfig";
import { Convert } from "../models/Module";
import { Module } from "../models/Module";
import bcrypt from "bcryptjs";

export class LoginService{
    metadataDB = db.collection("metadeta");
    
     public async verifyAdmin(username: string, password: string){

        //Get Creds from db
        let docRef = await this.metadataDB.doc("loginInfo").get()
        let adminCreds =  docRef.data()
        console.log(adminCreds)
        if (adminCreds?.usernames.indexOf(username)>-1)
            {
            let dbPassowrd  = adminCreds?.passwords[username]
            let dbrole  = adminCreds?.roles[username]
            let p =await  bcrypt.hash("solutionCone@1234",10)
            console.log(p)
            let result = await bcrypt.compare(password,dbPassowrd)
            // console.log(dbPassowrd,dbrole,result)
            return {result:result,role:dbrole}
        }
        //compare password 
        //return value
        return {result: false, role:null}
    }
}

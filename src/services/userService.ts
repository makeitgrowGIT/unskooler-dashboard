import { db } from "../firebaseConfig";
import { Convert } from "../models/User";
import { User } from "../models/User";


export class UserService{
    userDb = db.collection("users");

    public async  getAllUser (){
        var users: Array<User> =[];
        //console.log("Retrivig Subjects from Db ");
        var snapschots = await this.userDb.get();
        //console.log(snapschots.docs);
        snapschots.docs.forEach(element => {
            //console.log(element.data());
            users.push(Convert.toUser(JSON.stringify(element.data())))
        });
        return users;
    }
}

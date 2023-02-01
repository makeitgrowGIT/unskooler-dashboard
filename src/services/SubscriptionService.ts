import firebase from "firebase/compat";
import { db } from "../firebaseConfig";
import { ClassService } from "./ClassService";
import { UserService } from "./userService";

export class SubscriptionService{
    subscriptionDB = db.collection("subscriptions");
    userService =  new UserService();
    classService =  new ClassService()

    public async getSubscriptionsForClass(classID:string){
        try {
            var count = await this.subscriptionDB.where("classID","==",classID).get()
            return count.size
        } catch (error) {
            
        }
    }

    public async deleteSubscription(subID:string){
        try {
            await this.subscriptionDB.doc(subID).delete()
        } catch (error) {
            
        }
    }
    public async getAllSubscriptions(){
        try {
            var subList: Array<Object> = []
            var subs =  (await this.subscriptionDB.get()).docs
            var classMap = new Map<string,firebase.firestore.DocumentData|undefined>()
            var userMap = new Map<string,firebase.firestore.DocumentData|undefined>()

            for (let index = 0; index < subs.length; index++) {
                const sub = subs[index];

                var s = sub.data()
                if (userMap.has(s["userID"])){
                    var user = userMap.get(s["userID"])
                    console.log("uer Repetend")
                }
                else{
                    var user = await this.userService.getUserByUID(s["userID"]);
                    console.log("User From DB")
                    console.log(user)
                    userMap.set(s["userID"],user)
                }


                //for class
                if (classMap.has(s["classID"])) {
                    var cl = classMap.get(s["classID"])
                    console.log("class Repetend")
                }
                else{
                    var cl = await this.classService.getClassByID(s["classID"]);
                    classMap.set(s["classID"],cl)
                }
                try {
                    s["email"] = user!.email
                    s["userName"] = user!.firstname + " "+ user!.lastname
                    s["className"] = cl!.name+" - "+cl!.boardID
                    s["thumbnailUrl"] = cl!.thumbnailUrl
                    subList.push(s)
                    // console.log(s)
                } catch (error) {
                    // console.log(error,s,user,cl)
                }
            }
            return subList
        } catch (error) {
            
        }
    }
}
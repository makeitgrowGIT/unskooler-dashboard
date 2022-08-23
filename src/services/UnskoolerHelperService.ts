import { async } from "@firebase/util";
import { storage } from "../firebaseConfig";
import {uploadBytes, ref } from "firebase/storage";

export class UnskoolerHelperService{

    async uploadFile(file: File ){
        //This Method will upload given file to fireabse clous storage and return the downloadURL
        try {
            var uploadname = file.name
            var firebaseStorageRef = ref(storage,uploadname)
            var res = await uploadBytes(firebaseStorageRef,file)
            var pathRef = storage.ref(uploadname)
            var url =await pathRef.getDownloadURL();
            return { "success": true, "message": "File Uploaded ", "object":url }
        } catch (error) {
            return { "success": false, "message": "Unable to add class: " + error }
        }
    }

}
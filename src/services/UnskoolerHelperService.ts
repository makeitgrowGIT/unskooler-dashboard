import { async } from "@firebase/util";
import { storage } from "../firebaseConfig";
import { uploadBytes, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export class UnskoolerHelperService {

    async uploadFile(file: File, name:string) {
        //This Method will upload given file to fireabse clous storage and return the downloadURL
        try {
            console.log("Uploading : "+file.name)
            var uploadname = name+"."+file.name.split(".").at(file.name.split(".").length-1)
            console.log("Uploading : "+uploadname)
            var firebaseStorageRef = ref(storage, uploadname)
            var res = await uploadBytes(firebaseStorageRef, file)
            var pathRef = storage.ref(uploadname)
            var url = await pathRef.getDownloadURL();
            console.log("Upload Files Url: ");
            console.log(url);
            return { "success": true, "message": "File Uploaded ", "object": url }
        } catch (error) {
            console.log("Upload Error: "+file.name)
            return { "success": false, "message": "Unable to add class: " + error }
        }
    }

    async deleteByURl(url: string){
        try {
            var firebaseStorageRef = storage.refFromURL(url);
            console.log("Deleting: "+firebaseStorageRef.name);
            await firebaseStorageRef.delete()
            console.log("Deleted: "+firebaseStorageRef.name);
            return { "success": true, "message": "File Uploaded ", "object": url }
        } catch (error) {
            
        }
    }

    async uploadFileWithPercent(file: File, setloadingMessageFunction: any, setUrlFunction: any, setErrorFunction:  any, complitionFunction: Function ) {
        //This Method will upload given file and set
        try {
            console.log("File: ")
            console.log(file)
            if (!file) {
                console.log("No Video URL here")
                setUrlFunction("")
                        complitionFunction("")
                        return ""
            }
            const storageRef = ref(storage, "largeFiles/" + file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);
            return  uploadTask.on('state_changed',
                (snapshot) => {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = Math.round( ((snapshot.bytesTransferred / snapshot.totalBytes) * 100)* 100) / 100;
                    console.log('Upload is ' + progress + '% done');
                    setloadingMessageFunction(`Uploading File: ${progress}%`)
                    switch (snapshot.state) {
                        case 'paused':
                            //console.log('Upload is paused');
                            break;
                        case 'running':
                            //console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            setErrorFunction(error.message)
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            setErrorFunction(error.message)
                            break;

                        // ...

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            setErrorFunction(error.message)
                            break;
                    }
                },
                async () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setUrlFunction(downloadURL)
                        complitionFunction(downloadURL)
                        return { "success": false, "message": "Unable to add class: "  }
                    });
                }
            );
        } catch (error) {
            console.log("Upload Error: "+file.name)
            console.log("Upload Error: "+error)
            setErrorFunction("Upload Error: "+error)
            return { "success": false, "message": "Unable to add class: " + error }
        }
    }

}
import React, { useEffect, useState } from "react";
import { Button, Card, CloseButton, Modal, ModalBody, ModalFooter, ModalHeader, Row, Toast, ToastBody } from "reactstrap";
import '../pages/module.css'
import { BoardService } from "../services/BoardService";
import { ChapterService } from "../services/ChapterService";
import { ClassService } from "../services/ClassService";
import { InstructorService } from "../services/InstructorService";
import { ModuleService } from "../services/ModuleService";
import { SubjectService } from "../services/SubjectService";
import { UnskoolerHelperService } from "../services/UnskoolerHelperService";
import { uploadBytes, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";
import { async } from "@firebase/util";
import { Link, useParams } from 'react-router-dom'


const Module = () => {
  const [modal, setmodal] = useState(false);
  const [modules, setmodules] = useState([]);
  const [boardID, setboardID] = useState("");
  const [boards, setboards] = useState([]);
  const [classID, setclassID] = useState("")
  const [classes, setclasses] = useState([])
  const [subjects, setsubjects] = useState([])
  const [subjecID, setsubjecID] = useState("")
  const [chapters, setchapters] = useState([])
  const [chapterID, setchapterID] = useState("")
  const [moduleName, setmoduleName] = useState("")
  const [moduleIndex, setmoduleIndex] = useState(0)
  //For Thumbnail
  const [classPicPath, setclassPicPath] = useState("")
  const [imageFile, setimageFile] = useState(null)
  //For video
  const [videoPath, setvideoPath] = useState("")
  const [videoFile, setvideoFile] = useState(null)
  const [videoURL, setvideoURL] = useState("")
  const [videoDuration, setvideoDuration] = useState(0)

  //forNotesAndAssignment
  const [notesCount, setnotesCount] = useState("")
  const [notesPaths, setnotesPaths] = useState([])
  const [notesFiles, setnotesFiles] = useState([])
  let { id } = useParams()

  const [assignmetCount, setassignmetCount] = useState("")
  const [assignmetPaths, setassignmetPaths] = useState([])
  const [assignmetFiles, setassignmetFiles] = useState([])

  //For Uloading percent
  const [loadingMessage, setloadingMessage] = useState("<i class='bx bx-loader bx-spin'></i>")
  const [pecent, setpecent] = useState(0)
  const [loading, setloading] = useState(false)
  const [deleteObj, setdeleteObj] = useState(null)
  const [deleteModal, setdeleteModal] = useState(false)
  const [focusedModuleObj, setfocusedModuleObj] = useState(null)
  const [isFocused, setisFocused] = useState(false)


  const moduleService = new ModuleService();
  const chapterService = new ChapterService()
  const classService = new ClassService()
  const boardService = new BoardService()
  const subjectService = new SubjectService()
  const role = localStorage.getItem("role")

  function initialLoad() {
    chapterService.getAllChapters().then((chs) => {
      setchapters(chs);
    })
    boardService.getAllBoards().then((ins) => {
      setboards(ins)
    })
    classService.getAllClasese().then((chs) => {
      setclasses(chs);
    })
    subjectService.getAllSubjects().then((chs) => {
      setsubjects(chs);
    })
    moduleService.getAllModules().then((mds) => {
      setmodules(mds)
    })
  }

  useEffect(() => {
    let loggedIn = localStorage.getItem("loggedIn")
    if (JSON.parse(loggedIn)) {
      initialLoad()
    }
    else {
      window.location.href = '/'
    }
  }, [])

  async function addModule(e) {
    e.preventDefault()
    setloading(true)
    let unskService = new UnskoolerHelperService()
    //Create module id
    let module_id = moduleName.trim().replace(/ /g, "_").toLocaleLowerCase() + "_" + chapterID + "_" + subjecID + "_" + classID + "_" + boardID.toLocaleLowerCase().replace(/ /g, "_")
    //Create Search Tags
    let searcgTags = moduleName.toLocaleLowerCase().split(" ")
    //Add search tags
    await classService.addSearchTags(searcgTags)
    await chapterService.addModuleID(chapterID, module_id)

    //For Notes:
    let notesURL = []
    let c = 0
    notesFiles.forEach(async (element) => {
      console.log("Uploading Notes")
      if (element) {
        setloadingMessage(`Uploading Notes ${c + 1}/${notesFiles.length}`)
        let pdfURLA = await unskService.uploadFile(element,element.name)
        c++
        if (pdfURLA.success) {
          notesURL.push(pdfURLA.object)
        }
        else {
          alert(pdfURLA.message)
        }
      }
    });
    console.log("Notes URLs: ")
    console.log(notesURL)

    //For Assignments:
    let assigmentUrls = []
    let ca = 0
    assignmetFiles.forEach(async (element) => {
      console.log("Uploading Assignments")
      if (element) {
        setloadingMessage(`Uploading Assignemnets ${ca + 1}/${notesFiles.length}`)
        let pdfURLA = await unskService.uploadFile(element,element.name)
        ca++
        if (pdfURLA.success) {
          assigmentUrls.push(pdfURLA.object)
        }
        else {
          alert(pdfURLA.message)
        }
      }
    });
    console.log("Assignments URLs: ")
    console.log(assigmentUrls)

    //Upload thumbnail
    setloadingMessage("Uploading Thumbnail...")
    let thmbURL = await unskService.uploadFile(imageFile,module_id)


    var duration = 0;
    var video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = function () {

      window.URL.revokeObjectURL(video.src);

      if (video.duration < 1) {

        console.log("Invalid Video! video is less than 1 second");
        alert("Invalid Video! video is less than 1 second");
        return;
      }
      duration = video.duration;
      console.log(video)
      console.log(duration)
      setvideoDuration(duration)
    }
    if (videoFile) {
      video.src = URL.createObjectURL(videoFile);
    }



    unskService.uploadFileWithPercent(videoFile, setloadingMessage, setvideoURL, (err) => { alert(err) }, (downloadURl) => {
      setloadingMessage("uploading...")
      console.log(videoDuration)
      if (chapterID.length < 2) {
        console.log("Empty value")
        console.log(chapters.filter((curVal, val, index) => { return curVal.subjectID === subjecID })[0].chapterID)
        setchapterID(chapters.filter((curVal, val, index) => { return curVal.subjectID === subjecID })[0].chapterID)
      }
      //create moduleObj
      const moduleObj = {
        "chapterId": chapterID,
        "durationInSeconds": Number.parseInt(duration),
        "index": Number.parseInt(moduleIndex),
        "isFree": false,
        "moduleID": module_id,
        "name": moduleName,
        "thumbnailURL": thmbURL.object,
        "notes": notesURL,
        "assignments": assigmentUrls,
        "videoURL": downloadURl
      }
      console.log("Module Before Upload: ")
      console.log(moduleObj)
      moduleService.addNewModue(moduleObj).then(() => {

        initialLoad()
        setloading(false)
        setmodal(false)
        setnotesCount("")
        setnotesFiles([])
        setnotesPaths([])
        setassignmetCount("")
        setassignmetFiles([])
        setassignmetPaths([])
        setvideoFile(null)
        setvideoURL("")
        setvideoURL(null)
      }
      )
    })

  }


  const readURLFilePath = (event, setPathFunction, setFileFunction) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPathFunction(reader.result)
      }
    }

    setFileFunction(event.target.files[0])
    reader.readAsDataURL(event.target.files[0])

  }

  const readURLFilePaths = (event, setPathsFunction, pathList, setFilesFunction, fileList) => {
    console.log(pathList, fileList)
    console.log(typeof (pathList), typeof (fileList))
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        let tempPaths = pathList
        tempPaths.push(reader.result)
        setPathsFunction(tempPaths)
      }
    }
    let TempFiels = fileList;
    TempFiels.push(event.target.files[0])
    setFilesFunction(TempFiels)
    reader.readAsDataURL(event.target.files[0])

  }
  return (
    <>
      <div className="notForMobile">
        <h1 className="warning">This site is not compatible with mobile devices please open in Desktop mode</h1>
      </div>
      <div className="pageHeadingDiv">
        <h2 className="coursesChild">Courses {">"} Class {">"} Subject {">"} Chapter {">"} &nbsp;<span className="coursePath">Module</span></h2>
        <div>
          <Modal size="lg" isOpen={modal} toggle={() => setmodal(!modal)}>
            <ModalHeader toggle={() => setmodal(!modal)}>
              Add Module
            </ModalHeader>
            <ModalBody style={{
              maxHeight: 'calc(100vh - 210px)',
              overflowY: 'auto'
            }}>
              <form onSubmit={addModule}>
                <Row>
                  <div>
                    <label htmlFor="name">Module name</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ "marginBottom": "20px" }}
                      placeholder="Enter name"
                      onChange={(e) => { setmoduleName(e.target.value) }}
                    ></input>
                  </div>

                  <div>
                    <label htmlFor="name">Module Index</label>
                    <input
                      type="number"
                      className="form-control"
                      style={{ "marginBottom": "20px" }}
                      placeholder="Enter index"
                      onChange={(e) => { setmoduleIndex(e.target.value) }}
                    ></input>
                  </div>

                  <div>
                    <label htmlFor="name">Board</label>
                    <select
                      type="text"
                      className="form-control"
                      style={{ "marginBottom": "20px" }}
                      placeholder="Enter Chapter Summary"
                      onChange={(e) => { setboardID(e.target.value) }}
                    >
                      <option>Select Board</option>
                      {boards.map((_ins) => { return <option value={_ins.boardID}>{_ins.name}</option> })}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="name">Class</label>
                    <select
                      type="text"
                      className="form-control"
                      style={{ "marginBottom": "20px" }}
                      placeholder="Enter Chapter Summary"
                      onChange={(e) => { setclassID(e.target.value) }}
                    >
                      <option>Select Class</option>
                      {classes.filter((curVal, val, index) => { return curVal.boardID === boardID }).map((_ins) => { return <option value={_ins.classID}>{_ins.name}</option> })}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="name">Subject</label>
                    <select
                      type="text"
                      className="form-control"
                      placeholder="Enter Chapter Summary"
                      required
                      style={{ "marginBottom": "20px" }}
                      onChange={(e) => { setsubjecID(e.target.value) }}
                    >
                      <option>Select Subject</option>
                      {subjects.filter((curVal, val, index) => { return curVal.classID === classID }).map((_ins) => { return <option value={_ins.subjectID}>{_ins.name}</option> })}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="name">Chapter</label>
                    <select
                      type="text"
                      className="form-control"
                      placeholder="Enter Chapter Summary"
                      required
                      style={{ "marginBottom": "20px" }}
                      defaultValue={chapters.length > 0 ? chapters[0].chapterID : ""}
                      onChange={(e) => { setchapterID(e.target.value) }}
                    >
                      <option>Select Chapter</option>
                      {chapters.filter((curVal, val, index) => { return curVal.subjectID === subjecID }).map((_ins) => { return <option value={_ins.chapterID}>{_ins.name}</option> })}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="name">Module Thumbnail</label>
                    <input
                      type="file"
                      className="form-control"
                      placeholder="Enter name"
                      required
                      style={{ "marginBottom": "20px" }}
                      accept="image/png, image/jpeg"
                      onChange={(e) => { readURLFilePath(e, setclassPicPath, setimageFile) }}
                    ></input>
                  </div>

                  <div>
                    <label htmlFor="name">Upload Notes</label>
                    <select
                      type="number"
                      className="form-control"
                      onChange={(e) => { setnotesCount(e.target.value) }}
                    >
                      <option value={[]}>0</option>
                      <option value={[1]}>1</option>
                      <option value={[1, 2]}>2</option>
                      <option value={[1, 2, 3]}>3</option>
                      <option value={[1, 2, 3, 4]}>4</option>
                      <option value={[1, 2, 3, 4, 5]}>5</option>
                    </select>
                    {
                      // console.log(notesCount)
                      notesCount.split(",").map((n) => {
                        if (Number.parseInt(n) > 0) {
                          return <input
                            type="file"
                            accept="application/pdf"
                            className="form-control"
                            placeholder="Enter name"
                            style={{ "marginBottom": "10px", "marginTop": "10px" }}
                            required
                            onChange={(e) => { readURLFilePaths(e, setnotesPaths, notesPaths, setnotesFiles, notesFiles) }}
                          ></input>
                        }

                      })
                    }
                    <hr />
                  </div>

                  <div>
                    <label htmlFor="name">Upload Assignmets</label>
                    <select
                      type="number"
                      className="form-control"
                      onChange={(e) => { setassignmetCount(e.target.value) }}
                    >
                      <option value={[]}>0</option>
                      <option value={[1]}>1</option>
                      <option value={[1, 2]}>2</option>
                      <option value={[1, 2, 3]}>3</option>
                      <option value={[1, 2, 3, 4]}>4</option>
                      <option value={[1, 2, 3, 4, 5]}>5</option>
                    </select>
                    {
                      // console.log(notesCount)
                      assignmetCount.split(",").map((n) => {
                        if (Number.parseInt(n) > 0) {
                          return <input
                            type="file"
                            accept="application/pdf"
                            className="form-control"
                            placeholder="Enter name"
                            style={{ "marginBottom": "10px", "marginTop": "10px" }}
                            required
                            onChange={(e) => { readURLFilePaths(e, setassignmetPaths, assignmetPaths, setassignmetFiles, assignmetFiles) }}
                          ></input>
                        }

                      })
                    }
                    <hr />
                  </div>

                  <div>
                    <label htmlFor="name">Upload Video</label>
                    <input
                      type="file"
                      className="form-control"
                      placeholder="Enter name"
                      style={{ "marginBottom": "20px" }}
                      accept="video/mp4,video/x-m4v,video/*"
                      defaultValue={null}
                      onChange={(e) => { readURLFilePath(e, setvideoPath, setvideoFile) }}
                    ></input>
                  </div>
                  <button
                    style={{ "marginBottom": "20px" }}
                    className={loading ? "addInstructor-loading" : "addInstructor"} type="submit">{loading ? loadingMessage : "Sumbit"}</button>

                </Row>
              </form>
            </ModalBody>
          </Modal>
          <Modal isOpen={deleteModal} toggle={() => setdeleteModal(!deleteModal)}>
            <ModalHeader toggle={() => setdeleteModal(false)}>
              Delete Module
            </ModalHeader>
            <ModalBody>
              Are you sure you want to delete {deleteObj ? deleteObj.name : ""}?<br></br>
              <Button onClick={() => {
                setloading(true)
                if (deleteObj && role=="admin") {
                  chapterService.deleteModuleID(deleteObj.chapterID, deleteObj.moduleID).then((res) => {

                    moduleService.deleteModule(deleteObj.moduleID).then((res) => {
                      if(res.success){
                        setloading(false)
                        setdeleteModal(false)
                        initialLoad()
                      }
                      else{
                        alert("unable to delete: "+res.message)
                      }
                    })
                  })
                }
                else{
                  alert("You are not authorized to perform this operation")
                }
              }}>Yes</Button> <Button onClick={() => { setdeleteModal(false) }}>No</Button>
            </ModalBody>
          </Modal>
          <Modal size="lg" isOpen={isFocused} toggle={() => setisFocused(!isFocused)}  >
            <ModalHeader>{focusedModuleObj ? focusedModuleObj.name : null}</ModalHeader>
            <ModalBody style={{
              maxHeight: 'calc(100vh - 210px)',
              overflowY: 'auto'
            }}>
              <div style={{ "padding": "20px" }}>
                { focusedModuleObj? focusedModuleObj["videoURL"].length>1?<video width="720" controls>
                  <source src={focusedModuleObj ? focusedModuleObj.videoURL : null}></source>
                </video>:<h3>No Video Available</h3>:<h3>No Video Available</h3>}
                <hr />
                <h5>Assignments</h5>
                <div>
                  {focusedModuleObj ? focusedModuleObj.assignments.map((as, idx) => {
                    return <Toast style={{ marginBottom: "20px" }}>
                      <ToastBody style={{ "display": "flex", "flexDirection": "row", "justifyContent": "space-between" }}>
                        <h6>Assigment {idx + 1} </h6>
                        <a href={as} target="_blank">
                          <i class='bx bx-link-external' style={{ cursor: "pointer" }}></i>
                        </a>
                        <CloseButton onClick={() => {
                          if (focusedModuleObj) {
                            console.log(focusedModuleObj.moduleID, as, "assignments")
                            moduleService.deleteArrayEnry(focusedModuleObj.moduleID, as, "assignments").then((res) => {
                              console.log(res)
                              focusedModuleObj.assignments.pop(as);
                              setfocusedModuleObj(focusedModuleObj)
                              setisFocused(false)
                              initialLoad()
                            });
                          }
                        }} />
                      </ToastBody>
                    </Toast>
                  }) : <></>}
                </div>
                <hr />
                <h5>Notes</h5>
                <div>
                  {focusedModuleObj ? focusedModuleObj.notes.map((as, idx) => {
                    return <Toast style={{ marginBottom: "20px" }}>
                      <ToastBody style={{ "display": "flex", "flexDirection": "row", "justifyContent": "space-between" }}>
                        <h6>Notes {idx + 1} </h6>
                        <a href={as} target="_blank">
                          <i class='bx bx-link-external' style={{ cursor: "pointer" }}></i>
                        </a>
                        <CloseButton onClick={() => {
                          if (focusedModuleObj) {
                            console.log(focusedModuleObj.moduleID, as, "notes")
                            moduleService.deleteArrayEnry(focusedModuleObj.moduleID, as, "notes").then((res) => {
                              console.log(res)
                              focusedModuleObj.notes.pop(as);
                              setfocusedModuleObj(focusedModuleObj)
                              initialLoad()
                            });
                          }
                        }} />
                      </ToastBody>
                    </Toast>
                  }) : <></>}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>Unskooler Property</ModalFooter>
          </Modal>
          <button className="addInstructor" onClick={() => setmodal(true)}>
            Add Module
          </button>
        </div>
      </div>

      <div className="subjectColumn">
        {modules.filter((val) => { return id == "all" ? true : val.chapterId === id }).sort((s1, s2) => { return s1.index - s2.index }).map((md) => {
          // console.log("Module:");
          // console.log(md);
          return <div className="item">
            <div className="chapterNameMargin">
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                <h5 >{md.name}</h5>
                <i class='bx bxs-trash' onClick={async () => {
                  setdeleteModal(true);
                  setdeleteObj(md)
                }} style={{ cursor: "pointer" }}></i>
              </div>
              <h6 >{Math.floor(md.durationInSeconds / 60)}:{md.durationInSeconds % 60} Mins</h6>
              <>
                <h8>{md.notes.length} Notes,</h8><h8> {md.assignments.length} Assigments</h8>
              </>
            </div>
            <div className="subjectbgImg1" style={{ backgroundImage: "url(" + md.thumbnailURL + ")" }} onClick={() => {
              setfocusedModuleObj(md)
              setisFocused(true)
            }}></div>
          </div>
        })}
      </div>
    </>
  )
}

export default Module
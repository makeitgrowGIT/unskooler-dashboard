import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, Row } from "reactstrap";
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
  //For pdf
  const [pdfPath, setpdfPath] = useState("")
  const [pdfFile, setpdfFile] = useState(null)
  const [pdfURL, setpdfURL] = useState("")
  //For Uloading percent
  const [loadingMessage, setloadingMessage] = useState("<i class='bx bx-loader bx-spin'></i>")
  const [pecent, setpecent] = useState(0)
  const [loading, setloading] = useState(false)


  const moduleService = new ModuleService();
  const chapterService = new ChapterService()
  const classService = new ClassService()
  const boardService = new BoardService()
  const subjectService = new SubjectService()

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
    let module_id = moduleName.trim().replace(/ /g, "_").toLocaleLowerCase() + "_" + chapterID + "_" + subjecID + "_" + classID + "_" + boardID
    //Create Search Tags
    let searcgTags = moduleName.toLocaleLowerCase().split(" ")
    //Add search tags
    await classService.addSearchTags(searcgTags)
    await chapterService.addModuleID(chapterID, module_id)
    //Upload thumbnail
    setloadingMessage("Uploading Thumbnail...")
    let thmbURL = await unskService.uploadFile(imageFile)
    //Upload pdf with %
    let pdfURLA = ""
    if (pdfFile) {
      setloadingMessage("Uploading Pdf...")
      pdfURLA = await unskService.uploadFile(pdfFile)
      if (pdfURLA.success) {
        pdfURLA = pdfURLA.object
      }
      else {
        alert(pdfURLA.message)
      }
    }
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
    video.src = URL.createObjectURL(videoFile);



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
        "pdfUrl": pdfURLA,
        "videoURL": downloadURl
      }
      console.log(moduleObj)
      //Upload ModuleObj
      moduleService.addNewModue(moduleObj).then(() => {

        initialLoad()
        setloading(false)
        setmodal(false)
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
            <ModalBody>
              <form onSubmit={addModule}>
                <Row>
                  <div>
                    <label htmlFor="name">Module name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter name"
                      onChange={(e) => { setmoduleName(e.target.value) }}
                    ></input>
                  </div>

                  <div>
                    <label htmlFor="name">Module Index</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter index"
                      onChange={(e) => { setmoduleIndex(e.target.value) }}
                    ></input>
                  </div>

                  <div>
                    <label htmlFor="name">Board</label>
                    <select
                      type="text"
                      className="form-control"
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
                      onChange={(e) => { readURLFilePath(e, setclassPicPath, setimageFile) }}
                    ></input>
                  </div>

                  <div>
                    <label htmlFor="name">Upload PDF</label>
                    <input
                      type="file"
                      className="form-control"
                      placeholder="Enter name"
                      required
                      onChange={(e) => { readURLFilePath(e, setpdfPath, setpdfFile) }}
                    ></input>
                  </div>

                  <div>
                    <label htmlFor="name">Upload Video</label>
                    <input
                      type="file"
                      className="form-control"
                      placeholder="Enter name"
                      required
                      onChange={(e) => { readURLFilePath(e, setvideoPath, setvideoFile) }}
                    ></input>
                  </div>

                </Row>
                <button className={loading ? "addInstructor-loading" : "addInstructor"} type="submit">{loading ? loadingMessage : "Sumbit"}</button>
              </form>
            </ModalBody>
          </Modal>
          <button className="addInstructor" onClick={() => setmodal(true)}>
            Add Module
          </button>
        </div>
      </div>

      <div className="subjectColumn">
        {modules.map((md) => {
          return <div className="item">
            <div className="chapterNameMargin">
              <h7 className="chaptername">{md.name}</h7><br />
              <h7 className="chaptername">{md.durationInSeconds} Sec</h7>
            </div>
            <div className="subjectbgImg1" style={{ backgroundImage: "url(" + md.thumbnailURL + ")" }}></div>
          </div>
        })}
      </div>
    </>
  )
}

export default Module
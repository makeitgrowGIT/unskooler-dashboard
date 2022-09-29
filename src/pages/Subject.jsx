import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { Convert } from "../models/Subject";
import '../pages/subject.css'
import { BoardService } from "../services/BoardService";
import { ClassService } from "../services/ClassService";
import { SubjectService } from "../services/SubjectService";
import { UnskoolerHelperService } from "../services/UnskoolerHelperService";
import {
  useParams
} from "react-router-dom";

import { Link } from 'react-router-dom'
const Subject = () => {
  const [modal, setmodal] = useState(false);
  const [subjects, setsubjects] = useState([]);
  const [imageFile, setimageFile] = useState(null);
  const [subjectName, setsubjectName] = useState("")
  const [subjectSummary, setsubjectSummary] = useState("")
  const [subjectThumbnailURl, setsubjectThumbnailURl] = useState("");
  const [classboardID, setboardID] = useState("CBSE");
  const [classID, setclassID] = useState("")
  const [boards, setboards] = useState([])
  const [classes, setclasses] = useState(new Map())
  const [loading, setloading] = useState(false)
  const [updateSubjectObj, setupdateSubjectObj] = useState(null)
  const [mode, setmode] = useState("submit")
  const [updateSubjectID, setupdateSubjectID] = useState("")
  const [allClasses, setallClasses] = useState(["tets"])
  let { id } = useParams();
  const subjectService = new SubjectService();
  function loadSubjects() {
    subjectService.getAllSubjects().then((subs) => {
      setsubjects(subs);
    })
  }

  useEffect(() => {
    let loggedIn = localStorage.getItem("loggedIn")
    if (JSON.parse(loggedIn)) {
      loadSubjects()
      loadClassesAndBoards()
    }
    else {
      window.location.href = '/'
    }
  }, [])

  const readFilePath = event => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setsubjectThumbnailURl(reader.result)
      }
    }
    if (event.target.files[0].size > 250000) {
      alert("Image is too big! Must be less Than 250kb");
      setsubjectThumbnailURl()
    }
    else {
      setimageFile(event.target.files[0])
      reader.readAsDataURL(event.target.files[0])
    }

  }

  async function loadClassesAndBoards() {
    var boardService = new BoardService();
    var classService = new ClassService();
    var temp_boards = await boardService.getAllBoards();
    var temp_mapping = new Map()
    var allClass = []
    for (let index = 0; index < temp_boards.length; index++) {
      const board = temp_boards[index];
      console.log("board")
      console.log(board.boardID)
      var tempC_Claases = await classService.getClassByBoardID(board.boardID)
      allClass = allClass.concat(tempC_Claases)
      temp_mapping.set(board.boardID, tempC_Claases)

    }
    // console.log(temp_boards)
    setallClasses(allClass)
    setboards(temp_boards)
    setclasses(temp_mapping)
  }

  async function addSubject(e) {
    setloading(true)
    e.preventDefault()
    //Create ID
    var subjectID = subjectName.toLowerCase().replace(/ /g, "_").trim() + "_" + classID + "_" + classboardID.toLocaleLowerCase().replace(/ /g, "_")
    //console.log("Sub ID: "+subjectID)
    //Create Search tags
    var searchTags = [...new Set(subjectName.toLowerCase().split(" ").concat(subjectSummary.toLocaleLowerCase().split(" ")))]
    //console.log("Subject Tags: ")
    //console.log(searchTags)
    //Add Seraach tags to db
    var classService = new ClassService()
    await classService.addSearchTags(classID, searchTags)
    await classService.addSubjectID(classID, subjectID)
    //Upload Thumbnail
    var unsService = new UnskoolerHelperService()
    var responseObj = await unsService.uploadFile(imageFile)
    if (responseObj.success) {
      //Create Subject class
      var SubjectObj = {
        "chapterIDs": [],
        "classID": classID,
        "name": subjectName,
        "subjectID": subjectID,
        "summary": subjectSummary,
        "thumbnailURL": responseObj.object
      }
      //Upload Subject
      subjectService.addNewSumbject(Convert.toSubject(JSON.stringify(SubjectObj))).then(() => {

        loadSubjects()
        setloading(false)
        setmodal(false)
        setsubjectName("")
        setsubjectSummary("")
        setsubjectThumbnailURl("")
        setclassID("")
        setimageFile(null)
        setboardID("CBSE")
      })
    }
    else {
      setloading(false)
      alert(responseObj.message)
    }
  }

  async function updateSubject(e) {
    e.preventDefault()
    setloading(true)
    var subjectObj = {
      "boardID": classboardID,
      "name": subjectName,
      "summary": subjectSummary,
      // "price": Number.parseFloat(classPrice)
    }
    console.table(subjectObj)
    subjectService.updateSubject(updateSubjectID, subjectObj).then((res) => {
      if (res.success) {

        loadSubjects()
        setloading(false)
        setmodal(false)
        setsubjectName("")
        setsubjectSummary("")
        setsubjectThumbnailURl("")
        setclassID("")
        setimageFile(null)
        setboardID("CBSE")

      }
    })

  }

  function submitForm(e) {
    if (mode == "submit") {
      console.log("Submitting")
      addSubject(e)
    }
    else {
      console.log("Updating")
      updateSubject(e)
    }
  }

  return (
    <>
      <div className="notForMobile">
        <h1 className="warning">This site is not compatible with mobile devices please open in Desktop mode</h1>
      </div>
      <div className="pageHeadingDiv">
        <h2 className="coursesChild">Courses {">"} Class {">"}&nbsp;<span className="coursePath">Subject</span></h2>
        <div>
          <Modal size="lg" isOpen={modal} toggle={() => setmodal(!modal)}>
            <ModalHeader toggle={() => setmodal(!modal)}>
              Add Subject
            </ModalHeader>
            <ModalBody>
              <form onSubmit={submitForm}>
                <Row>
                  <div>
                    <label htmlFor="name">Subject name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter name"
                      required
                      defaultValue={subjectName}
                      onChange={(e) => { setsubjectName(e.target.value) }}
                    ></input>
                  </div>

                  <div>
                    <label htmlFor="name">Summary</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Summary"
                      required
                      defaultValue={subjectSummary}
                      onChange={(e) => { setsubjectSummary(e.target.value) }}
                    ></input>
                  </div>

                  {mode == "submit" ? <div>
                    <label htmlFor="name">Thumbnail Image</label>
                    <input
                      type="File"
                      className="form-control"
                      placeholder="Enter URL"
                      required
                      accept="image/png, image/jpeg"
                      defaultValue={imageFile}
                      onChange={readFilePath}
                    ></input>
                  </div> : <br />}
                  {mode == "submit" ? <div>
                    <label htmlFor="boards">Select Board</label>
                    <select
                      type="select"
                      className="form-control"
                      required
                      placeholder="Enter name"
                      defaultValue={classboardID}
                      onChange={(e) => { setboardID(e.target.value) }}
                    >
                      <option>Select Board</option>
                      {boards.map((br) => { return <option value={br.boardID} >{br.name}({br.classIDs ? br.classIDs.length : 0} Courses)</option> })}
                    </select>
                  </div> : <br />}<br />
                  <div>
                    <label htmlFor="boards">Select Class</label>
                    <select
                      type="select"
                      className="form-control"
                      required
                      placeholder="Enter name"
                      defaultValue={classID}
                      onChange={(e) => { setclassID(e.target.value) }}
                    >
                      <option>Select Class</option>
                      {classes.size > 0 ? classes.get(classboardID).map((br) => { return <option value={br.classID} >{br.name}({br.subjectIDs.length} Courses)</option> }) : ""}
                    </select>
                  </div><br />
                </Row><br /><br />
                <button className={loading ? "addInstructor-loading" : "addInstructor"} type="submit">{loading ? <i class='bx bx-loader bx-spin'></i> : mode == "submit" ? "Sumbit" : "Update"}</button>
              </form>
            </ModalBody>
          </Modal>
          <button className="addInstructor" onClick={() => { setmode("submit"); setmodal(true) }}>
            Add Subject
          </button>
        </div>
      </div>

      <div className="subjectColumn">
        {subjects.filter((val) => { console.log("id"); console.log(id); return id == "all" ? true : val.classID === id }).map((sub) => {
          return <div className="item">
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
              <div className="chapterNameMargin">
                <h5>{sub.name}</h5>
              </div>
              <i class='bx bxs-edit' onClick={async () => {
                setmode("update");
                setsubjectName(sub.name)
                setsubjectSummary(sub.summary)
                setclassID(sub.classID)
                setboardID(allClasses.filter((e) => (e.classID == sub.classID))[0].boardID)
                setupdateSubjectObj(sub)
                setmodal(true);
                setupdateSubjectID(sub.subjectID)
              }} style={{ cursor: "pointer" }}></i>
            </div>
            <div className="chapterNameMargin" style={{ marginBottom: '0px', fontSize: "0.5rem" }}>
              <h6>{sub.summary}</h6>
            </div>
            <Link to={"/chapter/" + sub.subjectID}>
              <div className="chapterNameMargin" style={{ marginBottom: '0px' }}>
                <h7>{sub.chapterIDs.length} Chapters</h7>
              </div>
              <div className="subjectbgImg1" style={{ backgroundImage: "url(" + sub.thumbnailURL + ")" }}></div>
            </Link>
          </div>
        })}

      </div>
    </>
  )
}

export default Subject
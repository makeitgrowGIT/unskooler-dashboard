import { async } from "@firebase/util";
import React, { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { Convert } from "../models/Chapter";
import { BoardService } from "../services/BoardService";
import { ChapterService } from "../services/ChapterService";
import { ClassService } from "../services/ClassService";
import { InstructorService } from "../services/InstructorService";
import { SubjectService } from "../services/SubjectService";
import { UnskoolerHelperService } from "../services/UnskoolerHelperService";
import {Link,useParams } from 'react-router-dom'

const Chapter = () => {
  const [modal, setmodal] = useState(false);
  const [chapters, setchapters] = useState([]);
  const [instuctor, setinstuctor] = useState([]);
  const [instuctorID, setinstuctorID] = useState("");
  const [boards, setboards] = useState([]);
  const [boardID, setboardID] = useState("CBSE");
  const [classes, setclasses] = useState([]);
  const [classID, setclassID] = useState("");
  const [subjects, setsubjects] = useState([])
  const [subjectID, setsubjecID] = useState("")
  const [classPicPath, setclassPicPath] = useState("")
  const [imageFile, setimageFile] = useState(null)
  const [chapterName, setchapterName] = useState("")
  const [chapterSummary, setchapterSummary] = useState("")
  const [index, setindex] = useState(0)
  const [loading, setloading] = useState(false)
  const [deleteObj, setdeleteObj] = useState(null)
  const [deleteModal, setdeleteModal] = useState(false)
  let {id} = useParams()

  const instuctorService = new InstructorService()
  const chapterService = new ChapterService()
  const classService = new ClassService()
  const boardService = new BoardService()
  const subjectService = new SubjectService()
  const role = localStorage.getItem("role")

  function initialLoad() {
    instuctorService.getAllInstocors().then((ins) => {
      setinstuctor(ins)
    })
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
  }

  useEffect(() => {
    initialLoad()
  }, [])

  async function addChapter(e) {
    e.preventDefault()
    setloading(true)
    //Generate id
    let chapter_id = chapterName.replace(/ /g, "_").trim().toLocaleLowerCase() + "_" + subjectID + "_" + classID + "_" + boardID.toLocaleLowerCase().replace(/ /g, "_")
    //add chpaterID to subject
    subjectService.addCphaterID(subjectID,chapter_id)
    //add create search tags
    var searchTags = [...new Set(chapterName.toLowerCase().split(" ").concat(chapterSummary.toLocaleLowerCase().split(" ")))]
    //add seuech tags
    classService.addSearchTags(classID, searchTags)
    //upload image 
    var unsService = new UnskoolerHelperService()
    var responseObj = await unsService.uploadFile(imageFile,chapter_id)
    if (responseObj.success) {
      //create obj
      let chapter = {
        "chapterID": chapter_id,
        "index": Number.parseInt(index),
        "instructorID": instuctorID,
        "moduleIDs": [],
        "name": chapterName,
        "subjectID": subjectID,
        "summary": chapterSummary,
        "thumbnailURL": responseObj.object
      }
      //upload chapter
      chapterService.addNewChapter(Convert.toChapter(JSON.stringify(chapter))).then(() => {

        initialLoad()
        setloading(false)
        setmodal(false)
      })
    } else {
      alert(responseObj.message)
    }
  }


  const readFilePath = event => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setclassPicPath(reader.result)
      }
    }
    if (event.target.files[0].size > 5000000) {
      alert("Image is too big! Must be less Than 250kb");
      setclassPicPath()
    }
    else {
      setimageFile(event.target.files[0])
      reader.readAsDataURL(event.target.files[0])
    }

  }
  return (
    <>
    <div className="notForMobile">
      <h1 className="warning">This site is not compatible with mobile devices please open in Desktop mode</h1>
    </div>
      <div className="pageHeadingDiv">
        <h2 className="coursesChild">Courses {">"} Class {">"} Subject {">"}&nbsp;<span className="coursePath">Chapter</span></h2>
        <div>
          <Modal size="lg" isOpen={modal} toggle={() => setmodal(!modal)}>
            <ModalHeader toggle={() => setmodal(!modal)}>
              Add Chapter
            </ModalHeader>
            <ModalBody>
              <form onSubmit={addChapter}>
                <Row>
                  <div>
                    <label htmlFor="name">Chapter name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter name"
                      required
                      onChange={(e) => { setchapterName(e.target.value) }}
                    ></input>
                  </div>

                  <div>
                    <label htmlFor="name">Chapter Summary</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Chapter Summary"
                      required
                      onChange={(e) => { setchapterSummary(e.target.value) }}
                    ></input>
                  </div>
                  <div>
                    <label htmlFor="name">Index</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Index of Chapter"
                      required
                      onChange={(e) => { setindex(e.target.value) }}
                    ></input>
                  </div>

                  <div>
                    <label htmlFor="name">Instuctors</label>
                    <select
                      type="text"
                      className="form-control"
                      placeholder="Enter Chapter Summary"
                      required
                      onChange={(e) => { setinstuctorID(e.target.value) }}
                    >
                      <option>Select Instuctor</option>
                      {instuctor.map((_ins) => { return <option value={_ins.insructorID}>{_ins.firstName} {_ins.lastName}</option> })}
                    </select>
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
                    <label htmlFor="name">Chapter Thumbnail</label>
                    <input
                      type="file"
                      className="form-control"
                      placeholder="Enter name"
                      accept="image/png, image/jpeg"
                      required
                      onChange={(e) => { readFilePath(e) }}
                    ></input>
                  </div>
                </Row>
                <button className={loading ? "addInstructor-loading" : "addInstructor"} type="submit">{loading ? <i class='bx bx-loader bx-spin'></i> : "Sumbit"}</button>
              </form>
            </ModalBody>
          </Modal>
          
          <Modal isOpen={deleteModal} toggle={() => setdeleteModal(!deleteModal)}>
            <ModalHeader toggle={() => setdeleteModal(false)}>
              Delete Chapter
            </ModalHeader>
            <ModalBody>
              Are you sure you want to delete {deleteObj?deleteObj.name:""}?<br></br>
              <Button onClick={() => {
                setloading(true)
                if (deleteObj && role=="admin") {
                  subjectService.deleteChapterID(deleteObj.subjectID, deleteObj.chapterID).then((res) => {

                    chapterService.deleteChapter(deleteObj.chapterID).then((res) => {
                      setloading(false)
                      setdeleteModal(false)
                      initialLoad()
                    })
                  })
                }
                else{
                  alert("You are not authorized to perform this operation")
                }
              }}>Yes</Button> <Button onClick={() => { setdeleteModal(false) }}>No</Button>
            </ModalBody>
          </Modal>
          <button className="addInstructor" onClick={() => setmodal(true)}>
            Add Chapter
          </button>
        </div>
      </div>

      <div className="subjectColumn">
        {chapters.filter((val) => { return id == "all" ? true : val.subjectID === id }).sort((s1,s2)=>{return s1.index-s2.index}).map((ch) => {
          return <div className="item">
            <div className="chapterNameMargin">
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
              <h5 >{ch.name}</h5>
              <i class='bx bxs-trash' onClick={async () => {
                  setdeleteModal(true);
                  setdeleteObj(ch)
                }} style={{ cursor: "pointer" }}></i>
              </div>
              <h6 >{ch.summary}</h6>
              <h7 >{ch.moduleIDs.length} Modules</h7>
            </div>
            <Link to={"/module/"+ch.chapterID}>
            <div className="subjectbgImg1" style={{ backgroundImage: "url(" + ch.thumbnailURL + ")" }}></div>
            </Link>
          </div>
        })}

      </div>
    </>
  )
}

export default Chapter
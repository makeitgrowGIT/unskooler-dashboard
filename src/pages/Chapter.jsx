import { async } from "@firebase/util";
import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { Convert } from "../models/Chapter";
import { BoardService } from "../services/BoardService";
import { ChapterService } from "../services/ChapterService";
import { ClassService } from "../services/ClassService";
import { InstructorService } from "../services/InstructorService";
import { SubjectService } from "../services/SubjectService";
import { UnskoolerHelperService } from "../services/UnskoolerHelperService";

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

  const instuctorService = new InstructorService()
  const chapterService = new ChapterService()
  const classService = new ClassService()
  const boardService = new BoardService()
  const subjectService = new SubjectService()

  function initialLoad(){
    instuctorService.getAllInstocors().then((ins)=>{
      setinstuctor(ins)
    })
    chapterService.getAllChapters().then((chs)=>{
      setchapters(chs);
    })
    boardService.getAllBoards().then((ins)=>{
      setboards(ins)
    })
    classService.getAllClasese().then((chs)=>{
      setclasses(chs);
    })
    subjectService.getAllSubjects().then((chs)=>{
      setsubjects(chs);
    })
  }

  useEffect(() => {
    initialLoad()
  }, [])
  
  async function addChapter(e){
    e.preventDefault()
    setloading(true)
    //Generate id
    let chapter_id = chapterName.replace(/ /g,"_").trim().toLocaleLowerCase()+"_"+subjectID+"_"+classID+"_"+boardID
    //add chpaterID to subject
    subjectService.addCphaterID(chapter_id)
    //add create search tags
    var searchTags = [...new Set(chapterName.toLowerCase().split(" ").concat(chapterSummary.toLocaleLowerCase().split(" ")))]
    //add seuech tags
    classService.addSearchTags(classID,searchTags)
    //upload image 
    var unsService = new UnskoolerHelperService()
    var responseObj = await unsService.uploadFile(imageFile)
    if (responseObj.success) {
      //create obj
      let chapter = {
        "chapterID":chapter_id,
        "index":Number.parseInt(index),
        "instructorID":instuctorID,
        "moduleIDs": [],
        "name":chapterName,
        "subjectID":subjectID,
        "summary":chapterSummary,
        "thumbnailURL":responseObj.object
      }
      //upload chapter
      chapterService.addNewChapter(Convert.toChapter(JSON.stringify(chapter))).then(()=>{
        setloading(false)
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
    if (event.target.files[0].size > 250000) {
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
                    onChange={(e)=>{setchapterName(e.target.value)}}
                  ></input>
                </div>

                <div>
                  <label htmlFor="name">Chapter Summary</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Chapter Summary"
                    required
                    onChange={(e)=>{setchapterSummary(e.target.value)}}
                  ></input>
                </div>
                <div>
                  <label htmlFor="name">Index</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Index of Chapter"
                    required
                    onChange={(e)=>{setindex(e.target.value)}}
                  ></input>
                </div>

                <div>
                  <label htmlFor="name">Instuctors</label>
                  <select
                    type="text"
                    className="form-control"
                    placeholder="Enter Chapter Summary"
                    required
                    onChange={(e)=>{setinstuctorID(e.target.value)}}
                  >
                    {instuctor.map((_ins)=>{return <option value={_ins.insructorID}>{_ins.firstName} {_ins.lastName}</option>})}
                  </select>
                </div>

                <div>
                  <label htmlFor="name">Board</label>
                  <select
                    type="text"
                    className="form-control"
                    placeholder="Enter Chapter Summary"
                    onChange={(e)=>{setboardID(e.target.value)}}
                  >
                    {boards.map((_ins)=>{return <option value={_ins.boardID}>{_ins.name}</option>})}
                  </select>
                </div>

                <div>
                  <label htmlFor="name">Class</label>
                  <select
                    type="text"
                    className="form-control"
                    placeholder="Enter Chapter Summary"
                    onChange={(e)=>{setclassID(e.target.value)}}
                  >
                    {classes.filter((curVal,val,index)=>{return curVal.boardID === boardID}).map((_ins)=>{return <option value={_ins.classID}>{_ins.name}</option>})}
                  </select>
                </div>

                <div>
                  <label htmlFor="name">Subject</label>
                  <select
                    type="text"
                    className="form-control"
                    placeholder="Enter Chapter Summary"
                    required
                    onChange={(e)=>{setsubjecID(e.target.value)}}
                  >
                    {subjects.filter((curVal,val,index)=>{console.log(curVal); return curVal.classID === classID}).map((_ins)=>{return <option value={_ins.subjectID}>{_ins.name}</option>})}
                  </select>
                </div>

                <div>
                  <label htmlFor="name">Chapter Thumbnail</label>
                  <input
                    type="file"
                    className="form-control"
                    placeholder="Enter name"
                    required
                    onChange={(e)=>{readFilePath(e)}}
                  ></input>
                </div>
              </Row>
            <button className={loading?"addInstructor-loading":"addInstructor"}type="submit">{loading?<i class='bx bx-loader bx-spin'></i>:"Sumbit"}</button>
            </form>
          </ModalBody>
        </Modal>
        <button className="addInstructor" onClick={() => setmodal(true)}>
          Add Chapter
        </button>
      </div>
    </div>

    <div className="subjectColumn">
      {chapters.map((ch)=>{
             return <div className="item">
                  <div className="chapterNameMargin">
                    <h7 className="chaptername">{ch.name}</h7><br/>
                    <h7 className="chaptername">{ch.moduleIDs.length} Modules</h7>
                  </div>
                  <div className="subjectbgImg1" style={{ backgroundImage: "url(" + ch.thumbnailURL + ")" }}></div>
              </div>
      })}
              
      </div>
  </>
  )
}

export default Chapter
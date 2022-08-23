import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { Convert } from "../models/Class";
import "../pages/class.css";
import { BoardService } from "../services/BoardService";
import { ClassService } from "../services/ClassService";
import { UnskoolerHelperService } from "../services/UnskoolerHelperService";

const Class = () => {
  const [modal, setmodal] = useState(false);
  const classService = new ClassService();
  const boardService = new BoardService();
  const [icseClasses, seticseClasses] = useState([]);
  const [cbseClasses, setcbseClasses] = useState([]);
  const [className, setclassName] = useState("");
  const [classPicPath, setclassPicPath] = useState("");
  const [imageFile, setimageFile] = useState(null)
  const [classPrice, setclassPrice] = useState(0)
  const [boardID, setboardID] = useState("CBSE");
  const [boards, setboards] = useState([]);
  const [loading, setloading] = useState(false)

  function loadICSEClasses() {
    classService.getClassByBoardID("ICSE").then((docs) => {
      seticseClasses(docs);
    });
  }

  function loadCBSEClasses() {
    classService.getClassByBoardID("CBSE").then((docs) => {
      setcbseClasses(docs);
    });
  }
  function loadBoards() {
    boardService.getAllBoards().then((brds) => {
      setboards(brds)
    })
  }
  async function addClass(e) {
    e.preventDefault()
    setloading(true)
    //Generate Class ID
    var class_id = className.replace(" ","_").toLocaleLowerCase() + "_" + boardID.toString().toLocaleLowerCase()
    boardService.appendClassIDToBoard(boardID,class_id)
    //Get Firebase URL: 
    var unsService = new UnskoolerHelperService()
    console.log("FileName")
    console.log(imageFile.name)
    var responseObj = await unsService.uploadFile(imageFile)
    console.log("responseObj")
    console.log(responseObj)
    if (responseObj.success) {
      //create search tags:
      var searchTags = className.toLocaleLowerCase().split(" ")
      searchTags.push(class_id)
      searchTags.push(boardID.toLocaleLowerCase())
      //Creaet Class object
      var classObj = {
        "classID": class_id,
        "boardID": boardID,
        "creationDate": new Date(),
        "name": className,
        "price": Number.parseFloat(classPrice),
        "rating": 5,
        "subjectIDs": [],
        "searchTags":searchTags,
        "thumbnailUrl":responseObj.object
    }
      //Add Class
      classService.addNewClass(Convert.toClass(JSON.stringify(classObj))).then(()=>{
        setloading(false)
        setmodal(false)
      })
    } else {
      alert(responseObj.message)
    }

  }

  useEffect(() => {
    loadICSEClasses()
    loadBoards()
    loadCBSEClasses()
  }, [])


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
        <h2 className="coursesChild">Courses {">"} <span className="coursePath">Class</span></h2>
        <div>
          <Modal size="lg" isOpen={modal} toggle={() => setmodal(!modal)}>
            <ModalHeader toggle={() => setmodal(!modal)}>
              Add Classes
            </ModalHeader>
            <ModalBody>
              <form onSubmit={addClass}>
                <Row>
                  <div>
                    <label htmlFor="name">Class name</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="Enter name"
                      onChange={(e) => { setclassName(e.target.value) }}
                    ></input>
                  </div><br />
                  <div>
                    <label htmlFor="name">Price</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter price"
                      required
                      onChange={(e) => { setclassPrice(e.target.value) }}
                    ></input>
                  </div><br />
                  <div>
                    <label htmlFor="boards">Board</label>
                    <select
                      type="select"
                      className="form-control"
                      placeholder="Enter name"
                      required
                      onChange={(e) => { setboardID(e.target.value) }}
                    >
                      {boards.map((br) => { return <option value={br.boardID} >{br.name}({br.classIDs.length} Courses)</option> })}
                    </select>
                  </div><br />
                  <div>
                    <label htmlFor="name">Thumbnail Image</label>
                    <input
                      type="File"
                      className="form-control"
                      placeholder="Enter URL"
                      required
                      onChange={readFilePath}
                    ></input>
                  </div><br />
                </Row><br />
                <button className={loading?"addInstructor-loading":"addInstructor"} type="submit" >{loading?<i class='bx bx-loader bx-spin'></i>:"Sumbit"}</button>
              </form>
            </ModalBody>
          </Modal>
          <button className="addInstructor" onClick={() => setmodal(true)}>
            Add Class
          </button>
        </div>
      </div>

      <div className="cbseSection">
        <h2 className="cbse">CBSE</h2>
        <div className="wrapper">
          {cbseClasses.map(cl => { return <div className="item">{cl.name}</div> })}
        </div>
      </div>

      <div className="cbseSection , icseSection">
        <h2 className="cbse">ICSE</h2>
        <div className="wrapper">
          {icseClasses.map(cl => { return <div className="item">{cl.name}</div> })}
        </div>
      </div>
    </>
  );
};

export default Class;

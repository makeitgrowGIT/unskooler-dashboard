import React, { useEffect, useState } from "react";
import Rating from "react-rating";
import { Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { Convert } from "../models/Class";
import "../pages/class.css";
import { BoardService } from "../services/BoardService";
import { ClassService } from "../services/ClassService";
import { FeaturedService } from "../services/FeaturedService";
import { UnskoolerHelperService } from "../services/UnskoolerHelperService";

const Class = () => {
  const [modal, setmodal] = useState(false);
  const classService = new ClassService();
  const boardService = new BoardService();
  const featuredService = new FeaturedService();
  const [icseClasses, seticseClasses] = useState([]);
  const [cbseClasses, setcbseClasses] = useState([]);
  const [freeClasses, setfreeClasses] = useState([]);
  const [className, setclassName] = useState("");
  const [classPicPath, setclassPicPath] = useState("");
  const [imageFile, setimageFile] = useState(null)
  const [classPrice, setclassPrice] = useState(0)
  const [boardID, setboardID] = useState("CBSE");
  const [boards, setboards] = useState([]);
  const [loading, setloading] = useState(false)
  const [mode, setmode] = useState("submit")
  const [updateClassObj, setupdateClassObj] = useState(null)

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
  function loadfreeClasses() {
    classService.getClassByBoardID("Study Material").then((docs) => {
      setfreeClasses(docs);
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
    var class_id = className.replace(/ /g, "_").toLocaleLowerCase() + "_" + boardID.toString().toLocaleLowerCase().replace(/ /g, "_")
    boardService.appendClassIDToBoard(boardID, class_id)
    //Get Firebase URL: 
    var unsService = new UnskoolerHelperService()
    //console.log("FileName")
    //console.log(imageFile.name)
    var responseObj = await unsService.uploadFile(imageFile)
    //console.log("responseObj")
    //console.log(responseObj)
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
        "searchTags": searchTags,
        "isFeatured ": false,
        "thumbnailUrl": responseObj.object
      }
      //Add Class
      classService.addNewClass(Convert.toClass(JSON.stringify(classObj))).then(() => {
        loadICSEClasses()
        loadBoards()
        loadCBSEClasses()
        loadfreeClasses()
        setloading(false)
        setmodal(false)
        setboardID("CBSE")
        setclassPrice(0)
        setimageFile(null)
        setupdateClassObj(null)
        setclassName("")
        
      })
    } else {
      alert(responseObj.message)
    }

  }

  async function updateClass(e) {
    e.preventDefault()
    setloading(true)
    var classObj = {
      "boardID": boardID,
      "name": className,
      "price": Number.parseFloat(classPrice)
    }
    classService.updateClass(updateClassObj.classID, classObj).then((res) => {
      if (res.success) {

        loadICSEClasses()
        loadBoards()
        loadCBSEClasses()
        loadfreeClasses()
        setloading(false)
        setmodal(false)

      }
    })
  }

  function submitForm(e) {
    if (mode == "submit") {
      console.log("Submitting")
      addClass(e)
    }
    else {
      console.log("Updating")
      updateClass(e)
    }
  }
  useEffect(() => {
    let loggedIn = localStorage.getItem("loggedIn")
    if (JSON.parse(loggedIn)) {
      loadICSEClasses()
      loadBoards()
      loadCBSEClasses()
      loadfreeClasses()
    }
    else {
      window.location.href = '/'
    }
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
  function updateFeatured(classID, value) {
    console.log(value)
    if (value) {
      //If Value Tru
      //Update class with feature false
      classService.updateClass(classID, { featured: true }).then(() => {
        //Add new Featured
        featuredService.addClassToFeature(classID)
      })
      //else
    } else {
      //Update class with feature true
      classService.updateClass(classID, { featured: false }).then(() => {
        //Add new Featured
        featuredService.removeClassToFeature(classID)
      })
      //remove Featured
    }


  }
  return (
    <div className="mainBG">
    <div className="notForMobile">
      <h1 className="warning">This site is not compatible with mobile devices please open in Desktop mode</h1>
    </div>
      <div className="pageHeadingDiv">
        <h2 className="coursesChild">Courses {">"} <span className="coursePath">Class</span></h2>
        <div>
          <Modal size="lg" isOpen={modal} toggle={() => setmodal(!modal)}>
            <ModalHeader toggle={() => setmodal(!modal)}>
              Add Classes
            </ModalHeader>
            <ModalBody>
              <form onSubmit={submitForm}>
                <Row>
                  <div>
                    <label htmlFor="name">Class name</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      placeholder="Enter name"
                      defaultValue={className}
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
                      defaultValue={classPrice}
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
                      defaultValue={boardID}
                      onChange={(e) => { setboardID(e.target.value) }}
                    >
                      <option>Select Board</option>
                      {boards.map((br) => { return <option value={br.boardID} >{br.name}</option> })}
                    </select>
                  </div><br />
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
                </Row><br />
                <button className={loading ? "addInstructor-loading" : "addInstructor"} type="submit" >{loading ? <i class='bx bx-loader bx-spin'></i> : mode == "submit" ? "Sumbit" : "Update"}</button>
              </form>
            </ModalBody>
          </Modal>
          <button className="addInstructor" onClick={() => { setmode("submit"); setmodal(true) }}>
            Add Class
          </button>
        </div>
      </div>

      <div className="cbseSection">
        <h2 className="cbse">CBSE</h2>
        <div className="wrapper">
          {cbseClasses.map(cl => {
            return <div className="item">
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                <div className="chapterNameMargin">
                  <h7>{cl.boardID}</h7>
                </div>
                <i class='bx bxs-edit' onClick={async () => {
                  setmode("update");
                  setclassName(cl.name)
                  setclassPrice(cl.price)
                  setboardID(cl.boardID)
                  setupdateClassObj(cl)
                  setmodal(true);
                }} style={{ cursor: "pointer" }}></i>
              </div>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                <div className="chapterNameMargin">
                  <h5>{cl.name}</h5>
                </div>
                <div className="chapterNameMargin">
                  <div class="form-check form-switch">
                    <input class="form-check-input" defaultChecked={cl.featured} onChange={(e) => { updateFeatured(cl.classID, e.target.checked) }} type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                  </div>
                </div>
              </div>
              <div className="subjectbgImg1" style={{ backgroundImage: "url(" + cl.thumbnailUrl + ")" }}></div>
              <br />
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                <div className="chapterNameMargin">
                  ₹{cl.price}
                </div>
                <div className="chapterNameMargin">
                  <Rating initialRating={cl.rating}
                    readonly
                    emptySymbol="bx bx-star"
                    fullSymbol="bx bxs-star"
                    fractions={2}

                  />
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
      <br />
      <br />

      <div className="cbseSection">
        <h2 className="cbse">ICSE</h2>
        <div className="wrapper">
          {icseClasses.map(cl => {
            return <div className="item">
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                <div className="chapterNameMargin">
                  <h7>{cl.boardID}</h7>
                </div>
                <i class='bx bxs-edit' onClick={async () => {
                  setmode("update");
                  setclassName(cl.name)
                  setclassPrice(cl.price)
                  setboardID(cl.boardID)
                  setupdateClassObj(cl)
                  setmodal(true);
                }} style={{ cursor: "pointer" }}></i>
              </div>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                <div className="chapterNameMargin">
                  <h5>{cl.name}</h5>
                </div>
                <div className="chapterNameMargin">
                  <div class="form-check form-switch">
                    <input class="form-check-input" defaultChecked={cl.featured} onChange={(e) => { updateFeatured(cl.classID, e.target.checked) }} type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                  </div>
                </div>
              </div>
              <div className="subjectbgImg1" style={{ backgroundImage: "url(" + cl.thumbnailUrl + ")" }}></div>
              <br />
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                <div className="chapterNameMargin">
                  ₹{cl.price}
                </div>
                <div className="chapterNameMargin">
                  <Rating initialRating={cl.rating}
                    readonly
                    emptySymbol="bx bx-star"
                    fullSymbol="bx bxs-star"
                    fractions={2}
                  />
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
      <br />
      <br />

      <div className="cbseSection">
        <h2 className="cbse">Free Material</h2>
        <div className="wrapper">
          {freeClasses.map(cl => {
            return <div className="item">
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                <div className="chapterNameMargin">
                  <h7>{cl.boardID}</h7>
                </div>
                <i class='bx bxs-edit' onClick={async () => {
                  setmode("update");
                  setclassName(cl.name)
                  setclassPrice(cl.price)
                  setboardID(cl.boardID)
                  setupdateClassObj(cl)
                  setmodal(true);
                }} style={{ cursor: "pointer" }}></i>
              </div>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                <div className="chapterNameMargin">
                  <h5>{cl.name}</h5>
                </div>
                <div className="chapterNameMargin">
                  <div class="form-check form-switch">
                    <input class="form-check-input" defaultChecked={cl.featured} onChange={(e) => { updateFeatured(cl.classID, e.target.checked) }} type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                  </div>
                </div>
              </div>
              <div className="subjectbgImg1" style={{ backgroundImage: "url(" + cl.thumbnailUrl + ")" }}></div>
              <br />
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
                <div className="chapterNameMargin">
                  ₹{cl.price}
                </div>
                <div className="chapterNameMargin">
                  <Rating initialRating={cl.rating}
                    readonly
                    emptySymbol="bx bx-star"
                    fullSymbol="bx bxs-star"
                    fractions={2}

                  />
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
      <br />
      <br />

    </div>
  );
};

export default Class;

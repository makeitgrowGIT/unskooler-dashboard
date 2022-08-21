import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { ChapterService } from "../services/ChapterService";

const Chapter = () => {
  const [modal, setmodal] = useState(false);
  const [chapters, setchapters] = useState([]);
  const chapterService = new ChapterService()
  function loadChapter(){
    chapterService.getAllChapters().then((chs)=>{
      setchapters(chs);
    })
  }

  useEffect(() => {
    loadChapter()
  }, [])
  

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
            <form>
              <Row>
                <div>
                  <label htmlFor="name">Chapter name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                  ></input>
                </div>

                <div>
                  <label htmlFor="name">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                  ></input>
                </div>

                <div>
                  <label htmlFor="name">Email Address</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                  ></input>
                </div>
              </Row>
            </form>
            <button className="addInstructor">Submit</button>
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
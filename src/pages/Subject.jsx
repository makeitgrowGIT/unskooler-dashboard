import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import '../pages/subject.css'
import { SubjectService } from "../services/SubjectService";

const Subject = () => {
  const [modal, setmodal] = useState(false);
  const [subjects, setsubjects] = useState([]);
  const subjectService = new SubjectService();
  function loadSubjects() {
    subjectService.getAllSubjects().then((subs) => {
      setsubjects(subs);
    })
  }

  useEffect(() => {
    loadSubjects()
  }, [])



  return (
    <>
      <div className="pageHeadingDiv">
        <h2 className="coursesChild">Courses {">"} Class {">"}&nbsp;<span className="coursePath">Subject</span></h2>
        <div>
          <Modal size="lg" isOpen={modal} toggle={() => setmodal(!modal)}>
            <ModalHeader toggle={() => setmodal(!modal)}>
              Add Subject
            </ModalHeader>
            <ModalBody>
              <form>
                <Row>
                  <div>
                    <label htmlFor="name">Subject name</label>
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
            Add Subject
          </button>
        </div>
      </div>

      <div className="subjectColumn">
        {subjects.map((sub) => {
          return <div className="item">
            <div className="chapterNameMargin">
              <h7 className="chaptername">{sub.name}</h7>
            </div>
            <div className="chapterNameMargin" style={{marginBottom:'0px', fontSize: "0.5rem" }}>
              <h7 className="chaptername">{sub.summary}</h7>
            </div>
            <div className="chapterNameMargin" style={{marginBottom:'0px'}}>
              <h7 className="chaptername">{sub.chapterIDs.length} Chapters</h7>
            </div>
            <div className="subjectbgImg1" style={{ backgroundImage: "url(" + sub.thumbnailURL + ")" }}></div>
          </div>
        })}

      </div>
    </>
  )
}

export default Subject
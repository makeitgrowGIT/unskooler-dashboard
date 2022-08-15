import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import '../pages/module.css'

const Module = () => {
  const [modal, setmodal] = useState(false);
  return (
    <>
    <div className="pageHeadingDiv">
      <h2 className="coursesChild">Courses {">"} Class {">"} Subject {">"} Chapter {">"} &nbsp;<span className="coursePath">Module</span></h2>
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
              <div className="item">
                  <div className="chapterNameMargin">
                    <h7 className="chaptername">Module Name</h7>
                  </div>
                <div className="subjectbgImg1"></div>
              </div>
              <div className="item">
              <div className="chapterNameMargin">
                    <h7 className="chaptername">Module Name</h7>
                  </div>
                <div className="subjectbgImg2"></div>
              </div>
              <div className="item">
              <div className="chapterNameMargin">
                    <h7 className="chaptername">Module Name</h7>
                  </div>
                <div className="subjectbgImg3"></div>
              </div>
              <div className="item">
                  <div className="chapterNameMargin">
                    <h7 className="chaptername">Module Name</h7>
                  </div>
                <div className="subjectbgImg4"></div>
              </div>
      </div>
  </>
  )
}

export default Module
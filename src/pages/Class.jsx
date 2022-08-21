import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import "../pages/class.css";
import { ClassService } from "../services/ClassService";

const Class = () => {
  const [modal, setmodal] = useState(false);
  const classService = new ClassService();
  const [icseClasses, seticseClasses] = useState([]);
  const [cbseClasses, setcbseClasses] = useState([]);

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

  useEffect(() => {
    loadICSEClasses()
    loadCBSEClasses()
  }, [])


  return (
    <>
      <div className="pageHeadingDiv">
        <h2 className="coursesChild">Courses {">"} <span className="coursePath">Class</span></h2>
        <div>
          <Modal size="lg" isOpen={modal} toggle={() => setmodal(!modal)}>
            <ModalHeader toggle={() => setmodal(!modal)}>
              Add Class
            </ModalHeader>
            <ModalBody>
              <form>
                <Row>
                  <div>
                    <label htmlFor="name">Class name</label>
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

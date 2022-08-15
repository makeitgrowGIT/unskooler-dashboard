import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import "../pages/class.css";

const Class = () => {
  const [modal, setmodal] = useState(false);

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
                <div className="item">Class V</div>
                <div className="item">Class VI</div>
                <div className="item">Class VII</div>
                <div className="item">Class VIII</div>
                <div className="item">Class V</div>
            </div>
      </div>

      <div className="cbseSection , icseSection">
        <h2 className="cbse">ICSE</h2>
        <div className="wrapper">
                <div className="item">Class V</div>
                <div className="item">Class VI</div>
                <div className="item">Class VII</div>
                <div className="item">Class VIII</div>
                <div className="item">Class V</div>
            </div>
      </div>
    </>
  );
};

export default Class;

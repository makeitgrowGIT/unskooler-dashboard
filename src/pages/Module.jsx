import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import '../pages/module.css'
import { ModuleService } from "../services/ModuleService";

const Module = () => {
  const [modal, setmodal] = useState(false);
  const [modules, setmodules] = useState([]);
  const moduleService = new ModuleService();

useEffect(() => {
  loadModules()
}, [])


  function loadModules(){
    moduleService.getAllModules().then((mds)=>{
      setmodules(mds)
    })
  }
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
      {modules.map((md)=>{
      return <div className="item">
                  <div className="chapterNameMargin">
                    <h7 className="chaptername">{md.name}</h7><br/>
                    <h7 className="chaptername">{md.durationInSeconds} Sec</h7>
                  </div>
                  <div className="subjectbgImg1" style={{ backgroundImage: "url(" + md.thumbnailURL + ")" }}></div>
              </div>
      })}
      </div>
  </>
  )
}

export default Module
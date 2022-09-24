import React, { useEffect, useState } from "react";
import { Modal, ModalBody, ModalHeader, Row } from "reactstrap";

import CountriesTables from "../components/instructorTableData/instructorTableContent";
import { InstructorService } from "../services/InstructorService";
import "./Users.css";
import DataTable from "react-data-table-component";
import { Convert } from "../models/Instructor";

const Instructors = () => {
  const [modal, setmodal] = useState(false);
  const [firstName, setfirstName] = useState("")
  const [lastName, setlastName] = useState("")
  const [contactNumber, setcontactNumber] = useState(0)
  const [loading, setloading] = useState(false)
  const instService = new InstructorService()
  const [instuctorList, setinstuctorList] = useState([])
  const [searchTerm, setsearchTerm] = useState("")

  async function addInstuctor(e) {
    e.preventDefault()
    setloading(true)
    //generateID
    var id = new Date().getTime().toString()
    //Create Object
    var insObj = {
      "firstName": firstName,
      "lastName": lastName,
      "contactNumber": contactNumber,
      "insructorID": id
    }

    instService.addNewInstrucor(Convert.toInstrucor(JSON.stringify(insObj))).then((res) => {

      if (res.success) {

        instService.getAllInstocors().then((ins) => { setinstuctorList(ins) })
        setloading(false)
        setmodal(false)
      } else {
        alert(res.message)
        setloading(false)

      }

    }
    )
  }

  useEffect(() => {
    let loggedIn = localStorage.getItem("loggedIn")
    if (JSON.parse(loggedIn)) {
      instService.getAllInstocors().then((ins) => { setinstuctorList(ins) })
    }
    else {
      window.location.href = '/'
    }
  }, [])


  const columns = [
    {
      name: "First Name",
      selector: (row) => row.firstName,

    },
    {
      name: "last Name",
      selector: (row) => row.lastName,
    },
    {
      name: "Contact Number",
      selector: (row) => row.contactNumber,
    }
  ];

  return (
    
    <div>
      <div className="notForMobile">
      <h1 className="warning">This site is not compatible with mobile devices please open in Desktop mode</h1>
    </div>
      <div className="pageHeadingDiv">
        <h2 className="userPageHeading">Manage Instructors</h2>
        <div>
          <Modal size="lg" isOpen={modal} toggle={() => setmodal(!modal)}>
            <ModalHeader toggle={() => setmodal(!modal)}>
              Add Instructor
            </ModalHeader>
            <ModalBody>
              <form onSubmit={addInstuctor}>
                <Row>
                  <div>
                    <label htmlFor="name">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter name"
                      onChange={(e) => { setfirstName(e.target.value) }}
                      required
                    ></input>
                  </div>

                  <div>
                    <label htmlFor="name">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter name"
                      onChange={(e) => { setlastName(e.target.value) }}
                      required
                    ></input>
                  </div>

                  <div>
                    <label htmlFor="name">Contact Number</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter Contect Number"
                      onChange={(e) => { setcontactNumber(e.target.value) }}
                      required
                    ></input>
                  </div>
                </Row>
                <button className={loading ? "addInstructor-loading" : "addInstructor"} type="submit">{loading ? <i class='bx bx-loader bx-spin'></i> : "Sumbit"}</button>
              </form>
            </ModalBody>
          </Modal>
          <button className="addInstructor" onClick={() => setmodal(true)}>
            Add Instructor
          </button>
        </div>
      </div>

      <div className="userTable">
        <DataTable
          columns={columns}
          // data={instuctorList}
          data={instuctorList.filter((item) => {
            if (searchTerm === "") {
              return item;
            } else if (
              item.firstName.toLowerCase().includes(searchTerm.toLowerCase())||item.lastName.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              return item;
            }
          })}
          paginationRowsPerPageOptions={[8, 12, 25, 50]}
          paginationPerPage={8}
          pagination
          fixedHeader
          fixedHeaderScrollHeight="300px"
          highlightOnHover
          subHeader
          subHeaderComponent={<input type="text" placeholder="Search" className="tableSearch" onChange={(e)=>{console.log(searchTerm);setsearchTerm(e.target.value)}} />}
          subHeaderAlign="left"
          selectableRows
        />
      </div>
    </div>
  );
};

export default Instructors;

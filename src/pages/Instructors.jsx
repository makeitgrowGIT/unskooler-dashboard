import React , { useState } from 'react'
import { Modal , ModalBody ,ModalHeader , Row } from "reactstrap";

import CountriesTables from "../components/instructorTableData/instructorTableContent"
import './Users.css'

const Instructors = () => {
  const [modal , setmodal] = useState(false);


  return (
    <div>
    <div className='pageHeadingDiv'>
        <h2 className="userPageHeading">
        Manage Instructors
        </h2>
        <div>
        <Modal 
        size="lg" 
        isOpen={modal} 
        toggle={() => setmodal(!modal)}>
    <ModalHeader 
      toggle={() => setmodal(!modal)}>
      Add Instructor
    </ModalHeader>
    <ModalBody>
      <form>
        <Row>
            <div>
                <label htmlFor='name'>
                    First Name 
                </label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter name'
                >
                </input>
              </div>

              <div>
                <label htmlFor='name'>
                    Last Name 
                </label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter name'
                >
                </input>
              </div>
              
              <div>
                <label htmlFor='name'>
                    Email Address 
                </label>
                <input
                  type='text'
                  className='form-control'
                  placeholder='Enter name'
                >
                </input>
              </div>
        </Row>
      </form>
      <button className='addInstructor'>Submit</button>
    </ModalBody>
    </Modal>,
        <button className='addInstructor' onClick={() => setmodal(true)}>Add Instructor</button>
        </div>
        </div>
       
      <div className='userTable'>
        <CountriesTables/>
      </div>

    </div>
)
}

export default Instructors
import React, { useEffect, useState } from 'react'
import CountriesTables from "../components/UserTableContent"
import './Users.css'
import DataTable from "react-data-table-component";
import { UserService } from '../services/userService';

const Customers = () => {

  const [users, setusers] = useState([]);
  const userService = new UserService()
  function loadUsers() {
    userService.getAllUser().then((urs) => {
      setusers(urs)
    })
  }

  useEffect(() => {
    let loggedIn = localStorage.getItem("loggedIn")
    if (JSON.parse(loggedIn)) {
      loadUsers()
    }
    else {
      window.location.href = '/'
    }
  }, [])

  const columns = [
    // {
    //     name: "Profile Pic",
    //     cell: row => <div src={row.profilePicUrl} width="5vw" height="5vw" style={{backgroundImage:'url('+row.profilePicUrl+')', backgroundColor:"red"}}>a</div>
    // },
    {
      name: "First Name",
      selector: (row) => row.firstname,

    },
    {
      name: "Last Name",
      selector: (row) => row.lastname,
    },
    {
      name: "last Seen",
      selector: (row) => row.lastSeen,
    },
    {
      name: "Joining Date",
      selector: (row) => row.joiningDate,

    },
    {
      name: "Email",
      selector: (row) => row.email,

    },
  ];

  return (
    
    <div>
    <div className="notForMobile">
      <h1 className="warning">This site is not compatible with mobile devices please open in Desktop mode</h1>
    </div>
      <h2 className="userPageHeading">
        View Student Details
      </h2>
      <div className='userTable'>
        <DataTable
          columns={columns}
          data={users}
          paginationRowsPerPageOptions={[8, 12, 25, 50]}
          paginationPerPage={8}
          pagination
          fixedHeader
          fixedHeaderScrollHeight="60vh"
          selectableRows
          highlightOnHover
          subHeader
          subHeaderComponent={<input type="text" placeholder="Search" className="tableSearch" />}
          subHeaderAlign="left"
        />
      </div>

    </div>
  )
}

export default Customers
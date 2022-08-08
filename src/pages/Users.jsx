import React from 'react'
import CountriesTables from "../components/UserTableContent"
import './Users.css'

const Customers = () => {
  return (
      <div>
          <h2 className="userPageHeading">
          View Student Details
          </h2>
        <div className='userTable'>
          <CountriesTables/>
        </div>

      </div>
  )
}

export default Customers
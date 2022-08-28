import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import '../components/UserTableContent.css';

const CountriesTables = () => {
  const [countries, setCountries] = useState([]);

  const getCountries = async () => {
    try {
      const response = await axios.get("https://restcountries.com/v2/all");
      setCountries(response.data);
    } catch (error) {
      //console.log(error);
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
     
    },
    {
      name: "Phone Number",
      selector: (row) => row.nativeName,
    },
    {
      name: "last Seen",
      selector: (row) => row.capital,
    },
    {
      name: "Joining Date",
      selector: (row) => row.nativeName,
      
    },
  ];

  useEffect(() => {
    getCountries();
  }, []);

 

  return (
  <DataTable 
  columns={columns} 
  data={countries}
  paginationRowsPerPageOptions={[8, 12, 25, 50]}
  paginationPerPage = {8}
  pagination 
  fixedHeader
  fixedHeaderScrollHeight="300px"
  selectableRows 
  highlightOnHover
  subHeader
  subHeaderComponent = {<input type="text" placeholder="Search" className="tableSearch"/>} 
  subHeaderAlign = "left"
  />
  );
};

export default CountriesTables;

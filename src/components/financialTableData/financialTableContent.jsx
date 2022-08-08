import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";

const CountriesTables = () => {
  const [countries, setCountries] = useState([]);

  const getCountries = async () => {
    try {
      const response = await axios.get("https://restcountries.com/v2/all");
      setCountries(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      name: "Course Name",
      selector: (row) => row.name,
     
    },
    {
      name: "Subject",
      selector: (row) => row.nativeName,
    },
    {
      name: "class",
      selector: (row) => row.nativeName,
    },
    {
        name: "Price",
        selector: (row) => row.numericCode,
      },
      {
        name: "Sales",
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
  highlightOnHover
  subHeader
  subHeaderComponent = {<input type="text" placeholder="Search" className="tableSearch"/>} 
  subHeaderAlign = "left"
  />
  );
};

export default CountriesTables;

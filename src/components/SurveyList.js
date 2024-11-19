import axios from 'axios';
import { useHistory } from "react-router-dom"; 
import React, { useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import "./SurveyList.css"

const SurveyList = () => {
  const history = useHistory(); 
  const [surveys, setSurveys] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [industry, setIndustry] = useState([]);
  const [search, setSearch] = useState(""); // State for search input

  useEffect(async() => {
    // axios
    // .get('https://zamplia-api.onrender.com/api/surveys')
    // .then((response) => {
    //   setSurveys(response?.data?.result?.data)
    // })
    try {
      const response = await axios.get(
        'https://surveysupplysandbox.zamplia.com/api/v1/Surveys/GetAllocatedSurveys',
        {
          headers: {
            Accept: 'application/json',
            'ZAMP-KEY': 'bwiAtId0rUjSeFDB104BFp78zopVtOjs',
          },
        }
      );
      console.log("response: ", response, response?.data?.result?.data)
      setSurveys(response?.data?.result?.data)
    } 
  }, []);

  useEffect(() => {
    //Get Lanugage
    axios
    .get('https://zamplia-api.onrender.com/api/languages')
    .then((response) => {
      setLanguages(response?.data?.result?.data)
    })

    //get Industry
    axios
    .get('https://zamplia-api.onrender.com/api/industry')
    .then((response) => {
      setIndustry(response?.data?.result?.data)
    })
  }, [surveys]);

  const formatLOI = (loi) => `${loi} Min`; // Append " Min" to LOI value
  const formatDecimal = (value) => Number(value).toFixed(2); // Format to 2 decimal
  const handleRowClick = async (row) => {
    let finalData = JSON.parse(JSON.stringify(row))
    finalData.industry = filterIndustry(row.IndustryId)
    finalData.country = filterCountry(row.LanguageId)
    finalData.LOI = formatLOI(row.LOI)
    await storeData("details", finalData).then(() => {
      history.replace(`/Details/${row.SurveyId}`); 
    });
  };

  const storeData = async (key, value) => {
    const jsonValue = JSON.stringify(value);
    await sessionStorage.setItem(key, jsonValue);
  };

  const filterCountry = (id) => {
    let result = languages.filter((value) => value.LanguageId === id)
    return result[0]?.Country || ""
  }

  const filterIndustry = (id) => {
    let result = industry.filter((value) => value.Id === parseInt(id))
    return result[0]?.Name || ""
  }


  const columns = [
    {
      name: "Survey ID",
      selector: (row) => row.SurveyId,
      sortable: true,
    },
    {
      name: "Survey Name",
      selector: (row) => row.Name,
      sortable: true,
    },
    {
      name: "industry",
      selector: (row) => filterIndustry(row.IndustryId),
      sortable: true,
    },
    {
      name: "Country",
      selector: (row) => filterCountry(row.LanguageId),
      sortable: true,
    },
    {
      name: "IR",
      selector: (row) => row.IR,
      sortable: true,
    },
    {
      name: "LOI",
      selector: (row) => formatLOI(row.LOI),
      sortable: true,
    },
    {
      name: "Remaining",
      selector: (row) => row.TotalCompleteRequired,
      sortable: true,
    },
    {
      name: "Priority",
      selector: (row) => formatDecimal(row.CPI),
      sortable: true,
    },
  ];

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearch(query);

    // Filter the data based on the survey_id field
    const filtered = Object.values(surveys).filter((item) => {
      return (
        item.SurveyId &&
        item.SurveyId.toString().toLowerCase().includes(query)
      );
    });

    setFilteredData(filtered);
  };

  return (
    <div>
      {surveys && surveys?.length === 0 ? (
        <div className="loader">
          <div className="spinner"></div>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#341539",
              padding: "20px",
            }}
          >
            <input
              type="text"
              placeholder="Search by Survey ID..."
              value={search}
              onChange={handleSearch}
              style={{
                padding: "12px",
                width: "100%",
                maxWidth: "300px",
                borderRadius: "6px",
                border: "2px solid #341539",
                backgroundColor: "#E0E7FF", // Matches DataTable header background ̰
                color: "#341539", // Matches font color in theme
                fontWeight: "bold",
                outline: "none",
                textAlign: "center", // Centers text inside the input
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#9D00FF")} // Border color change on focus
              onBlur={(e) => (e.target.style.borderColor = "#341539")} // Revert border color on blur
            />
          </div>
          <DataTable
            columns={columns}
            data={search.length > 0 ? filteredData ? filteredData : [] : surveys ? surveys : []}
            pagination
            highlightOnHover
            customStyles={{
              headCells: {
                style: {
                  backgroundColor: "#341539",
                  fontWeight: "bold",
                  color: "white",
                },
              },
              cells: {
                style: {
                  padding: "10px",
                },
              },
            }}
            onRowClicked={(row) => handleRowClick(row)}
          />
        </div>
      )}
    </div>
  );
};

export default SurveyList;


/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
import { useEffect, useState } from "react";
// import MaterialTable from "material-table";
// import MDAvatar from "components/MDAvatar";
// import MDBadge from "components/MDBadge";
// import { DataGrid } from "@material-ui/data-grid";

export default function Data() {
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    fetch("http://10.151.1.111:8000/employee_app/api/v1/Employee/")
      .then((response) => response.json())
      .then((json) => setEmployees(json));
  }, []);
  return {
    columns: [
      { Header: "ID", accessor: "id", align: "left" },
      { Header: "FirstName", accessor: "first_name", align: "left" },
      { Header: "lastName", accessor: "last_name", align: "center" },
      { Header: "Email", accessor: "email", align: "center" },
      { Header: "Department", accessor: "department", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],
    rows: [employees],
    // {
    //   action: (
    //     <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
    //       Edit
    //     </MDTypography>
    //   ),
    // },
  };
}

import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// import MDButton from "components/MDButton";
import Footer from "examples/Footer";
import MDInput from "components/MDInput";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export default function SimpleTable() {
  const classes = useStyles();
  const uniqueId = Math.floor(Math.random() * 100);
  const [employees, setEmployees] = useState([]);
  useEffect(() => {
    fetch("http://10.151.1.111:8000/employee_app/api/v1/Employee/")
      .then((response) => response.json())
      .then((json) => setEmployees(json));
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <MDBox
          mx={2}
          mt={-3}
          py={3}
          px={2}
          variant="gradient"
          bgColor="error"
          borderRadius="lg"
          coloredShadow="error"
        >
          <MDTypography variant="h6" color="white">
            Employees Table
          </MDTypography>
        </MDBox>
        <MDBox pr={1} pt={1} pb={1} py={1}>
          <MDInput label="Search Table" />
        </MDBox>
        <TableContainer component={Paper}>
          {/* className={classes.table}  */}
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>FirstName</TableCell>
                <TableCell>LastName</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={uniqueId}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>{uniqueId}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.first_name}</TableCell>
                  <TableCell>{employee.last_name}</TableCell>
                  <TableCell>{employee.department_name}</TableCell>
                  <TableCell>
                    <MDTypography
                      component="a"
                      href="#"
                      variant="contained"
                      color="info"
                      onClick={() => alert("You clicked the button!")}
                      fontWeight="medium"
                    >
                      Details
                    </MDTypography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

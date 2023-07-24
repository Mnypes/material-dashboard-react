import React, { useState, useEffect } from "react";
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
import MDButton from "components/MDButton";
import Footer from "examples/Footer";
import MDInput from "components/MDInput";
import axios from "axios";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

function Directors() {
  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState("");
  const [openDetails, setOpenDetails] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [selected, setSelected] = React.useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1402);
  const itemsPerPage = 10;
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const handleDetailsOpen = () => {
    setOpenDetails(true);
  };

  const handleDetailsClose = () => {
    setOpenDetails(false);
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);

    const filteredList = employees.filter(
      (employee) =>
        employee.tax_payer_name.toLowerCase().includes(query.toLowerCase()) ||
        employee.associated_entity_pin.toLowerCase().includes(query.toLocaleLowerCase())
    );
    setFilteredEmployees(filteredList);
  };

  useEffect(() => {
    axios
      .get(
        `http://10.153.1.85:8000/fraud_app/api/v1/Directors?page=${pageNumber}&itemsPerPage=${itemsPerPage}`
      )
      .then((response) => {
        setEmployees(response.data.results);
        setFilteredEmployees(response.data.results);
        setTotalPages(response.data.total_pages);
      })
      .finally(() => {});
  }, [pageNumber]);

  const handleCheckboxChange = (index) => {
    const newSelected = [...selected];
    if (newSelected.indexOf(index) === -1) {
      newSelected.push(index);
    } else {
      newSelected.splice(newSelected.indexOf(index), 1);
    }
    setSelected(newSelected);
  };

  useEffect(() => {
    const list = employees.filter(
      (employee) =>
        employee.tax_payer_name.toLowerCase().includes(query.toLowerCase()) ||
        employee.associated_entity_pin.toLowerCase().includes(query.toLocaleLowerCase())
    );
    setFilteredEmployees(list);
  }, [query, employees]);

  const handleNextPage = () => {
    if (pageNumber < totalPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={2} pb={3}>
        <MDBox pr={1} pt={1} pb={1} py={1} style={{ textAlign: "right" }}>
          <MDInput label="Search Table" onChange={handleInputChange} value={query} />
        </MDBox>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow style={{ backgroundColor: "#42424a" }}>
                <TableCell style={{ color: "white" }}>SELECT</TableCell>
                <TableCell style={{ color: "white" }}>PIN</TableCell>
                <TableCell style={{ color: "white" }}>TAXPAYER</TableCell>
                <TableCell style={{ color: "white" }}>ASSOCIATED PIN</TableCell>
                <TableCell style={{ color: "white" }}>ROLE</TableCell>
                <TableCell style={{ color: "white" }}>DETAILS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow
                  key={employee.associated_entity_pin}
                  style={{
                    backgroundColor:
                      selected.indexOf(employee.associated_entity_pin) !== -1 ? "#E5E4E2" : "",
                  }}
                >
                  <TableCell>
                    <Checkbox
                      onChange={() => handleCheckboxChange(employee.associated_entity_pin)}
                      checked={selected.indexOf(employee.associated_entity_pin) !== -1}
                    />
                  </TableCell>
                  <TableCell>{employee.pin_no}</TableCell>
                  <TableCell>{employee.tax_payer_name}</TableCell>
                  <TableCell>{employee.associated_entity_pin}</TableCell>
                  <TableCell>{employee.associated_entity_type}</TableCell>
                  <TableCell>
                    <MDButton
                      onClick={() => {
                        setSelectedEmployee(employee);
                        handleDetailsOpen();
                      }}
                      color="white"
                      style={{
                        backgroundColor: "#A52A2A",
                        borderRadius: "13px",
                        color: "white",
                        textTransform: "none",
                      }}
                    >
                      Details
                    </MDButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <MDBox
          style={{
            textAlign: "right",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          pt={1}
          pb={1}
        >
          <span style={{ fontSize: "1rem", fontWeight: "bold" }}>
            Page {pageNumber} of {totalPages}
          </span>
          <MDButton onClick={handlePreviousPage} disabled={pageNumber === 1}>
            Previous
          </MDButton>
          <MDButton onClick={handleNextPage} disabled={pageNumber === totalPages}>
            Next
          </MDButton>
        </MDBox>
        <Dialog
          open={openDetails}
          onClose={handleDetailsClose}
          DialogContentText="left"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth
        >
          <MDBox
            pr={1}
            pt={1}
            py={1}
            style={{
              textAlign: "right",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#E5E4E2",
            }}
          >
            <DialogTitle style={{ fontFamily: "Helvetica" }}>
              {Object.keys(selectedEmployee).length > 0
                ? `Director Details for ${selectedEmployee.pin_no}:`
                : "Director Details"}
            </DialogTitle>
            <IconButton
              size="medium"
              textAlign="right"
              disableRipple
              style={{
                textAlign: "right",
                justifyContent: "space-between",
              }}
              onClick={handleDetailsClose}
              aria-label="Go back"
              id="close-button"
              onMouseEnter={() => {
                document.getElementById("close-button").style.backgroundColor = "#E5E4E2";
              }}
              onMouseLeave={() => {
                document.getElementById("close-button").style.backgroundColor = "";
                // document.getElementById("close-button").innerText = "X";
              }}
            >
              <Tooltip title="close" placement="top">
                <Icon>close_icon</Icon>
              </Tooltip>
            </IconButton>
          </MDBox>
          <DialogContent>
            <DialogContentText style={{ fontFamily: "Roboto" }}>
              {Object.keys(selectedEmployee).length > 0 ? (
                <div>
                  <b>PIN:</b> {selectedEmployee.pin_no} <br />
                  <b>Taxpayer Name:</b> {selectedEmployee.tax_payer_name} <br />
                  <b>AssociatedEntityPin:</b> {selectedEmployee.associated_entity_pin} <br />
                  <b>AssociatedEntityType:</b> {selectedEmployee.associated_entity_type}
                </div>
              ) : null}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Directors;

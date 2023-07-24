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
import MDTypography from "components/MDTypography";
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

function VatFraud() {
  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState("");
  const [setFilteredEmployees] = useState([]);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [selected, setSelected] = React.useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const itemsPerPage = 10;
  const [openAnalyze, setOpenAnalyze] = React.useState(false);
  const totalPages = Math.ceil(392331 / itemsPerPage);
  const [directors, setDirectors] = useState([]);
  const [directorPageNumber, setDirectorPageNumber] = useState(1);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = employees.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleDetailsOpen = () => {
    setOpenDetails(true);
  };

  const handleDetailsClose = () => {
    setOpenDetails(false);
  };

  const handleAnalyzeClose = () => {
    setOpenAnalyze(false);
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);

    const filteredList = employees.filter(
      (employee) =>
        employee.tax_payer_name.toLowerCase().includes(query.toLowerCase()) ||
        employee.invoice_no.toLowerCase().includes(query.toLowerCase()) ||
        employee.pin_no.toLowerCase().includes(query.toLocaleLowerCase())
    );
    setFilteredEmployees(filteredList);
  };

  useEffect(() => {
    axios
      .get(
        `http://10.153.1.85:8000/fraud_app/api/v1/FalseImports?page=${pageNumber}&itemsPerPage=${itemsPerPage}`
      )
      .then((response) => response.data.results)
      .then((data) => setEmployees(data))
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

  const handleAnalyzeOpen = () => {
    if (!selected.length) {
      // eslint-disable-next-line no-alert
      alert(
        "To view Director Information, Please select atleast one row before clicking this button."
      );
      return;
    }
    const pinNo = selectedEmployee.pin_no;

    axios
      .get(`http://10.153.1.85:8000/fraud_app/api/v1/Directors/?${pinNo}&page=${pageNumber}`)
      .then((response) => response.data.results)
      .then((data) => setDirectors(data))
      .finally(() => {});
    setOpenAnalyze(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={2} pb={3}>
        <MDBox
          pr={1}
          pt={1}
          pb={1}
          py={1}
          position="sticky"
          top="0"
          style={{
            textAlign: "right",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <MDButton
            variant="gradient"
            onClick={handleAnalyzeOpen}
            color="dark"
            height="1px"
            size="small"
            style={{
              borderRadius: "15px",
              fontWeight: "1em",
              color: "white",
              "&:hover": { backgroundColor: "red" },
            }}
          >
            Analyze
          </MDButton>
          <MDInput label="Search Table" onChange={handleInputChange} value={query} />
        </MDBox>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow style={{ backgroundColor: "#42424a" }}>
                <TableCell>
                  <Checkbox
                    onChange={handleSelectAllClick}
                    checked={selected.length === employees.length}
                  />
                </TableCell>
                <TableCell style={{ color: "white" }}>PIN</TableCell>
                <TableCell style={{ color: "white" }}>TaxpayerName</TableCell>
                <TableCell style={{ color: "white" }}>Supplier</TableCell>
                <TableCell style={{ color: "white" }}>Amount</TableCell>
                <TableCell style={{ color: "white" }}>Invoice No.</TableCell>
                <TableCell style={{ color: "white" }}>Invoice Date</TableCell>
                <TableCell style={{ color: "white" }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow
                  key={employee.invoice_no}
                  style={{
                    backgroundColor:
                      selected.indexOf(employee.invoice_no) !== -1 ? "#E5E4E2" : "white",
                  }}
                >
                  <TableCell>
                    <Checkbox
                      onChange={() => handleCheckboxChange(employee.invoice_no)}
                      checked={selected.indexOf(employee.invoice_no) !== -1}
                    />
                  </TableCell>
                  <TableCell>{employee.pin_no}</TableCell>
                  <TableCell>{employee.tax_payer_name}</TableCell>
                  <TableCell>{employee.suppliers_name}</TableCell>
                  <TableCell>{employee.amnt_before_tax}</TableCell>
                  <TableCell>{employee.invoice_no}</TableCell>
                  <TableCell>{employee.invoice_date}</TableCell>
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
          <MDButton disabled={pageNumber === 1} onClick={() => setPageNumber(pageNumber - 1)}>
            Prev
          </MDButton>
          <MDButton
            disabled={employees.length < itemsPerPage}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
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
              // color: "white",
            }}
          >
            <DialogTitle style={{ fontFamily: "Helvetica" }}>
              {Object.keys(selectedEmployee).length > 0
                ? `False Imports Details for ${selectedEmployee.pin_no}:`
                : "False Imports Details"}
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
                  <div>
                    <b>PIN:</b> {selectedEmployee.pin_no} <br />
                    <b>Taxpayer Name:</b> {selectedEmployee.tax_payer_name} <br />
                    <b>Station Name</b> {selectedEmployee.station_name} <br />
                    <b>TRP From Dt:</b> {selectedEmployee.trp_from_dt} <br />
                    <b>TRP To Dt:</b> {selectedEmployee.trp_to_dt} <br />
                    <b>Supplier Name:</b> {selectedEmployee.suppliers_name} <br />
                    <b>Supplier Pin:</b> {selectedEmployee.suppliers_pin} <br />
                    <b>Amount Before Tax:</b> {selectedEmployee.amnt_before_tax} <br />
                    <b>Invoice No:</b> {selectedEmployee.invoice_no} <br />
                    <b>Invoice Date:</b> {selectedEmployee.invoice_date} <br />
                    <b>Custom Entry No Prn:</b> {selectedEmployee.cust_entry_no_prn} <br />
                    <b>Lookup Code:</b> {selectedEmployee.lookup_code} <br />
                    <b>Date Created:</b> {selectedEmployee.created_dt} <br />
                    <b>Purchase Type:</b> {selectedEmployee.type_of_purchases}
                  </div>
                </div>
              ) : null}
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={openAnalyze}
          onClose={handleAnalyzeClose}
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
            <DialogTitle style={{ fontFamily: "Helvetica" }}>Directors Information</DialogTitle>
            <IconButton
              size="medium"
              textAlign="right"
              disableRipple
              style={{
                textAlign: "right",
                justifyContent: "space-between",
              }}
              onClick={handleAnalyzeClose}
              aria-label="Go back"
              id="close-button"
              onMouseEnter={() => {
                document.getElementById("close-button").style.backgroundColor = "#E5E4E2";
              }}
              onMouseLeave={() => {
                document.getElementById("close-button").style.backgroundColor = "";
              }}
            >
              <Tooltip title="close" placement="top">
                <Icon>close_icon</Icon>
              </Tooltip>
            </IconButton>
          </MDBox>
          <DialogContent>
            <DialogContentText style={{ fontFamily: "Roboto" }}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Company</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Pin</TableCell>
                      <TableCell>Role</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {directors.map((director) => (
                      <TableRow key={director.associated_entity_pin}>
                        <TableCell>
                          <MDTypography fontWeight="bold" color="info">
                            {director.pin_no}
                          </MDTypography>
                        </TableCell>
                        <TableCell>{director.tax_payer_name}</TableCell>
                        <TableCell>{director.associated_entity_pin}</TableCell>
                        <TableCell>{director.associated_entity_type}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <MDBox>
                <MDButton
                  disabled={directorPageNumber === 1}
                  onClick={() => setDirectorPageNumber(directorPageNumber - 1)}
                >
                  Prev
                </MDButton>
                <MDButton
                  disabled={directors.length < itemsPerPage}
                  onClick={() => setDirectorPageNumber(directorPageNumber + 1)}
                >
                  Next
                </MDButton>
              </MDBox>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default VatFraud;

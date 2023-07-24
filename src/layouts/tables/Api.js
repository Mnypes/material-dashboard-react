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
import Pagination from "@material-ui/lab/Pagination";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

export default function FalseImports() {
  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [openNetworks, setOpenNetworks] = React.useState(false);
  const [openAnalyze, setOpenAnalyze] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [masterChecked, setMasterChecked] = useState(false);
  const [checked, setChecked] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [pinNo, setPinNo] = useState("");

  const handleDetailsOpen = () => {
    setOpenDetails(true);
  };

  const handleDetailsClose = () => {
    setOpenDetails(false);
  };

  const handleAnalyzeOpen = () => {
    setOpenAnalyze(true);
  };

  const handleAnalyzeClose = () => {
    setOpenAnalyze(false);
  };

  // eslint-disable-next-line no-shadow
  const handleNetworksOpen = (pinNo) => {
    setPinNo(pinNo);
    setOpenNetworks(true);
  };

  // const handleNetworksOpen = () => {
  //   setOpenNetworks(true);
  // };
  const handleNetworksClose = () => {
    setOpenNetworks(false);
  };

  useEffect(() => {
    axios
      .get("http://10.153.1.85:8081/api/falseImports")
      .then((res) => {
        setEmployees(res.data.content);
        setFilteredEmployees(res.data.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleInputChange = (event) => {
    setQuery(event.target.value);

    const filteredList = employees.filter(
      (employee) =>
        employee.taxpayerName.toLowerCase().includes(query.toLowerCase()) ||
        employee.invoiceNo.toLowerCase().includes(query.toLowerCase()) ||
        employee.pinNo.toLowerCase().includes(query.toLocaleLowerCase())
    );
    setFilteredEmployees(filteredList);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleMasterChecked = (event) => {
    setMasterChecked(event.target.checked);
    if (event.target.checked) {
      const allchecked = employees.map((employee) => employee.id);
      setChecked(allchecked);
    } else {
      setChecked([]);
    }
  };
  const handleChecked = (id) => {
    const currentIndex = checked.indexOf(id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, filteredEmployees.length - page * rowsPerPage);

  const handleAnalysis = () => {
    if (checked.length === 0) {
      alert("please select a row first before clicking the button");
    } else {
      const pins = checked.map((id) => employees.find((employee) => employee.id === id).pinNo);
      fetch(`http://10.153.1.85:8081/api/directorDetails?pinNo=${pins}`)
        .then((res) => res.json())
        .then((data) => setDirectors(data));
      handleAnalyzeOpen();
    }
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
          style={{
            textAlign: "right",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <MDButton
            variant="gradient"
            onClick={handleAnalysis}
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
              <TableRow>
                <TableCell>
                  <Checkbox checked={masterChecked} onChange={handleMasterChecked} />
                </TableCell>
                <TableCell>PIN</TableCell>
                <TableCell>TaxpayerName</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Invoice No.</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Networks</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((employee) => (
                  <TableRow
                    key={employee.id}
                    style={
                      checked.indexOf(employee.id) !== -1
                        ? { backgroundColor: "#E5E4E2" }
                        : { backgroundColor: "#ffffff" }
                    }
                  >
                    <TableCell>
                      <Checkbox
                        checked={masterChecked || checked.indexOf(employee.id) !== -1}
                        onChange={() => handleChecked(employee.id)}
                      />
                    </TableCell>
                    <TableCell>{employee.pinNo}</TableCell>
                    <TableCell>{employee.taxpayerName}</TableCell>
                    <TableCell>{employee.suppliersName}</TableCell>
                    <TableCell>{employee.amntBeforeTax}</TableCell>
                    <TableCell>{employee.invoiceNo}</TableCell>
                    <TableCell>
                      <MDButton
                        onClick={() => {
                          setSelectedEmployee(employee);
                          handleDetailsOpen();
                        }}
                        color="white"
                        style={{
                          backgroundColor: "#333333",
                          borderRadius: "13px",
                          color: "white",
                          textTransform: "none",
                        }}
                      >
                        Details
                      </MDButton>
                    </TableCell>
                    <TableCell>
                      <MDButton
                        onClick={() => {
                          setSelectedEmployee(employee);
                          handleNetworksOpen(employee.pinNo);
                        }}
                        color="white"
                        style={{
                          backgroundColor: "#A52A2A",
                          borderRadius: "13px",
                          color: "white",
                          textTransform: "none",
                        }}
                      >
                        Visualize
                      </MDButton>
                    </TableCell>
                  </TableRow>
                ))}

              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <MDBox px={3} pb={2}>
          <MDButton
            component="div"
            color="primary"
            variant="text"
            style={{ float: "right" }}
            size="small"
          >
            <Pagination
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
              count={filteredEmployees.length}
              page={page}
              onChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
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
                ? `False Imports Details for ${selectedEmployee.pinNo}:`
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
                    <b>PIN:</b> {selectedEmployee.pinNo} <br />
                    <b>TaxpayerName:</b> {selectedEmployee.taxpayerName} <br />
                    <b>SuppliersName</b> {selectedEmployee.suppliersName} <br />
                    <b>Suppliers Pin:</b> {selectedEmployee.associatedEntityType} <br />
                    <b>AmountBeforeTax:</b> {selectedEmployee.amntBeforeTax} <br />
                    <b>TrpFromDt:</b> {selectedEmployee.trpFromDt} <br />
                    <b>TrpToDt:</b> {selectedEmployee.trpToDt} <br />
                    <b>Custom Entry No:</b> {selectedEmployee.custEntryNo} <br />
                    <b>Invoice No:</b> {selectedEmployee.invoiceNo} <br />
                    <b>Invoice Date:</b> {selectedEmployee.invoiceDate} <br />
                    <b>Lookup Code:</b> {selectedEmployee.lookupCode}
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
            }}
          >
            <DialogTitle style={{ fontFamily: "Helvetica" }}>
              Directors Information
              {/* <NotificationItem icon={<Icon>CloseIcon</Icon>} onClick={handleAnalyzeClose} /> */}
            </DialogTitle>
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
                document.getElementById("close-button").style.backgroundColor = "white";
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
                      <TableRow key={director.id}>
                        <TableCell>
                          <MDTypography fontWeight="bold" color="info">
                            {director.pinNo}
                          </MDTypography>
                        </TableCell>
                        <TableCell>{director.taxPayerName}</TableCell>
                        <TableCell>{director.associatedEntityPin}</TableCell>
                        <TableCell>{director.associatedEntityType}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={openNetworks}
          onClose={handleNetworksClose}
          DialogContentText="left"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          maxHeight="lg"
          fullWidth
          fullScreen
        >
          <MDBox
            pr={1}
            pt={1}
            pb={1}
            py={1}
            style={{
              textAlign: "right",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <DialogTitle style={{ fontFamily: "Helvetica" }}>Graph Visualization</DialogTitle>
            <IconButton
              size="medium"
              textAlign="right"
              disableRipple
              style={{
                textAlign: "right",
                justifyContent: "space-between",
              }}
              onClick={handleNetworksClose}
              aria-label="Go back"
              id="close-button"
              onMouseEnter={() => {
                document.getElementById("close-button").style.backgroundColor = "white";
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
              <iframe
                src={`http://127.0.0.1:5500/index.html?pinNo=${pinNo}`}
                // src="http://127.0.0.1:5500/index.html"
                width="100%"
                height="2200"
                frameBorder="0"
                title="Network Information Page"
                allowFullScreen="true"
                overflow="scroll"
              />
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

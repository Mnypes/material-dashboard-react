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
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

export default function Directors() {
  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [masterChecked, setMasterChecked] = useState(false);
  const [checked, setChecked] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios
      .get("http://10.153.1.85:8081/api/directors")
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
        employee.taxPayerName.toLowerCase().includes(query.toLowerCase()) ||
        employee.associatedEntityPin.toLowerCase().includes(query.toLowerCase())
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
            Directors
          </MDTypography>
        </MDBox>
        <MDBox pr={1} pt={1} pb={1} py={1} style={{ textAlign: "right" }}>
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
                <TableCell>Entity Pin</TableCell>
                <TableCell>Entity Type</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Checkbox
                        checked={masterChecked || checked.indexOf(employee.id) !== -1}
                        onChange={() => handleChecked(employee.id)}
                      />
                    </TableCell>
                    <TableCell>{employee.pinNo}</TableCell>
                    <TableCell>{employee.taxPayerName}</TableCell>
                    <TableCell>{employee.associatedEntityPin}</TableCell>
                    <TableCell>{employee.associatedEntityType}</TableCell>
                    <TableCell>
                      <MDTypography
                        component="a"
                        href="#"
                        variant="contained"
                        color="info"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          handleClickOpen();
                        }}
                        fontWeight="medium"
                      >
                        Details
                      </MDTypography>
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
        <MDBox px={3}>
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
          open={open}
          onClose={handleClose}
          DialogContentText="left"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth
        >
          <DialogContent>
            <DialogContentText style={{ fontFamily: "Helvetica" }}>
              <b>PIN:</b> {selectedEmployee.pinNo} <br />
              <b>TaxpayerName:</b> {selectedEmployee.taxPayerName} <br />
              <b>Entity Pin:</b> {selectedEmployee.associatedEntityPin} <br />
              <b>Entity Type:</b> {selectedEmployee.associatedEntityType}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

<Dialog
open={open}
onClose={handleClose}
DialogContentText="left"
aria-labelledby="alert-dialog-title"
aria-describedby="alert-dialog-description"
maxWidth="sm"
fullWidth
>
<DialogContent>
  <DialogContentText style={{ fontFamily: "Helvetica" }}>
    {selectedEmployee.length === 2 && (
      <>
        <MDBox pt={2} pb={2}>
          <MDTypography fontWeight="bold">
            {selectedEmployee[0].suppliersName}
          </MDTypography>
          <MDTypography fontWeight="bold" textAlign="right">
            {selectedEmployee[1].suppliersName}
          </MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="space-between">
          <div>
            <b>ID:</b> {selectedEmployee[0].id} <br />
            <b>PIN:</b> {selectedEmployee[0].pinNo} <br />
            <b>TaxpayerName:</b> {selectedEmployee[0].taxpayerName} <br />
            <b>SuppliersName:</b> {selectedEmployee[0].suppliersName} <br />
            <b>AmountBeforeTax:</b> {selectedEmployee[0].amntBeforeTax} <br />
            <b>PurchaseTotal:</b> {selectedEmployee[0].purchTotal} <br />
            <b>Date Created:</b> {selectedEmployee[0].createdDt}
          </div>
          <br />
          <div>
            <b>ID:</b> {selectedEmployee[1].id} <br />
            <b>PIN:</b> {selectedEmployee[1].pinNo} <br />
            <b>TaxpayerName:</b> {selectedEmployee[1].taxpayerName} <br />
            <b>SuppliersName:</b> {selectedEmployee[1].suppliersName} <br />
            <b>AmountBeforeTax:</b> {selectedEmployee[1].amntBeforeTax} <br />
            <b>PurchaseTotal:</b> {selectedEmployee[1].purchTotal} <br />
            <b>Date Created:</b> {selectedEmployee[1].createdDt}
          </div>
        </MDBox>
      </>
    )}
  </DialogContentText>
</DialogContent>
</Dialog>

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

export default function FalseImports() {
  const [employees, setEmployees] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [masterChecked, setMasterChecked] = useState(false);
  const [checked, setChecked] = useState([]);
  const [directors, setDirectors] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios
      .get("http://10.153.1.85:8080/api/falseImports")
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

  // const handleAnalysis = () => {
  //   const selectedEmployees = [];
  //   checked.forEach((id) => {
  //     selectedEmployees.push(employees.find((employee) => employee.id === id));
  //   });
  //   setSelectedEmployee(selectedEmployees);
  //   handleClickOpen();
  // };
  const handleAnalysis = () => {
    const selectedEmployees = [];
    checked.forEach((id) => {
      selectedEmployees.push(employees.find((employee) => employee.id === id));
    });
    setSelectedEmployee(selectedEmployees);
    handleClickOpen();
    axios
      .get(`http://10.153.1.85:8081/api/directors/${selectedEmployees.pinNo}`)
      .then((res) => {
        setDirectors(res.data.content);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={2} pb={3}>
        <MDBox pr={1} pt={1} pb={1} py={1} style={{ textAlign: "right" }}>
          <MDButton
            variant="contained"
            color="secondary"
            bgColor="secondary"
            onClick={handleAnalysis}
            style={{ marginRight: "720px", textAlign: "center" }}
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
                <TableCell>SuppliersName</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>PurchaseTotal</TableCell>
                <TableCell>Invoice No.</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((employee) => (
                  <TableRow key={employee.id}>
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
                    <TableCell>{employee.purchTotal}</TableCell>
                    <TableCell>{employee.invoiceNo}</TableCell>
                    <TableCell>
                      <MDTypography
                        component="a"
                        href="#"
                        variant="contained"
                        color="info"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          handleClickOpen();
                        }}
                        fontWeight="medium"
                      >
                        Details
                      </MDTypography>
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
        <MDBox px={3}>
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
          open={open}
          onClose={handleClose}
          DialogContentText="left"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="sm"
          fullWidth
        >
          <DialogContent>
            <DialogContentText style={{ fontFamily: "Helvetica" }}>
              <MDTypography fontWeight="bold">{selectedEmployee.suppliersName}</MDTypography>
              <br />
              <div>
                <b>PIN:</b> {selectedEmployee.pinNo} <br />
                <b>TaxpayerName:</b> {selectedEmployee.taxpayerName} <br />
                <b>SuppliersName</b> {selectedEmployee.suppliersName} <br />
                <b>Supplier Pin:</b> {selectedEmployee.associatedEntityType} <br />
                <b>AmountBeforeTax:</b> {selectedEmployee.amntBeforeTax} <br />
                <b>TrpFromDt:</b> {selectedEmployee.trpFromDt} <br />
                <b>TrpToDt:</b> {selectedEmployee.trpToDt} <br />
                <b>Custom Entry No:</b> {selectedEmployee.custEntryNo} <br />
                <b>Invoice No:</b> {selectedEmployee.invoiceNo} <br />
                <b>Invoice Date:</b> {selectedEmployee.invoiceDate} <br />
                <b>Lookup Code:</b> {selectedEmployee.lookupCode}
              </div>
              <b>Directors:</b> {directors.associatedEntityPin}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

 {/* {directors.length > 0 ? (
                directors.map((director) => (
                  <div>
                    <hr />
                    <br />
                    <MDTypography fontWeight="bold" color="info">
                      {director.pinNo}
                    </MDTypography>
                    <br />
                    <div>
                      <b>PIN:</b> {director.pinNo} <br />
                      <b>TaxpayerName:</b> {director.taxPayerName} <br />
                      <b>Associated Entity Pin:</b> {director.associatedEntityPin} <br />
                      <b>Role:</b> {director.associatedEntityType}
                    </div>
                  </div>
                ))
              ) : (
                <div>No Director Information for Selected Company</div>
              )}
            </DialogContentText>
          </DialogContent>
        </Dialog> */}

        update the code below to use if else statement in the dialog content instead of the ternary operator:
import React, { useState, useEffect } from "react";
import Table from "@material-ui/core/Table";
import MDInput from "components/MDInput";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function FalseImports() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [masterChecked, setMasterChecked] = useState(false);
  const [checked, setChecked] = useState([]);
  const [directors, setDirectors] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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

 const filteredList = employees.filter(
      (employee) =>
        employee.invoiceNo.toLowerCase().includes(query.toLowerCase()) ||
        employee.pinNo.toLowerCase().includes(query.toLocaleLowerCase())
    );
    setFilteredEmployees(filteredList);
  };
  const handleMasterChecked = (event) => {
    setMasterChecked(event.target.checked);
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
  const handleAnalysis = () => {
    const pins = checked.map((item) => employees.find((employee) => employee.id === item).pinNo);
    axios
      .get(`http://10.153.1.85:8081/api/directors?pinNo=${pins.join(",")}`)
      .then((res) => {
        setDirectors(res.data.content);
        if (directors.length === 0) {
          alert("no director information for selected company");
        }
        handleClickOpen();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
      <MDBox pt={2} pb={3}>
        <MDBox>
          <MDButton variant="contained" onClick={handleAnalysis}>
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
                <TableCell>SuppliersName</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Checkbox
                        checked={masterChecked || checked.indexOf(employee.id) !== -1}
                        onChange={() => handleChecked(employee.id)}
                      />
                    </TableCell>
                    <TableCell>{employee.pinNo}</TableCell>
                    <TableCell>{employee.taxpayerName}</TableCell>
                    <TableCell>{employee.suppliersName}</TableCell>
                    <TableCell>
                      <MDTypography component="a" href="#" variant="contained" color="info"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          handleClickOpen();
                        }}
                        fontWeight="medium">
                        Details
                      </MDTypography>
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
        <Dialog open={open} onClose={handleClose} DialogContentText="left"
          aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
          maxWidth="sm" fullWidth>
          <DialogTitle style={{ fontFamily: "Helvetica" }}>
            {Object.keys(selectedEmployee).length > 0
              ? "Employee Details"
              : "Directors Information"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText style={{ fontFamily: "Roboto" }}>
              {Object.keys(selectedEmployee).length > 0 ? (
                <div>
                  <br />
                  <MDTypography fontWeight="bold" color="info">
                    {selectedEmployee.pinNo}
                  </MDTypography>
                  <div>
                    <b>PIN:</b> {selectedEmployee.pinNo} <br />
                    <b>TaxpayerName:</b> {selectedEmployee.taxpayerName} <br />
                    <b>SuppliersName</b> {selectedEmployee.suppliersName} <br />
                    <b>Supplier Pin:</b> {selectedEmployee.associatedEntityType} <br />
                  </div>
                </div>
              ) : directors.length > 0 ? (
                directors.map((director) => (
                  <div>
                    <br />
                    <MDTypography fontWeight="bold" color="info">
                      {director.pinNo}
                    </MDTypography>
                    <div>
                      <b>PIN:</b> {director.pinNo} <br />
                      <b>TaxpayerName:</b> {director.taxPayerName} <br />
                      <b>Associated Entity Pin:</b> {director.associatedEntityPin} <br />
                      <b>Role:</b> {director.associatedEntityType}
                    </div>
                  </div>
                ))
              ) : (
                <div>No Director Information for Selected Company</div>
              )}
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
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

const handleDirectorDetails = () => {
  if (selectedPin) {
    const director = directors.find((director) => director.pinNo === selectedPin);
    if (director) {
      setSelectedDirector(director);
      handleAnalyzeOpen();
    } else {
      setSelectedDirector({});
      alert("no director details for selected company");
    }
  }
};

const handleAnalysis = () => {
  if (checked.length > 0) {
    const selectedEmployee = employees.find(
      (employee) => employee.id === checked[0]
    );
    setSelectedEmployee(selectedEmployee);

    const pinNo = selectedEmployee.pinNo;
    axios
      .get(`http://10.153.1.85:8081/api/directorDetails/${pinNo}`)
      .then((res) => {
        setDirectors(res.data.content);
        handleAnalyzeOpen();
      })
      .catch((err) => {
        console.log(err);
        handleAnalyzeOpen();
      });
  }
};

{directors.map((director) => (
  <div>
    <hr />
    <MDTypography fontWeight="bold" color="info">
      {director.pinNo}
    </MDTypography>
    <br />
    <b>Name:</b> {director.taxPayerName} <br />
    <b>Director Pin:</b> {director.associatedEntityPin} <br />
    <b>Role:</b> {director.associatedEntityType} <br />
    <br />
  </div>
))}


import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function FalseImports() {
  const [employees, setEmployees] = useState([]);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [openAnalyze, setOpenAnalyze] = React.useState(false);
  const [openNetworks, setOpenNetworks] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [masterChecked, setMasterChecked] = useState(false);
  const [checked, setChecked] = useState([]);
  const [directors, setDirectors] = useState([]);

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

  const handleNetworksOpen = () => {
    setOpenNetworks(true);
  };

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

  const handleAnalysis = () => {
    if (checked.length === 0) {
      setDirectors([
        {
          id: 0,
          pinNo: (
            <MDBox pt={2} px={2}>
              <MDAlert color="error" dismissible>
                Please select a row first before clicking this button to view director details.
              </MDAlert>
            </MDBox>
          ),
        },
      ]);
      handleAnalyzeOpen();
    } else {
      const pins = checked.map((id) => employees.find((employee) => employee.id === id).pinNo);
      fetch(`http://10.153.1.85:8081/api/directorDetails?pinNo=${pins}`)
        .then((res) => res.json())
        .then((data) => setDirectors(data));
      handleAnalyzeOpen();
    }
  };
  return (
      <MDBox pt={2} pb={3}>
        <MDBox>
          <MDButton>Analyze</MDButton>
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
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((employee) => (
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        checked={masterChecked || checked.indexOf(employee.id) !== -1}
                        onChange={() => handleChecked(employee.id)}
                      />
                    </TableCell>
                    <TableCell>{employee.pinNo}</TableCell>
                    <TableCell>{employee.taxpayerName}</TableCell>
                    <TableCell>
                      <MDTypography
                        component="a"
                        href="#"
                      >
                        Details
                      </MDTypography>
                      <MDTypography
                        component="a"
                        href="#"
                      >
                        View Networks
                      </MDTypography>
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
        <Dialog
          open={openDetails}
          onClose={handleDetailsClose}
        >
          <DialogTitle style={{ fontFamily: "Helvetica" }}>
            {Object.keys(selectedEmployee).length > 0 ? "Imports Details" : "Import Information"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText style={{ fontFamily: "Roboto" }}>
              {Object.keys(selectedEmployee).length > 0 ? (
                    <b>PIN:</b> {selectedEmployee.pinNo} <br />
                    <b>TaxpayerName:</b> {selectedEmployee.taxpayerName} <br />
                  </div>
                </div>
              ) : null}
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Dialog
          open={openAnalyze}
          onClose={handleAnalyzeClose}
        >
          <DialogTitle style={{ fontFamily: "Helvetica" }}>Directors Information</DialogTitle>
          <DialogContent>
            <DialogContentText style={{ fontFamily: "Roboto" }}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Company</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Pin</TableCell>
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
        >
          <DialogTitle style={{ fontFamily: "Helvetica" }}>Network Information</DialogTitle>
          <DialogContent>
            <DialogContentText style={{ fontFamily: "Roboto" }}>           
             <iframe
             src="http://127.0.0.1:5500/index.html"
             width="100%"
             height="100%"
             frameBorder="0"
             allowFullScreen
             title="Network Information Page"
             ></iframe>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </MDBox>
  );
}
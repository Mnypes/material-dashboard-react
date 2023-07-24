import { Link } from "react-router-dom";
import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { IconButton, InputAdornment } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/red-wine.png";

function Cover() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    pass: "",
    confirmPass: "",
    showPass: false,
    showConfirmPass: false,
  });
  const handlePassVisibilty = (type) => {
    if (type === "pass") {
      setValues({
        ...values,
        showPass: !values.showPass,
      });
    } else if (type === "confirmPass") {
      setValues({
        ...values,
        showConfirmPass: !values.showConfirmPass,
      });
    }
  };
  const handleSignup = () => {
    if (values.pass === values.confirmPass) {
      alert("Successfully signed up");
      // logic to save data to database
    } else {
      alert("Passwords do not match");
    }
  };
  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your username and password to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Name"
                variant="standard"
                fullWidth
                onChange={(e) => setValues({ ...values, name: e.target.value })}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                onChange={(e) => setValues({ ...values, email: e.target.value })}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type={values.showPass ? "text" : "password"}
                label="Password"
                variant="standard"
                fullWidth
                required
                onChange={(e) => setValues({ ...values, pass: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handlePassVisibilty("pass")}
                        aria-label="toggle password"
                        edge="end"
                      >
                        {values.showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type={values.showConfirmPass ? "text" : "password"}
                label="Repeat Password"
                variant="standard"
                fullWidth
                required
                onChange={(e) => setValues({ ...values, confirmPass: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handlePassVisibilty("confirmPass")}
                        aria-label="toggle password"
                        edge="end"
                      >
                        {values.showConfirmPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleSignup}>
                Sign Up
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// @mui material components
import { IconButton, InputAdornment } from "@mui/material";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axios from "axios";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/red-wine.png";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const initialvalues = { email: "", pass: "" };
  const [values, setValues] = useState({
    initialvalues,
    showPass: false,
  });
  const [setIsSubmit] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    // setFormErrors(validate(values));
    if (values.email === "" || values.pass === "") {
      setError("Invalid username or password");
    } else {
      axios
        .post("https://reqres.in/api/login", {
          email: values.email,
          password: values.pass,
        })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          navigate("/layouts/tables/Api");
        })
        .catch((err) => console.error(err));
      setIsSubmit(true);
    }
  };
  const handlePassVisibilty = () => {
    setValues({
      ...values,
      showPass: !values.showPass,
    });
  };
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="UserName"
                fullWidth
                required
                onChange={(e) => setValues({ ...values, email: e.target.value })}
              />
            </MDBox>
            {/* <MDTypography fontWeight="1em" color="text">
              {formErrors.email}
            </MDTypography> */}
            <MDBox mb={2}>
              <MDInput
                type={values.showPass ? "text" : "password"}
                label="Password"
                fullWidth
                required
                onChange={(e) => setValues({ ...values, pass: e.target.value })}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handlePassVisibilty}
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
            {error && (
              <MDTypography fontWeight="1em" color="text">
                {error}
              </MDTypography>
            )}
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox alignItems="center" textAlign="center">
              <MDTypography
                component={Link}
                to="/authentication/reset-password/cover"
                variant="button"
                color="info"
                fontWeight="medium"
                textGradient
              >
                forgot password?
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                component={Link}
                to="/layouts/tables/Api"
                variant="gradient"
                type="submit"
                color="info"
                fullWidth
                onClick={handleSubmit}
              >
                sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Don&apos;t have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign up
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;

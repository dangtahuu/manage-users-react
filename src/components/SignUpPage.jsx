import { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { gql, useMutation } from "@apollo/client";
import { Navigate, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useContext";
import isValidEmail from "../utils/isValidEmail";

const SIGN_UP = gql`
  mutation Signup($signUpInput: SignUpInput!) {
    signup(signUpInput: $signUpInput) {
      user {
        email
        id
      }
      accessToken
    }
  }
`;

const SignUpPage = () => {
  const navigate = useNavigate();
  const { user, openSnack, setOpenSnack } = useAppContext();

  const [signUp, { data, loading, error }] = useMutation(SIGN_UP);

  // const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");

  const [input, setInput] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };


  const validateFields = () => {
    if (!isValidEmail(input.email)) {
      setErrors((state) => ({ ...state, email: "Please enter a valid email" }));
      return false;
    } else setErrors((state) => ({ ...state, email: "" }));

    if (input.password.length < 5) {
      setErrors((state) => ({
        ...state,
        password: "Password must contain at least 5 characters",
      }));
      return false;
    } else setErrors((state) => ({ ...state, password: "" }));

    if (input.confirmPassword !== input.password) {
      setErrors((state) => ({
        ...state,
        confirmPassword: "Passwords don't match",
      }));
      return false;
    } else setErrors((state) => ({ ...state, confirmPassword: "" }));

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateFields()) {
        return;
      } else {
        await signUp({ variables: { signUpInput: input } });
        setOpenSnack("Sign up successfully!");
        navigate(`/signin`);
      }
    } catch (err) {
      console.log(err);
      setOpenSnack(err.message);
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autofocus
                onChange={handleChange}
                value={input.email}
                error={errors.email !== ""}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={handleChange}
                value={input.password}
                error={errors.password !== ""}
                helperText={errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                onChange={handleChange}
                value={input.confirmPassword}
                error={errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            loading={loading}
          >
            Sign Up
          </Button>

          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUpPage;

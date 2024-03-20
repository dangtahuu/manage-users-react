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

const SIGN_IN = gql`
  mutation Signin($signInInput: SignInInput!) {
    signin(signInInput: $signInInput) {
      user {
        email
        id
        description
        avatar
        dateOfBirth
      }
      accessToken
    }
  }
`;

const SignInPage = () => {
  const navigate = useNavigate();
  const { user, setNameAndToken, openSnack, setOpenSnack } = useAppContext();

  const [signIn, { data, loading, error }] = useMutation(SIGN_IN);

  const [snackMessage, setSnackMessage] = useState("");

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
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

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateFields()) {
        return;
      } else {
        const res = await signIn({ variables: { signInInput: input } });
        setNameAndToken(res.data.signin.user, res.data.signin.accessToken);
        setOpenSnack("Sign in successfully!");
        setTimeout(()=>navigate(`/`),1000);
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
            Sign in
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
                  autoFocus
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={loading}
            >
              Sign In
            </Button>

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signup" variant="body2">
                  Don't have an account? Sign up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
};

export default SignInPage;

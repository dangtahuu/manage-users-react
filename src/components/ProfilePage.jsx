import { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  Grid,
  Box,
  Typography,
  Container,
  AppBar,
  FormLabel,
  Toolbar,
  Modal,
} from "@mui/material";

import EditForm from "./EditForm";

import { Navigate, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/useContext";

import formatDate from "../utils/formatDate";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logOut } = useAppContext();

  const [openModal, setOpenModal] = useState(false);


  if (!user) {
    return <Navigate to="/signin" />;
  }
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hello, {user.email}
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              logOut();
              navigate("/signin");
            }}
          >
            Log out
          </Button>
        </Toolbar>
      </AppBar>
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
          <Typography component="h1" variant="h5">
            Info
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid
                container
                item
                xs={12}
                alignItems="center"
                justifyContent="center"
              >
                <Avatar src={user.avatar} sx={{ width: 56, height: 56 }} />
              </Grid>

              {user.description && (
                <Grid item xs={12}>
                  <FormLabel>Description</FormLabel>
                  <Typography>{user.description}</Typography>
                </Grid>
              )}

              {user.dateOfBirth && (
                <Grid item xs={12}>
                  <FormLabel>Date of birth</FormLabel>
                  <Typography>{formatDate(user.dateOfBirth)}</Typography>
                </Grid>
              )}
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => setOpenModal(true)}
            >
              Edit
            </Button>
          </Box>
        </Box>
        <Modal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
        >
          <EditForm setOpenModal={setOpenModal} />
        </Modal>
      </Container>
    </>
  );
};

export default ProfilePage;

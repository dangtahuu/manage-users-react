import { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Grid,
  Box,
  Typography,
  styled,
  TextField,
} from "@mui/material";

import dayjs from "dayjs";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { gql, useMutation } from "@apollo/client";
import { useAppContext } from "../context/useContext";

const UPDATE = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!, $avatar: Upload) {
    updateUser(updateUserInput: $updateUserInput, avatar: $avatar) {
      user {
        email
        id
        description
        avatar
        dateOfBirth
      }
    }
  }
`;

const EditForm = ({ setOpenModal }) => {
  const { user, setUser, setOpenSnack } = useAppContext();

  const [update] = useMutation(UPDATE);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    description: user.description || "",
    avatar: user.avatar || "",
    dateOfBirth: dayjs(user.dateOfBirth) || dayjs(Date.now()),
  });

  const [image, setImage] = useState(null);

  const [errors, setErrors] = useState({
    description: "",
  });

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const validateFields = () => {
    if (input.description && input.description.length > 128) {
      setErrors((state) => ({
        ...state,
        description: "Description must not exceed 128 characters",
      }));
      return false;
    } else setErrors((state) => ({ ...state, description: "" }));

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateFields()) {
        return;
      } else {
        setLoading(true);
        const res = await update({
          variables: {
            updateUserInput: {
              description: input.description,
              dateOfBirth: input.dateOfBirth,
            },
            avatar: image,
          },
        });
        setUser(res.data.updateUser.user);
        setOpenSnack("Update successfully!");
        setOpenModal(false);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setOpenSnack(err.message);
    }
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box sx={style}>
      <Typography component="h1" variant="h5">
        Edit info
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Avatar src={input.avatar} sx={{ width: 56, height: 56 }} />
          </Grid>
          <Grid item xs={12}>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
            >
              Upload file
              <VisuallyHiddenInput
                onChange={(e) => {
                  const file = e.target.files[0];
                  setInput((prev) => ({
                    ...prev,
                    avatar: URL.createObjectURL(file),
                  }));
                  setImage(file);
                }}
                type="file"
              />
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              onChange={handleChange}
              value={input.description}
              error={errors.description !== ""}
              helperText={errors.description}
              multiline
              maxRows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker", "DatePicker"]}>
                <DatePicker
                  label="Date of birth"
                  value={input.dateOfBirth}
                  onChange={(newValue) =>
                    setInput((prev) => ({ ...prev, dateOfBirth: newValue }))
                  }
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                setOpenModal(false);
              }}
            >
              Close
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={loading}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default EditForm;

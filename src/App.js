import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProfilePage from "./components/ProfilePage";
import SignUpPage from "./components/SignUpPage";
import SignInPage from "./components/SignInPage";
import { Snackbar, ThemeProvider, createTheme } from "@mui/material";
import { useAppContext } from "./context/useContext";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const defaultTheme = createTheme();

const App = () => {
  const { openSnack, setOpenSnack, token } = useAppContext();
  
  const client = new ApolloClient({
    link: createUploadLink({
      uri: process.env.REACT_APP_SERVER,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "apollo-require-preflight": true,
      },
    }),

    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={defaultTheme}>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={openSnack}
          autoHideDuration={3000}
          onClose={() => {
            setOpenSnack("");
          }}
          message={openSnack}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProfilePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;

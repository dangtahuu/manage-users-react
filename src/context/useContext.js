import { createContext, useContext, useState } from "react";


const user = JSON.parse(localStorage.getItem("user"));
const token =
  JSON.parse(localStorage.getItem("token")) || localStorage.getItem("token");

const initState = {
  user: user || "",
  token: token || "",
};

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [state, setState] = useState(initState);
    const [openSnack, setOpenSnack] = useState("")

  const removeFromLocalStorage = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const addToLocalStorage = (user, token) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", JSON.stringify(token));
  };

  const setUser = (userValue) => {
    setState({ ...state, user: userValue});
    addToLocalStorage(userValue);
  };

  const setNameAndToken = (userValue, tokenValue) => {
    setState({ ...state, user: userValue, token: tokenValue });
    addToLocalStorage(userValue, tokenValue);
  };


  const logOut = () => {
    removeFromLocalStorage();
    setState({ ...state, user: "", token: "" });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        logOut,
        setNameAndToken,
        setUser,
        openSnack,
        setOpenSnack
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { useAppContext, AppProvider };

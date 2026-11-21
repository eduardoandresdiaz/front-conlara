import { createContext, useState, useContext, useEffect } from "react";

// 
export const UserContext = createContext({
  user: {},
  userAppointments: [],
  setUser: () => {},
  setUserAppointments: () => {},
});

// 
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [userAppointments, setUserAppointments] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    try {
      const parsedUser = JSON.parse(storedUser);
      if (
        parsedUser &&
        typeof parsedUser === "object" &&
        typeof parsedUser.email === "string"
      ) {
        setUser(parsedUser);
        return;
      }
    } catch (error) {
      console.warn("La sesión guardada no es válida; se limpiará.", error);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userAppointments,
        setUserAppointments,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook 
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
};

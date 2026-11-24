import { createContext, useState, useContext, useEffect } from "react";
import {
  clearExpiredSession,
  getTokenExpiration,
  installSessionGuards,
  isSessionExpired,
} from "../helpers/authSession";

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
    installSessionGuards();

    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser) return;

    if (isSessionExpired(token)) {
      clearExpiredSession();
      setUser({});
      return;
    }

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

  useEffect(() => {
    const handleExpiredSession = () => setUser({});
    window.addEventListener("conlara:session-expired", handleExpiredSession);

    const token = localStorage.getItem("token");
    const expiration = getTokenExpiration(token);
    let timeoutId;

    if (expiration) {
      const remainingTime = expiration - Date.now();
      if (remainingTime <= 0) {
        clearExpiredSession();
      } else {
        timeoutId = window.setTimeout(() => {
          clearExpiredSession();
        }, remainingTime);
      }
    }

    return () => {
      window.removeEventListener("conlara:session-expired", handleExpiredSession);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [user]);

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

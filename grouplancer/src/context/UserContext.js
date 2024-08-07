import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    const login = (userData) => {
        setCurrentUser(userData);
    }

    const logout = () => {
        setCurrentUser(null);
    }

    return (
        <UserContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    return useContext(UserContext);
};
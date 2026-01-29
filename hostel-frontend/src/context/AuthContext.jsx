// import { createContext, useContext, useState } from "react";
// import api from "../api/axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const login = async (email, password) => {
//     try {
//       const res = await api.post("/auth/login", {
//         email,
//         password,
//       });

//       const { token, user } = res.data;

//       localStorage.setItem("token", token);
//       localStorage.setItem("role", user.role);
//       setUser(user);

//       return { success: true, role: user.role };
//     } catch (err) {
//       return {
//         success: false,
//         message: err.response?.data?.message || "Login failed",
//       };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session on refresh
    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // LOGIN (REAL BACKEND)
    const login = async (email, password) => {
        try {
            const res = await api.post("/auth/login", {
                email,
                password
            });

            const { token, user } = res.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            setUser(user);
            return { success: true, user };
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Login failed"
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);


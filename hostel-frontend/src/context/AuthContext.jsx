import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in (simulated persistence)
        const storedUser = localStorage.getItem('hostel_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Initialize dummy users database if empty
        const usersDb = localStorage.getItem('hostel_users_db');
        if (!usersDb) {
            localStorage.setItem('hostel_users_db', JSON.stringify([]));
        }

        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('hostel_user', JSON.stringify(userData));
    };

    const register = (userData) => {
        const usersDb = JSON.parse(localStorage.getItem('hostel_users_db') || '[]');

        // Check for duplicate email
        if (usersDb.some(u => u.email === userData.email)) {
            return { success: false, message: 'Email is already registered' };
        }

        // Add role if not present (default to student)
        const newUser = { ...userData, role: userData.role || 'student' };

        // Save to DB
        usersDb.push(newUser);
        localStorage.setItem('hostel_users_db', JSON.stringify(usersDb));

        // Auto login
        login(newUser);
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('hostel_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

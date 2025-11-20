import { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const usuarioActual = authService.obtenerUsuarioLogeado();
        setUser(usuarioActual);
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await authService.login(email, password);
        setUser(res.data.user);
        return res;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const val = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={val}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
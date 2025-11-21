import { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const usuarioActual = authService.obtenerUsuarioLogeado();
            if (usuarioActual) {
                setUser(usuarioActual);
            }
        } catch (error) {
            console.error('Error al cargar usuario:', error);
            localStorage.clear();
        } finally {
            setLoading(false);
        }



    }, []);

    const login = async (email, password) => {
        try {
            const res = await authService.login(email, password);
            const usuario = res.data.usuario;
            setUser(usuario);
            return res;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }

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
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={val}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
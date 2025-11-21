import api from './api';

const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    obtenerUsuarioLogeado: () => {
        const user = localStorage.getItem('user');
        if (!user || user === 'undefined' || user === 'null') {
            return null;
        }
        try {
            JSON.parse(user);
        } catch (error) {
            console.error('***Error al obtener usuario:', error);
            return null;
        }
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
    
    obtenerToken: () => {
        const token = localStorage.getItem('token');
        if (!token || token === 'undefined' || token === 'null') {
        return null;
        }
        return token;
    }
};

export default authService;


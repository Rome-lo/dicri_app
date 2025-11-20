import api from './api';

const expedienteService = {
    obtenerExpedientes: async (filters = {}) => {
        const params = new URLSearchParams(filters).toString();
        const response = await api.get(`/expedientes?${params}`);
        return response.data;
    },
    obtenerExpedientePorId: async (id) => {
        const response = await api.get(`/expedientes/${id}`);
        return response.data;
    },
    crearExpediente: async (data) => {
        const response = await api.post('/expedientes', data);
        return response.data;
    },
    actualizarExpediente: async (id, data) => {
        const response = await api.put(`/expedientes/${id}`, data);
        return response.data;
    },

    eliminarExpediente: async (id) => {
        const response = await api.delete(`/expedientes/${id}`);
        return response.data;
    },

    enviarARevision: async (id) => {
        const response = await api.put(`/expedientes/${id}/enviar-revision`);
        return response.data;
    },

    aprobarExpediente: async (id) => {
        const response = await api.put(`/expedientes/${id}/aprobar`);
        return response.data;
    },


    rechazarExpediente: async (id, justificacion) => {
        const response = await api.put(`/expedientes/${id}/rechazar`, { justificacion });
        return response.data;
    },

    obtenerIndiciosPorExpediente: async (expedienteId) => {
        const response = await api.get(`/expedientes/${expedienteId}/indicios`);
        return response.data;
    },

    crearIndicio: async (expedienteId, data) => {
        const response = await api.post(`/expedientes/${expedienteId}/indicios`, data);
        return response.data;
    },

    actualizarIndicio: async (indicioId, data) => {
        const response = await api.put(`/indicios/${indicioId}`, data);
        return response.data;
    },

    eliminarIndicio: async (indicioId) => {
        const response = await api.delete(`/indicios/${indicioId}`);
        return response.data;
    }

};

export default expedienteService;
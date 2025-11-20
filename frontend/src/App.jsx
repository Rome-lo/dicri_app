import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Expedientes from './pages/Expedientes';
import ExpedienteDetalle from './pages/ExpedienteDetalle';
import NuevoExpediente from './pages/NuevoExpediente';
import ExpedienteRevision from './pages/ExpedienteRevision';
import Reportes from './pages/Reportes';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/expedientes"
                        element={
                            <PrivateRoute>
                                <Expedientes />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/expedientes/nuevo"
                        element={
                            <PrivateRoute roles={['TECNICO', 'ADMIN']}>
                                <NuevoExpediente />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/expedientes/:id"
                        element={
                            <PrivateRoute>
                                <ExpedienteDetalle />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/revision"
                        element={
                            <PrivateRoute roles={['COORDINADOR', 'ADMIN']}>
                                <ExpedienteRevision />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/reportes"
                        element={
                            <PrivateRoute roles={['COORDINADOR', 'ADMIN']}>
                                <Reportes />
                            </PrivateRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
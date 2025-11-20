import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Table, Button, Badge } from 'react-bootstrap';
import { FiEye, FiLogOut } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import expedienteService from '../services/expedienteService';

const ExpedientesRevision = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [expedientes, setExpedientes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerExpedientes();
    }, []);

    const obtenerExpedientes = async () => {
        setLoading(true);
        try {
            const response = await expedienteService.obtenerExpedientes({ estado: 'EN_REVISION' });
            if (response.success) {
                setExpedientes(response.data);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const cerrarSesion = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-vh-100" style={{ backgroundColor: '#f5f5f5' }}>
            <nav className="navbar navbar-dark bg-dark mb-4">
                <div className="container-fluid">
                    <span className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                        DICRI APP
                    </span>
                    <div className="d-flex align-items-center text-white">
                        <span className="me-3">{user?.nombre}</span>
                        <span className="badge bg-light text-dark me-3">{user?.rol}</span>

                        <button className="btn btn-outline-light btn-sm" onClick={cerrarSesion}>
                            <FiLogOut className="me-1" />
                            Salir
                        </button>
                    </div>
                </div>
            </nav>

            <Container>
                <Row className="mb-4">
                    <Col>
                        <h2>Expedientes en Revisión</h2>
                        <p className="text-muted">Expedientes pendientes de aprobación</p>
                    </Col>
                </Row>

                <Card>
                    <Card.Body>
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary"></div>
                            </div>
                        ) : (
                            <Table responsive hover>
                                <thead className="table-light">
                                    <tr>
                                        <th>Número</th>
                                        <th>Descripción</th>
                                        <th>Técnico</th>
                                        <th>Fecha Envío</th>
                                        <th className="text-center">Indicios</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expedientes.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-4">
                                                No hay expedientes en revisión
                                            </td>
                                        </tr>
                                    ) : (
                                        expedientes.map((exp) => (
                                            <tr key={exp.id}>
                                                <td><strong>{exp.numero_expediente}</strong></td>
                                                <td>{exp.descripcion}</td>
                                                <td>{exp.tecnico_nombre}</td>
                                                <td>
                                                    {format(new Date(exp.fecha_envio_revision), 'dd/MM/yyyy HH:mm', { locale: es })}
                                                </td>
                                                <td className="text-center">
                                                    <Badge bg="primary" pill>{exp.total_indicios}</Badge>
                                                </td>
                                                <td className="text-center">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => navigate(`/expedientes/${exp.id}`)}
                                                    >
                                                        <FiEye />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default ExpedientesRevision;
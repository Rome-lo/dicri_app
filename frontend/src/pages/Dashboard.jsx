import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FiFolder, FiClock, FiCheckCircle, FiXCircle, FiEdit, FiActivity, FiPlus, FiLogOut}  from 'react-icons/fi';
import api from '../services/api';
import AppNavbar from '../components/layout/Navbar';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        total_expedientes: 0,
        en_registro: 0,
        en_revision: 0,
        aprobados: 0,
        rechazados: 0,
        total_indicios: 0
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        obtenerDatos();
    }, []);

    const obtenerDatos = async () => {
        try {
            if (user?.rol !== 'COORDINADOR' && user?.rol !== 'ADMIN') {
                console.log('No autorizado para ver estadísticas');
                return;
            }else{
                console.log('Autorizado para ver estadísticas');
                const response = await api.get('/reportes');
                if (response.data.success) {
                    setStats(response.data.data.estadisticas);
                }
            }
            
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="min-vh-100" style={{ backgroundColor: '#f5f5f5' }}>
            <AppNavbar />

            <Container>
                <Row className="mb-4">
                    <Col>
                        <h2>Usuario: {user?.nombre}</h2>
                        <p className="text-muted">Panel de control</p>
                    </Col>
                </Row>

                {(user?.rol === 'COORDINADOR' || user?.rol === 'ADMIN') && (
                    <Row className="g-3 mb-4">
                    <Col md={4}>
                        <Card className="h-100 border-start border-primary border-4">
                            <Card.Body>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <small className="text-muted">Total Expedientes</small>
                                        <h3>{loading ? '...' : stats.total_expedientes}</h3>
                                    </div>
                                    <FiFolder size={40} className="text-primary" />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="h-100 border-start border-warning border-4">
                            <Card.Body>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <small className="text-muted">En Revisión</small>
                                        <h3>{loading ? '...' : stats.en_revision}</h3>
                                    </div>
                                    <FiClock size={40} className="text-warning" />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="h-100 border-start border-success border-4">
                            <Card.Body>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <small className="text-muted">Aprobados</small>
                                        <h3>{loading ? '...' : stats.aprobados}</h3>
                                    </div>
                                    <FiCheckCircle size={40} className="text-success" />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="h-100 border-start border-danger border-4">
                            <Card.Body>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <small className="text-muted">Rechazados</small>
                                        <h3>{loading ? '...' : stats.rechazados}</h3>
                                    </div>
                                    <FiXCircle size={40} className="text-danger" />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="h-100 border-start border-info border-4">
                            <Card.Body>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <small className="text-muted">En Registro</small>
                                        <h3>{loading ? '...' : stats.en_registro}</h3>
                                    </div>
                                    <FiEdit size={40} className="text-info" />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={4}>
                        <Card className="h-100 border-start border-primary border-4">
                            <Card.Body>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <small className="text-muted">Total Indicios</small>
                                        <h3>{loading ? '...' : stats.total_indicios}</h3>
                                    </div>
                                    <FiActivity size={40} className="text-primary" />
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                )}

                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <h5 className="mb-3">Acciones Rápidas</h5>
                                <div className="d-flex flex-wrap gap-2">
                                    {user?.rol !== 'COORDINADOR' && (
                                        <Button variant="primary" onClick={() => navigate('/expedientes/nuevo')}>
                                            <FiPlus className="me-1" />
                                            Nuevo Expediente
                                        </Button>
                                    )}

                                    <Button variant="outline-primary" onClick={() => navigate('/expedientes')}>
                                        Ver Expedientes
                                    </Button>

                                    {(user?.rol === 'COORDINADOR' || user?.rol === 'ADMIN') && (
                                        <>
                                            <Button variant="outline-warning" onClick={() => navigate('/revision')}>
                                                Expedientes en Revisión
                                            </Button>

                                            <Button variant="outline-info" onClick={() => navigate('/reportes')}>
                                                Ver Reportes
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Dashboard;
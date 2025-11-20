import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import { FiLogOut, FiSearch } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import api from '../services/api';

const Reportes = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        fechaInicio: '',
        fechaFin: ''
    });
    const [reporte, setReporte] = useState(null);
    useEffect(() => {
        btnGenerarReporte();
    }, []);

    const btnGenerarReporte = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams(filters).toString();
            const response = await api.get(`/reportes?${params}`);
            if (response.data.success) {
                setReporte(response.data.data);
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
                        <h2>Reportes</h2>
                        <p className="text-muted">Expedientes</p>
                    </Col>
                </Row>

                <Card className="mb-3">
                    <Card.Body>
                        <h6 className="mb-3">Filtros de Reporte</h6>
                        <Row className="g-2">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Fecha Inicio</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={filters.fechaInicio}
                                        onChange={(e) => setFilters({ ...filters, fechaInicio: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Fecha Fin</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={filters.fechaFin}
                                        onChange={(e) => setFilters({ ...filters, fechaFin: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4} className="d-flex align-items-end">
                                <Button variant="primary" className="w-100" onClick={btnGenerarReporte}>
                                    <FiSearch className="me-1" />
                                    Generar Reporte
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary"></div>
                    </div>
                )}

                {!loading && reporte && (
                    <>
                        <Row className="g-3 mb-4">
                            <Col md={4}>
                                <Card className="border-start border-primary border-4">
                                    <Card.Body>
                                        <small className="text-muted">Total Expedientes</small>
                                        <h3>{reporte.estadisticas.total_expedientes}</h3>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={4}>
                                <Card className="border-start border-warning border-4">
                                    <Card.Body>
                                        <small className="text-muted">En Registro</small>
                                        <h3>{reporte.estadisticas.en_registro}</h3>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={4}>
                                <Card className="border-start border-info border-4">
                                    <Card.Body>
                                        <small className="text-muted">En Revisión</small>
                                        <h3>{reporte.estadisticas.en_revision}</h3>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={4}>
                                <Card className="border-start border-success border-4">
                                    <Card.Body>
                                        <small className="text-muted">Aprobados</small>
                                        <h3>{reporte.estadisticas.aprobados}</h3>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={4}>
                                <Card className="border-start border-danger border-4">
                                    <Card.Body>
                                        <small className="text-muted">Rechazados</small>
                                        <h3>{reporte.estadisticas.rechazados}</h3>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={4}>
                                <Card className="border-start border-primary border-4">
                                    <Card.Body>
                                        <small className="text-muted">Total Indicios</small>
                                        <h3>{reporte.estadisticas.total_indicios}</h3>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>

                        <Card className="mb-3">
                            <Card.Body>
                                <h5 className="mb-3">Expedientes por Técnico</h5>
                                <Table responsive hover>
                                    <thead className="table-light">
                                        <tr>
                                            <th>Técnico</th>
                                            <th className="text-center">Total</th>
                                            <th className="text-center">Aprobados</th>
                                            <th className="text-center">Rechazados</th>
                                            <th className="text-center">En Proceso</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reporte.porTecnico && reporte.porTecnico.length > 0 ? (
                                            reporte.porTecnico.map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.tecnico}</td>
                                                    <td className="text-center">{item.total_expedientes}</td>
                                                    <td className="text-center text-success fw-bold">{item.aprobados}</td>
                                                    <td className="text-center text-danger fw-bold">{item.rechazados}</td>
                                                    <td className="text-center text-warning fw-bold">
                                                        {item.total_expedientes - item.aprobados - item.rechazados}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center">No hay datos</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                        <Card>
                            <Card.Body>
                                <h5 className="mb-3">Expedientes por Día</h5>
                                <Table responsive hover>
                                    <thead className="table-light">
                                        <tr>
                                            <th>Fecha</th>
                                            <th className="text-center">Total</th>
                                            <th className="text-center">Aprobados</th>
                                            <th className="text-center">Rechazados</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reporte.porDia && reporte.porDia.length > 0 ? (
                                            reporte.porDia.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        {format(new Date(item.fecha), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                                                    </td>
                                                    <td className="text-center">{item.total}</td>
                                                    <td className="text-center text-success fw-bold">{item.aprobados}</td>
                                                    <td className="text-center text-danger fw-bold">{item.rechazados}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center">No hay datos</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </>
                )}
            </Container>
        </div>
    );
};

export default Reportes;
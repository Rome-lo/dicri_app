import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Table, Button, Form, Badge } from 'react-bootstrap';
import { FiEye, FiPlus, FiLogOut } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import expedienteService from '../services/expedienteService';

const Expedientes = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [expedientes, setExpedientes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        fechaInicio: '',
        fechaFin: '',
        estado: ''
    });

    useEffect(() => {
        obtenerExpedientes();
    }, []);

    const obtenerExpedientes = async () => {
        setLoading(true);
        try {
            const response = await expedienteService.obtenerExpedientes(filters);
            if (response.success) {
                setExpedientes(response.data);
            }

        } catch (error) {
            console.error('Error:', error);

        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getEstadoColor = (estado) => {
        const colores = {
            'EN_REGISTRO': 'warning',
            'EN_REVISION': 'info',
            'APROBADO': 'success',
            'RECHAZADO': 'danger'
        };
        return colores[estado] || 'secondary';
    };


    const getEstadoTexto = (estado) => {

        const textos = {
            'EN_REGISTRO': 'En Registro',
            'EN_REVISION': 'En Revisión',
            'APROBADO': 'Aprobado',
            'RECHAZADO': 'Rechazado'
        };
        return textos[estado] || estado;
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
                        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                            <FiLogOut className="me-1" />
                            Salir
                        </button>
                    </div>
                </div>
            </nav>

            <Container>
                <Row className="mb-4">
                    <Col>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h2>Expedientes Registrados</h2>
                                <p className="text-muted">Listado de expedientes</p>
                            </div>
                            {user?.rol !== 'COORDINADOR' && (
                                <Button variant="primary" onClick={() => navigate('/expedientes/nuevo')}>
                                    <FiPlus className="me-1" />
                                    Nuevo Expediente
                                </Button>
                            )}
                        </div>
                    </Col>
                </Row>

                <Card className="mb-3">
                    <Card.Body>
                        <h6 className="mb-3">Filtros</h6>
                        <Row className="g-2">
                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Fecha Inicio</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={filters.fechaInicio}
                                        onChange={(e) => setFilters({ ...filters, fechaInicio: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Fecha Fin</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={filters.fechaFin}
                                        onChange={(e) => setFilters({ ...filters, fechaFin: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={3}>
                                <Form.Group>
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Select
                                        value={filters.estado}
                                        onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                                    >
                                        <option value="">Todos</option>
                                        <option value="EN_REGISTRO">En Registro</option>
                                        <option value="EN_REVISION">En Revisión</option>
                                        <option value="APROBADO">Aprobado</option>
                                        <option value="RECHAZADO">Rechazado</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={3} className="d-flex align-items-end">
                                <Button variant="primary" className="w-100" onClick={obtenerExpedientes}>
                                    Buscar
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

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
                                        <th>Fecha</th>
                                        <th className="text-center">Indicios</th>
                                        <th className="text-center">Estado</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expedientes.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4">
                                                No hay expedientes
                                            </td>
                                        </tr>
                                    ) : (
                                        expedientes.map((exp) => (
                                            <tr key={exp.id}>
                                                <td><strong>{exp.numero_expediente}</strong></td>
                                                <td>{exp.descripcion}</td>
                                                <td>{exp.tecnico_nombre}</td>
                                                <td>{format(new Date(exp.fecha_registro), 'dd/MM/yyyy', { locale: es })}</td>
                                                <td className="text-center">
                                                    <Badge bg="primary" pill>{exp.total_indicios}</Badge>
                                                </td>
                                                <td className="text-center">
                                                    <Badge bg={getEstadoColor(exp.estado)}>
                                                        {getEstadoTexto(exp.estado)}
                                                    </Badge>
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

export default Expedientes;
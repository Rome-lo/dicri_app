import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FiSave, FiX, FiLogOut } from 'react-icons/fi';
import expedienteService from '../services/expedienteService';

const NuevoExpediente = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [formData, setFormData] = useState({
        numero_expediente: '',
        descripcion: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const btnAceptar = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await expedienteService.crearExpediente(formData);

            if (response.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate(`/expedientes/${response.data.id}`);
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error al crear expediente');
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
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card>
                            <Card.Body className="p-4">
                                <h4 className="mb-4">Crear Nuevo Expediente</h4>

                                {error && (
                                    <Alert variant="danger" dismissible onClose={() => setError('')}>
                                        {error}
                                    </Alert>
                                )}

                                {success && (
                                    <Alert variant="success">
                                        Expediente creado exitosamente.
                                    </Alert>
                                )}

                                <Form onSubmit={btnAceptar}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Número de Expediente</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="numero_expediente"
                                            value={formData.numero_expediente}
                                            onChange={handleChange}
                                            placeholder="MP-2025-001"
                                            required
                                        />
                                        <Form.Text className="text-muted">
                                            Formato: MP-YYYY-NNN
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Descripción</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="descripcion"
                                            value={formData.descripcion}
                                            onChange={handleChange}
                                            placeholder="Descripción del caso..."
                                            required
                                        />
                                    </Form.Group>

                                    <div className="d-flex gap-2">
                                        <Button type="submit" variant="primary" disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" />
                                                    Guardando...
                                                </>
                                            ) : (
                                                <>
                                                    <FiSave className="me-2" />
                                                    Crear
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            onClick={() => navigate('/expedientes')}
                                            disabled={loading}
                                        >
                                            <FiX className="me-2" />
                                            Cacelar
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default NuevoExpediente;
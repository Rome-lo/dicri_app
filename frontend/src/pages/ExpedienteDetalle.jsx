import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {Container, Row,Col,Card,Button,Badge,Table,Modal,Form,Alert} from 'react-bootstrap';
import { FiArrowLeft, FiPlus, FiTrash2, FiSend, FiCheckCircle, FiXCircle, FiLogOut } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import expedienteService from '../services/expedienteService';

const ExpedienteDetalle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [expediente, setExpediente] = useState(null);
    const [indicios, setIndicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModalIndicio, setShowModalIndicio] = useState(false);
    const [showModalRechazo, setShowModalRechazo] = useState(false);
    const [justificacion, setJustificacion] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    const [nuevoIndicio, setNuevoIndicio] = useState({
        descripcion: '',
        color: '',
        tamanio: '',
        peso: '',
        ubicacion: ''
    });

    useEffect(() => {
        obtenerDatos();
    }, [id]);

    const obtenerDatos = async () => {
        try {
            const [expRes, indRes] = await Promise.all([
                expedienteService.obtenerExpedientePorId(id),
                expedienteService.obtenerIndiciosPorExpediente(id)
            ]);


            if (expRes.success) setExpediente(expRes.data);
            if (indRes.success) setIndicios(indRes.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }

    };

    const agregarIndicio = async () => {
        try {
            const response = await expedienteService.crearIndicio(id, nuevoIndicio);
            if (response.success) {
                setMessage({ type: 'success', text: 'Indicio agregado' });
                setShowModalIndicio(false);
                setNuevoIndicio({ descripcion: '', color: '', tamanio: '', peso: '', ubicacion: '' });
                obtenerDatos();
            }
        } catch (error) {
            setMessage({ type: 'danger', text: 'Error al agregar indicio' });
        }
    };

    const eliminarIndicio = async (indicioId) => {

        if (window.confirm('¿Eliminar este indicio?')) {
            try {

                await expedienteService.eliminarIndicio(indicioId);
                setMessage({ type: 'success', text: 'Indicio eliminado' });
                obtenerDatos();
            } catch (error) {
                setMessage({ type: 'danger', text: 'Error al eliminar' });
            }
        }
    };

    const enviarARevision = async () => {
        if (indicios.length === 0) {
            setMessage({ type: 'danger', text: 'Debe agregar al menos un indicio' });
            return;
        }

        try {
            await expedienteService.enviarARevision(id);
            setMessage({ type: 'success', text: 'Expediente enviado a revisión' });
            obtenerDatos();
        } catch (error) {
            setMessage({ type: 'danger', text: 'Error al enviar a revisión' });
        }
    };

    const aprobarExpediente = async () => {
        try {
            await expedienteService.aprobarExpediente(id);
            setMessage({ type: 'success', text: 'Expediente aprobado' });
            obtenerDatos();

        } catch (error) {
            setMessage({ type: 'danger', text: 'Error al aprobar' });
        }

    };

    const rechazarExpediente = async () => {
        if (!justificacion.trim()) {
            setMessage({ type: 'danger', text: 'Debe ingresar una justificación' });
            return;
        }

        try {
            await expedienteService.rechazarExpediente(id, justificacion);
            setMessage({ type: 'success', text: 'Expediente rechazado' });
            setShowModalRechazo(false);
            setJustificacion('');
            obtenerDatos();
        } catch (error) {
            setMessage({ type: 'danger', text: 'Error al rechazar' });
        }
    };

    const cerrarSesion = () => {
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



    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary"></div>
            </div>
        );


    }
    if (!expediente) {
        return <div className="text-center mt-5">Expediente no encontrado</div>;
    }

    const puedeEditar = expediente.estado === 'EN_REGISTRO' &&
        (user.id === expediente.tecnico_id || user.rol === 'ADMIN');
    const puedeAprobar = expediente.estado === 'EN_REVISION' &&
        (user.rol === 'COORDINADOR' || user.rol === 'ADMIN');

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
                <Row className="mb-3">
                    <Col>
                        <Button variant="outline-secondary" size="sm" onClick={() => navigate('/expedientes')}>
                            <FiArrowLeft className="me-1" />
                            Volver
                        </Button>
                    </Col>
                </Row>
                {message.text && (
                    <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                        {message.text}
                    </Alert>
                )}


                <Card className="mb-3">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <h4>{expediente.numero_expediente}</h4>
                            <Badge bg={getEstadoColor(expediente.estado)}>
                                {getEstadoTexto(expediente.estado)}
                            </Badge>
                        </div>

                        <Row>

                            <Col md={6}>
                                <p><strong>Descripcion:</strong></p>
                                <p>{expediente.descripcion}</p>
                            </Col>

                            <Col md={6}>
                                <p><strong>Técnico:</strong> {expediente.tecnico_nombre}</p>
                                <p><strong>Fecha:</strong> {format(new Date(expediente.fecha_registro), "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
                                <p><strong>Indicios:</strong> {indicios.length}</p>

                                {expediente.coordinador_nombre && (
                                    <p><strong>Revisado por:</strong> {expediente.coordinador_nombre}</p>
                                )}

                                {expediente.justificacion_rechazo && (
                                    <div className="alert alert-danger mt-2">
                                        <strong>Motivo de rechazo:</strong><br />
                                        {expediente.justificacion_rechazo}
                                    </div>
                                )}
                            </Col>
                        </Row>
                        <hr />
                        <div className="d-flex flex-wrap gap-2">
                            {puedeEditar && (
                                <>
                                    <Button variant="primary" onClick={() => setShowModalIndicio(true)}>
                                        <FiPlus className="me-1" />
                                        Agregar Indicio
                                    </Button>

                                    <Button
                                        variant="info"
                                        onClick={enviarARevision}
                                        disabled={indicios.length === 0}
                                    >
                                        <FiSend className="me-1" />
                                        Enviar a Revisión
                                    </Button>
                                </>
                            )}

                            {puedeAprobar && (
                                <>
                                    <Button variant="success" onClick={aprobarExpediente}>
                                        <FiCheckCircle className="me-1" />
                                        Aprobar
                                    </Button>

                                    <Button variant="danger" onClick={() => setShowModalRechazo(true)}>
                                        <FiXCircle className="me-1" />
                                        Rechazar
                                    </Button>
                                </>
                            )}
                        </div>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body>
                        <h5 className="mb-3">Indicios Registrados</h5>
                        <Table responsive hover>
                            <thead className="table-light">
                                <tr>
                                    <th>Descripción</th>
                                    <th>Color</th>
                                    <th>Tamaño</th>
                                    <th>Peso</th>
                                    <th>Ubicación</th>
                                    {puedeEditar && <th className="text-center">Acciones</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {indicios.length === 0 ? (
                                    <tr>
                                        <td colSpan={puedeEditar ? "6" : "5"} className="text-center py-4">
                                            No hay indicios registrados
                                        </td>
                                    </tr>
                                ) : (
                                    indicios.map((indicio) => (
                                        <tr key={indicio.id}>
                                            <td>{indicio.descripcion}</td>
                                            <td>{indicio.color || '-'}</td>
                                            <td>{indicio.tamanio || '-'}</td>
                                            <td>{indicio.peso || '-'}</td>
                                            <td>{indicio.ubicacion || '-'}</td>
                                            {puedeEditar && (
                                                <td className="text-center">
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => eliminarIndicio(indicio.id)}
                                                    >
                                                        <FiTrash2 />
                                                    </Button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
            <Modal show={showModalIndicio} onHide={() => setShowModalIndicio(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Indicio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={nuevoIndicio.descripcion}
                                onChange={(e) => setNuevoIndicio({ ...nuevoIndicio, descripcion: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Color</Form.Label>
                            <Form.Control
                                type="text"
                                value={nuevoIndicio.color}
                                onChange={(e) => setNuevoIndicio({ ...nuevoIndicio, color: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tamaño</Form.Label>
                            <Form.Control
                                type="text"
                                value={nuevoIndicio.tamanio}
                                onChange={(e) => setNuevoIndicio({ ...nuevoIndicio, tamanio: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Peso</Form.Label>
                            <Form.Control
                                type="text"
                                value={nuevoIndicio.peso}
                                onChange={(e) => setNuevoIndicio({ ...nuevoIndicio, peso: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Ubicación</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={nuevoIndicio.ubicacion}
                                onChange={(e) => setNuevoIndicio({ ...nuevoIndicio, ubicacion: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalIndicio(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={agregarIndicio}
                        disabled={!nuevoIndicio.descripcion.trim()}
                    >
                        Agregar
                    </Button>
                </Modal.Footer>
            </Modal>



            <Modal show={showModalRechazo} onHide={() => setShowModalRechazo(false)}>
                <Modal.Header closeButton>

                    <Modal.Title>Rechazar Expediente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Justificación *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={justificacion}
                                onChange={(e) => setJustificacion(e.target.value)}
                                placeholder="Ingrese el motivo del rechazo..."
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalRechazo(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="danger"
                        onClick={rechazarExpediente}
                        disabled={!justificacion.trim()}
                    >
                        Rechazar Expediente
                        
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ExpedienteDetalle;
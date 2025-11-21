import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar, Container, Nav, Badge, Button, logout } from 'react-bootstrap';
import { FiLogOut } from 'react-icons/fi';

const AppNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const cerrarSesion = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="md" className="navbar-custom mb-4">
            <Container fluid>
                <Navbar.Brand onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                    Sistema DICRI - Evaluación
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="align-items-center">
                        <span className="text-white me-3">
                            <span className="fw-bold">Usuario: </span> {user?.nombre}
                        </span>
                        <Badge bg="light" text="dark" className="me-3">
                            {user?.rol}
                        </Badge>
                        <Button
                            variant="outline-light"
                            size="sm"
                            onClick={cerrarSesion}
                            className="btn-logout"
                        >
                            <FiLogOut className="me-1" />
                            Salir
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
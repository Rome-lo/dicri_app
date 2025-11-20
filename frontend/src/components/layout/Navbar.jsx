import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar, Container, Nav, Badge, Button } from 'react-bootstrap';
import { FiLogOut } from 'react-icons/fi';

const AppNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="navbar-custom mb-4">
            <Container fluid>
                <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    Sistema DICRI - Evaluación
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="align-items-center">
                        <span className="text-white me-3">
                            {user?.nombre}
                        </span>
                        <Badge bg="light" text="dark" className="me-3">
                            {user?.rol}
                        </Badge>
                        <Button
                            variant="outline-light"
                            size="sm"
                            onClick={handleLogout}
                            className="btn-logout"
                        >
                            <FiLogOut className="me-1" />
                            Cerrar Sesión
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;
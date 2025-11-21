import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();


    const navigate = useNavigate();

    const logear = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard', { replace: true });
        } catch (err) {
            console.error('Error al iniciar sesión:', err);
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }

        
    };

    return (
        
        <div className="login-background">
            <div className="login-overlay" />
            <Container className="login-container">
                <div className="d-flex justify-content-center align-items-center min-vh-100">
                    <Card className="login-card shadow-lg">
                        <Card.Body className="p-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold text-principal" >DICRI APP</h2>
                                
                                <small>Gestión de Evidencias Criminalísticas</small>
                            </div>
                            {error && (
                                <Alert variant="danger" dismissible onClose={() => setError('')}>
                                    {error}
                                </Alert>
                            )}
                            <Form onSubmit={logear}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Correo Electrónico</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <FiMail />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="email"
                                            placeholder="Ingrese su correo electrónico"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            autoFocus
                                        />
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className="mb-4">
                                    <Form.Label>Contraseña</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <FiLock />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type={'password'}
                                            placeholder="Ingrese su contraseña"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-100 py-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Iniciando sesión...
                                        </>
                                    ) : (
                                        <>
                                            <FiLogIn className="me-2" />
                                            Iniciar Sesión
                                        </>
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
            </Container>
            </div>
    );
};

export default Login;
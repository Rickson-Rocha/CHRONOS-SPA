import { Card, Typography, Row, Col } from 'antd';
import logo from '../assets/logo.svg';
import { useAuth } from '../contexts/AuthContext';

const { Title, Paragraph } = Typography;

const Home = () => {
    const { user } = useAuth();

    return (
        <Row justify="center" align="middle" style={{ minHeight: '80vh', background: '#f5f7fa' }}>
            <Col xs={24} sm={20} md={16} lg={12} xl={10}>
                <Card
                    bordered={false}
                    style={{
                        borderRadius: 16,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
                        padding: 32,
                        background: '#fff'
                    }}
                    bodyStyle={{ padding: 32 }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <img
                            src={logo}
                            alt="Logo Chronos"
                            style={{ width: 180, marginBottom: 32 }}
                        />
                        <Title level={2} style={{ fontWeight: 700, marginBottom: 8, color: '#1a237e' }}>
                            Bem-vindo(a) ao Sistema Chronos!
                        </Title>
                        <Paragraph style={{ color: '#555', fontSize: 18, marginBottom: 24 }}>
                            Seu portal para gerenciamento de ponto.
                        </Paragraph>

                        {user?.role === 'ROLE_EMPLOYEE' && (
                            <Paragraph style={{ color: '#607d8b', fontSize: 16 }}>
                                Use o menu ao lado para <b>registrar</b> e <b>consultar</b> seus pontos.
                            </Paragraph>
                        )}

                        {user?.role === 'ROLE_MANAGER' && (
                            <Paragraph style={{ color: '#607d8b', fontSize: 16 }}>
                                Use o menu ao lado para <b>gerenciar</b> os colaboradores.
                            </Paragraph>
                        )}
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default Home;
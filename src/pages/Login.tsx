

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Alert} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import type { LoginCredentials } from '../types/auth';
import logo from '../assets/logo.svg'; 

const { Title } = Typography;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  card: {
    width: 400,
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '24px',
  },
  logo: {
    height: '48px',
  },
};

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const onFinish = async (values: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      await login(values);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Logo" style={styles.logo} />
          <Title level={3}>Chronos Sistema de Ponto</Title>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          {error && <Alert message={error} type="error" showIcon closable style={{ marginBottom: 24 }} onClose={() => setError(null)} />}

          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: 'Por favor, insira um email válido!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Senha" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
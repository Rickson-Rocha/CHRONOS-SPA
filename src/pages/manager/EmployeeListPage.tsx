import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Button, Table, Space, message, Tag, Typography, Card, Row, Col } from 'antd';
import { EyeOutlined, UserAddOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';

import apiService from '../../services/ApiService';
import type { Employee } from '../../types/user';
import { useAuth } from '../../contexts/AuthContext';
import RegisterEmployeeModal from '../../components/RegisterEmployeeModal'; 

function formatCPF(cpf: string) {
    if (!cpf) return '';
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
}
const { Title } = Typography;

function EmployeeListPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            fetchEmployees();
        }
    }, [isAuthenticated]);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            
            const response = await apiService.getUsers();
             const employeesOnly = response.content.filter(user => user.role !== 'ROLE_MANAGER');
            setEmployees(employeesOnly);
        } catch (error) {
            message.error("Erro ao carregar a lista de colaboradores.");
        } finally {
            setLoading(false);
        }
    };

    const columns: TableProps<Employee>['columns'] = [
        {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (text: string) => <b>{text}</b>,
        },
        {
            title: 'E-mail',
            dataIndex: 'email',
            key: 'email',
            render: (email: string) => <span style={{ color: '#555' }}>{email}</span>,
        },
        {
            title: 'CPF',
            dataIndex: 'cpf',
            key: 'cpf',
            render: (cpf: string) => <span style={{ letterSpacing: 1 }}>{formatCPF(cpf)}</span>
        },
       
        {
            title: 'Jornada',
            dataIndex: ['workJourneyInfoDTO', 'description'],
            key: 'journey',
            render: (desc: string) => desc ? <span>{desc}</span> : <Tag color="default">Não definida</Tag>,
        },
        {
            title: 'Ações',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        type="primary" 
                        icon={<EyeOutlined />} 
                        onClick={() => navigate(`/employees/${record.id}`)} 
                        size="small"
                    >
                        Detalhes
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Row justify="center" style={{ marginTop: 32 }}>
            <Col xs={24} sm={22} md={20} lg={18} xl={16}>
                <Card
                    bordered={false}
                    style={{ borderRadius: 12, boxShadow: '0 2px 12px #f0f1f2' }}
                    bodyStyle={{ padding: 32 }}
                >
                    <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                        <Col>
                            <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
                                Gestão de Colaboradores
                            </Title>
                        </Col>
                        <Col>
                            <Button 
                                type="primary" 
                                icon={<UserAddOutlined />}
                                onClick={() => setIsModalOpen(true)}
                                size="large"
                                style={{ fontWeight: 500 }}
                            >
                                Novo Colaborador
                            </Button>
                        </Col>
                    </Row>
                    
                    <Table
                        columns={columns}
                        dataSource={employees}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 10, showSizeChanger: false }}
                        bordered
                        size="middle"
                        style={{ background: '#fff', borderRadius: 8 }}
                    />

                    <RegisterEmployeeModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={() => {
                            setIsModalOpen(false); 
                            fetchEmployees();    
                        }}
                    />
                </Card>
            </Col>
        </Row>
    );
}

export default EmployeeListPage;
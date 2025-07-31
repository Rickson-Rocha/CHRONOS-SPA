import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Descriptions, Spin, Alert, Typography, Tag, List, DatePicker, Statistic, Row, Col, Avatar } from 'antd';
import { ArrowLeftOutlined, LoginOutlined, LogoutOutlined, UserOutlined, IdcardOutlined, CalendarOutlined, ClockCircleOutlined, FieldTimeOutlined, CheckCircleOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import apiService from '../../services/ApiService';
import type { EmployeeDetailsResponse } from '../../types/user';

const { Title, Text } = Typography;


const getStatusConfig = (status: string) => {
    console.log("FUNÇÃO getStatusConfig FOI CHAMADA COM O STATUS:", status);
    switch (status) {
        case 'COMPLETED':
            return { color: 'green', text: 'Jornada Completa', icon: <CheckCircleOutlined /> };
        case 'OVERTIME':
            return { color: 'gold', text: 'Horas Extras', icon: <ClockCircleOutlined /> };
        case 'IN_PROGRESS':
            return { color: 'blue', text: 'Em Andamento', icon: <SyncOutlined spin /> };
        case 'INCOMPLETE':
            return { color: 'red', text: 'Jornada Incompleta', icon: <ExclamationCircleOutlined /> };
        case 'NOT_STARTED':
            return { color: 'orange', text: 'Não Iniciada', icon: <ExclamationCircleOutlined /> };
        default:
            return { color: 'default', text: status, icon: <ClockCircleOutlined /> };
    }
};

export default function EmployeeDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [details, setDetails] = useState<EmployeeDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

    const fetchDetails = async (dateToFetch: Dayjs) => {
        if (!id) return;
        setLoading(true);
        try {
            const dateString = dateToFetch.format('YYYY-MM-DD');
            const data = await apiService.getEmployeeDetailsByDate(Number(id), dateString);
            setDetails(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Não foi possível carregar os detalhes do colaborador.");
            setDetails(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        
        fetchDetails(selectedDate);
    }, [id]);

    const handleDateChange = (date: Dayjs | null) => {
        if (date) {
            setSelectedDate(date);
            fetchDetails(date); 
        }
    };

    if (loading && !details) {
        return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
    }

    if (error) {
        return <div className="p-8"><Alert message="Erro" description={error} type="error" showIcon /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} className="!px-0 !mb-2">
                    Voltar para a lista
                </Button>
                <Title level={2}>Detalhes do Colaborador</Title>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
                
             
                <aside className="lg:col-span-1 space-y-6">
                    <Card>
                        <div className="flex flex-col items-center text-center p-4">
                            <Avatar size={64} icon={<UserOutlined />} className="mb-4" />
                            <Title level={4}>{details?.user.name}</Title>
                            <Text type="secondary">{details?.user.email}</Text>
                            <Tag color={details?.user.role === 'ROLE_MANAGER' ? 'cyan' : 'geekblue'} className="mt-2">
                                {details?.user.role.replace('ROLE_', '').toLowerCase()}
                            </Tag>
                        </div>
                        <Descriptions layout="vertical" bordered column={1} size="small" className="mt-4">
                            <Descriptions.Item label={<IdcardOutlined className="mr-2" />}>{details?.user.cpf}</Descriptions.Item>
                            <Descriptions.Item label={<CalendarOutlined className="mr-2" />}>
                                {details?.user.workJourneyInfoDTO.description}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </aside>

               
                <main className="lg:col-span-2 space-y-6">
                    <Card>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
                            <Title level={4} className="!mb-0">Resumo da Jornada</Title>
                            <DatePicker onChange={handleDateChange} value={selectedDate} allowClear={false} format="DD/MM/YYYY" />
                        </div>
                        {loading ? <div className="text-center py-8"><Spin /></div> : (
                            details?.summary ? (
                                <Row gutter={[16, 24]}>
                                    <Col xs={12} md={6}><Statistic title="Horas Trabalhadas" value={details.summary.summary.totalWork.asString} prefix={<ClockCircleOutlined />} /></Col>
                                    <Col xs={12} md={6}><Statistic title="Total de Pausa" value={details.summary.summary.totalBreak.asString} prefix={<FieldTimeOutlined />} /></Col>
                                    <Col xs={12} md={6}><Statistic title="Saldo" value={details.summary.summary.balance} valueStyle={{ color: details.summary.summary.balance.startsWith('-') ? '#cf1322' : '#3f8600' }}/></Col>
                                    <Col xs={12} md={6}>
                                        <Statistic title="Status" valueRender={() => {
                                            const statusConfig = getStatusConfig(details.summary.summary.status);
                                            return <Tag icon={statusConfig.icon} color={statusConfig.color}>{statusConfig.text}</Tag>;
                                        }} />
                                    </Col>
                                </Row>
                            ) : (
                                <Text type="secondary">Nenhum registro encontrado para esta data.</Text>
                            )
                        )}
                    </Card>

                    <Card>
                        <Title level={4} className="!mb-4">Registros de Ponto do Dia</Title>
                        <List
                            size="small"
                            dataSource={details?.summary?.timeEntries || []}
                            renderItem={(isoString: string, index: number) => {
                                const date = new Date(isoString);
                                const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
                                const isEntry = index % 2 === 0;
                                const icon = isEntry ? <LoginOutlined className="text-green-600" /> : <LogoutOutlined className="text-red-600" />;
                                const label = isEntry ? "Entrada" : "Saída";
                                return (
                                    <List.Item>
                                        <div className="flex items-center space-x-2">
                                            {icon}
                                            <Text>{label} às <span className="font-semibold">{formattedTime}</span></Text>
                                        </div>
                                    </List.Item>
                                );
                            }}
                            locale={{ emptyText: "Nenhum registro de ponto para a data selecionada." }}
                        />
                    </Card>
                </main>
            </div>
        </div>
    );
}
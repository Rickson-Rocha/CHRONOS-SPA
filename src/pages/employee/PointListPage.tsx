import { useState, useEffect } from 'react';
import { Button, message, Typography, Spin, Alert, Row, Col, Card, Statistic, DatePicker, Tag, Timeline, Descriptions, Avatar } from 'antd';
import { ClockCircleOutlined, LoginOutlined, LogoutOutlined, CheckCircleOutlined, ExclamationCircleOutlined, SyncOutlined, FieldTimeOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import apiService from '../../services/ApiService';
import { useAuth } from '../../contexts/AuthContext';
import type { DailySummary } from '../../types/user';
import RegisterPointModal from '../../components/RegisterPointModal';

const { Title, Text } = Typography;

const getStatusConfig = (status: string) => {
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

export default function PointListPage() {
    const { user } = useAuth();
    const [summary, setSummary] = useState<DailySummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

    const fetchSummary = async (dateToFetch: Dayjs) => {
        setLoading(true);
        try {
            const dateString = dateToFetch.format('YYYY-MM-DD');
            const data = await apiService.getPointSummaryByDate(dateString);
            setSummary(data);
        } catch (error) {
            message.error(`Erro ao carregar o resumo para a data ${dateToFetch.format('DD/MM/YYYY')}.`);
            setSummary(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchSummary(selectedDate);
        }
    }, [user]);

    const handleDateChange = (date: Dayjs | null) => {
        if (date) {
            setSelectedDate(date);
            fetchSummary(date);
        }
    };

    const onPointRegistered = () => {
        setIsModalOpen(false);
        fetchSummary(selectedDate);
    };

    if (loading && !summary) {
        return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;
    }

    if (!summary) {
        return <div className="p-4 md:p-8"><Alert message="Nenhum dado encontrado" description="Você não possui registros de ponto para a data selecionada." type="info" showIcon /></div>;
    }

    const statusConfig = getStatusConfig(summary.summary.status);

    return (
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
            
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <Title level={2} className="!mb-1 text-2xl sm:text-3xl">Meu Ponto</Title>
                    <Text type="secondary">Visualize e gerencie seus registros de ponto diários.</Text>
                </div>
                <DatePicker 
                    onChange={handleDateChange} 
                    value={selectedDate}
                    allowClear={false}
                    format="DD/MM/YYYY"
                    size="large"
                    className="w-full sm:w-auto"
                />
            </div>

            
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">

                
                <main className="lg:col-span-2 space-y-6">
                    <Card>
                        <Row gutter={[16, 24]}>
                            <Col xs={12} sm={6}>
                                <Statistic title="Horas Trabalhadas" value={summary.summary.totalWork.asString} prefix={<ClockCircleOutlined />} />
                            </Col>
                            <Col xs={12} sm={6}>
                                <Statistic title="Total de Pausa" value={summary.summary.totalBreak.asString} prefix={<FieldTimeOutlined />} />
                            </Col>
                            <Col xs={12} sm={6}>
                                <Statistic 
                                    title="Saldo de Horas" 
                                    value={summary.summary.balance}
                                    valueStyle={{ color: summary.summary.balance.startsWith('-') ? '#cf1322' : '#3f8600' }}
                                />
                            </Col>
                            <Col xs={12} sm={6}>
                                <Statistic title="Status" valueRender={() => 
                                    <Tag icon={statusConfig.icon} color={statusConfig.color}>
                                        {statusConfig.text}
                                    </Tag>} 
                                />
                            </Col>
                        </Row>
                    </Card>

                    <Card title={`Registros do Dia - ${selectedDate.format('DD/MM/YYYY')}`}>
                        {summary.timeEntries.length > 0 ? (
                            <Timeline
                                items={summary.timeEntries.map((isoString: string, index: number) => {
                                    const date = new Date(isoString);
                                    const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
                                    const isEntry = index % 2 === 0;
                                    return {
                                        color: isEntry ? 'green' : 'red',
                                        dot: isEntry ? <LoginOutlined /> : <LogoutOutlined />,
                                        children: `${isEntry ? 'Entrada' : 'Saída'} às ${formattedTime}`,
                                    };
                                })}
                            />
                        ) : (
                            <Text type="secondary">Nenhum registro de ponto para esta data.</Text>
                        )}
                    </Card>
                </main>

               
                <aside className="lg:col-span-1 space-y-6">
                    <Card>
                        <div className="text-center">
                            <Title level={4}>Registrar Novo Ponto</Title>
                            <Text type="secondary" className="mb-4 block">Clique abaixo para registrar sua entrada ou saída agora.</Text>
                            <Button 
                                type="primary"
                                icon={<ClockCircleOutlined />}
                                size="large"
                                onClick={() => setIsModalOpen(true)}
                                className="w-full"
                            >
                                Bater Ponto
                            </Button>
                        </div>
                    </Card>
                    <Card>
                         <Title level={5}>Minha Jornada</Title>
                         <Descriptions layout="vertical" bordered column={1} size="small">
                            <Descriptions.Item label="Regime">{summary.workJourney.description}</Descriptions.Item>
                            <Descriptions.Item label="Carga Horária">{summary.workJourney.expectedWorkload.replace('PT','').replace('H', ' Horas')}</Descriptions.Item>
                         </Descriptions>
                    </Card>
                </aside>
            </div>

            <RegisterPointModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={onPointRegistered}
            />
        </div>
    );
}

import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, message,} from 'antd';
import apiService from '../services/ApiService';
import type { CreateUserPayload } from '../types/user';
import type { WorkJourneyOption } from '../types/workJourney';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const { Option } = Select;

function RegisterEmployeeModal({ isOpen, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [journeys, setJourneys] = useState<WorkJourneyOption[]>([]);
  const [journeysLoading, setJourneysLoading] = useState(false);

 
  useEffect(() => {
    if (isOpen) {
      setJourneysLoading(true);
      apiService.getWorkJourneys()
        .then(data => setJourneys(data))
        .catch(() => message.error('Erro ao carregar as jornadas de trabalho.'))
        .finally(() => setJourneysLoading(false));
    }
  }, [isOpen]);

  const handleCreate = async (values: CreateUserPayload) => {
    setLoading(true);
    try {
      await apiService.createUser(values);
      message.success('Colaborador criado com sucesso!');
      onSuccess();
      handleClose(); 
    } catch (error) {
      message.error('Não foi possível criar o colaborador. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Novo Colaborador"
      open={isOpen}
      onCancel={handleClose}
      footer={[
        <Button key="back" onClick={handleClose}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          Salvar
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleCreate} autoComplete="off">
        <Form.Item name="name" label="Nome Completo" rules={[{ required: true, message: 'Por favor, insira o nome.' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="cpf" label="CPF" rules={[{ required: true, message: 'Por favor, insira o CPF.' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Por favor, insira um email válido.' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Senha" rules={[{ required: true, message: 'Por favor, insira uma senha.' }]}>
          <Input.Password />
        </Form.Item>
  
        <Form.Item name="workJourneyId" label="Jornada de Trabalho" rules={[{ required: true, message: 'Selecione uma jornada.' }]}>
          <Select placeholder="Selecione a jornada" loading={journeysLoading}>
            {journeys.map(journey => (
              <Option key={journey.id} value={journey.id}>
                {journey.description}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default RegisterEmployeeModal;

import { useState } from 'react';
import { Modal, Button, message, Typography } from 'antd';
import apiService from '../services/ApiService';

const { Text } = Typography;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function RegisterPointModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
   
    const timestamp = new Date().toISOString();

    try {
      await apiService.registerPoint(timestamp);
      message.success('Ponto registrado com sucesso!');
      onSuccess(); 
      onClose();   
    } catch (error) {
      message.error('Não foi possível registrar o ponto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Registrar Novo Ponto"
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleRegister}>
          Confirmar Registro
        </Button>,
      ]}
    >
      <Text>Você confirma o registro de ponto no horário atual?</Text>
    </Modal>
  );
}

export default RegisterPointModal;
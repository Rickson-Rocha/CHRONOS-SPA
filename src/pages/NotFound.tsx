import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';

function NotFound() {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Desculpe, a página que você acessou não foi encontrada."
            extra={<Link to="/"><Button type="primary">Voltar para a página inicial</Button></Link>}
        />
    );
}

export default NotFound;
